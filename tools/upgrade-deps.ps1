<# 
Safe dependency upgrade + audit for a Node project.
#>

[CmdletBinding()]
param(
  [string]$Path = ".",
  [switch]$FailOnHigh
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Invoke-Step($Title, [ScriptBlock]$Action) {
  Write-Host "────────────────────────────────────────────────────────────" -ForegroundColor DarkGray
  Write-Host "▶ $Title" -ForegroundColor Cyan
  & $Action
}

function Assert-Command($cmd) {
  if (-not (Get-Command $cmd -ErrorAction SilentlyContinue)) {
    throw "Required command not found: $cmd"
  }
}

function Read-AuditSummary($auditJsonPath) {
  if (-not (Test-Path $auditJsonPath)) { return $null }

  $json = Get-Content $auditJsonPath -Raw | ConvertFrom-Json
  if (-not $json) { return $null }

  $counts = [ordered]@{ low=0; moderate=0; high=0; critical=0 }

  # npm v7+ summary lives here
  if ($json.PSObject.Properties.Name -contains 'metadata' -and
      $json.metadata -and
      ($json.metadata.PSObject.Properties.Name -contains 'vulnerabilities') -and
      $json.metadata.vulnerabilities) {

    foreach ($k in @('low','moderate','high','critical')) {
      if ($json.metadata.vulnerabilities.PSObject.Properties.Name -contains $k) {
        $counts[$k] = [int]$json.metadata.vulnerabilities.$k
      }
    }
  }

  return $counts
}

function Print-RemainingHigh($auditJsonPath, $limit = 20) {
  if (-not (Test-Path $auditJsonPath)) { return }

  $json = Get-Content $auditJsonPath -Raw | ConvertFrom-Json
  if (-not $json) { return }

  # vulnerabilities must be a map/object to enumerate
  if (-not ($json.PSObject.Properties.Name -contains 'vulnerabilities')) { return }
  if (-not $json.vulnerabilities) { return }
  if (-not ($json.vulnerabilities -is [pscustomobject])) { return }

  $items = @()

  foreach ($prop in $json.vulnerabilities.PSObject.Properties) {
    $pkg = $prop.Name
    $v = $prop.Value
    if (-not $v) { continue }

    $sev = if ($v.PSObject.Properties.Name -contains 'severity') { $v.severity } else { $null }
    if ($sev -notin @('high','critical')) { continue }

    $fix = "no"
    if ($v.PSObject.Properties.Name -contains 'fixAvailable' -and $v.fixAvailable) {
      if ($v.fixAvailable -is [bool]) {
        $fix = if ($v.fixAvailable) { "yes" } else { "no" }
      }
      elseif ($v.fixAvailable -is [pscustomobject] -and ($v.fixAvailable.PSObject.Properties.Name -contains 'name')) {
        $fix = "upgrade $($v.fixAvailable.name)@$($v.fixAvailable.version)"
      }
      else {
        $fix = "check"
      }
    }

    $range = if ($v.PSObject.Properties.Name -contains 'range') { $v.range } else { "" }

    $items += [pscustomobject]@{
      pkg      = $pkg
      severity = $sev
      range    = $range
      fix      = $fix
    }
  }

  if ($items.Count -gt 0) {
    Write-Host "`nRemaining HIGH/CRITICAL (top $limit):" -ForegroundColor Yellow
    $items | Select-Object -First $limit | Format-Table -AutoSize
  }
}

# ─────────────────────────────────────────────
# Preconditions
# ─────────────────────────────────────────────
$fullPath = Resolve-Path -Path $Path
Set-Location $fullPath
if (-not (Test-Path "package.json")) { throw "No package.json in $fullPath" }

Assert-Command "node"
Assert-Command "npm"

$ts = Get-Date -Format "yyyyMMdd-HHmmss"
$reportDir = "audit-reports"
New-Item -ItemType Directory -Force -Path $reportDir | Out-Null

Invoke-Step "Create backups" {
  Copy-Item package.json "package.$ts.backup.json" -Force
  if (Test-Path package-lock.json) {
    Copy-Item package-lock.json "package-lock.$ts.backup.json" -Force
  }
}

Invoke-Step "Install clean deps (npm ci)" {
  npm ci
}

Invoke-Step "Audit BEFORE" {
  npm audit --json | Out-File "$reportDir\audit.full.before.$ts.json" -Encoding UTF8
  npm audit --omit=dev --json | Out-File "$reportDir\audit.prod.before.$ts.json" -Encoding UTF8

  $sumBefore = Read-AuditSummary "$reportDir\audit.prod.before.$ts.json"
  if ($sumBefore) {
    Write-Host ("Prod BEFORE → low:{0} moderate:{1} high:{2} critical:{3}" -f $sumBefore.low,$sumBefore.moderate,$sumBefore.high,$sumBefore.critical) -ForegroundColor DarkCyan
  }
}

Invoke-Step "Safe in-range updates (npm update → same majors)" {
  npm update
}

Invoke-Step "Bump PATCH (npm-check-updates)" {
  npx npm-check-updates --target patch --upgrade
  npm install
}

Invoke-Step "Bump MINOR (npm-check-updates)" {
  npx npm-check-updates --target minor --upgrade
  npm install
}

Invoke-Step "npm audit fix (no force)" {
  # keep prod clean; full audit still saved in reports
  npm audit fix --omit=dev
}

Invoke-Step "Audit AFTER" {
  npm audit --json | Out-File "$reportDir\audit.full.after.$ts.json" -Encoding UTF8
  npm audit --omit=dev --json | Out-File "$reportDir\audit.prod.after.$ts.json" -Encoding UTF8

  $sumAfter = Read-AuditSummary "$reportDir\audit.prod.after.$ts.json"
  if ($sumAfter) {
    Write-Host ("Prod AFTER  → low:{0} moderate:{1} high:{2} critical:{3}" -f $sumAfter.low,$sumAfter.moderate,$sumAfter.high,$sumAfter.critical) -ForegroundColor Green
  }

  # Only print details if there is something to print
  if ($sumAfter -and (($sumAfter.high -gt 0) -or ($sumAfter.critical -gt 0))) {
    Print-RemainingHigh "$reportDir\audit.prod.after.$ts.json" 25
  }
}

if ($FailOnHigh) {
  $sumAfter = Read-AuditSummary "$reportDir\audit.prod.after.$ts.json"
  if ($sumAfter -and (($sumAfter.high -gt 0) -or ($sumAfter.critical -gt 0))) {
    Write-Error "High/Critical vulnerabilities remain (high=$($sumAfter.high), critical=$($sumAfter.critical))."
    exit 1
  }
}

Write-Host "Done. Reports in '$reportDir'. Backups: package.$ts.backup.json (+ lock backup if present)." -ForegroundColor Green