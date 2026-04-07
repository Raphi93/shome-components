'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import MonacoEditor, { type OnMount } from '@monaco-editor/react';
import type { editor as MonacoEditorType } from 'monaco-editor';

import type { CodeEditorProps, CodeEditorTab, CodeEditorTheme } from './CodeEditor.type';
export type { CodeEditorProps, CodeEditorTab, CodeEditorTheme };

import s from './CodeEditor.module.scss';

// ─── Language → icon colour ───────────────────────────────────────────────────

const LANG_COLOUR: Record<string, string> = {
  typescript:  '#3178c6',
  javascript:  '#f0db4f',
  json:        '#cbcb41',
  html:        '#e34c26',
  css:         '#264de4',
  scss:        '#c6538c',
  python:      '#3572A5',
  rust:        '#dea584',
  go:          '#00add8',
  java:        '#b07219',
  csharp:      '#178600',
  cpp:         '#f34b7d',
  markdown:    '#083fa1',
  yaml:        '#cb171e',
  xml:         '#0060ac',
  sql:         '#e38c00',
  shell:       '#89e051',
  bash:        '#89e051',
  dockerfile:  '#384d54',
  plaintext:   '#888',
};

function langDot(lang?: string) {
  return <span className={s.langDot} style={{ background: LANG_COLOUR[lang ?? ''] ?? '#888' }} />;
}

// ─── Language list for selector ───────────────────────────────────────────────

const LANGUAGES = [
  'plaintext','typescript','javascript','json','html','css','scss',
  'python','rust','go','java','csharp','cpp',
  'markdown','yaml','xml','sql','shell','bash','dockerfile',
];

// ─── File icon (simple mapping by extension) ──────────────────────────────────

function fileIcon(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() ?? '';
  const map: Record<string, string> = {
    ts: '📄', tsx: '⚛', js: '📄', jsx: '⚛', json: '{}',
    html: '🌐', css: '🎨', scss: '🎨', md: '📝', py: '🐍',
    rs: '🦀', go: '🐹', java: '☕', cs: '🔷', cpp: '🔩', c: '🔩',
    yaml: '⚙', yml: '⚙', xml: '📋', sql: '🗄', sh: '💻', dockerfile: '🐳',
  };
  return map[ext] ?? '📄';
}

// ─── CodeEditor ───────────────────────────────────────────────────────────────

export function CodeEditor({
  tabs,
  activeTab: controlledActiveTab,
  onTabChange,
  onTabClose,
  value: singleValue = '',
  onChange: singleOnChange,
  language: singleLanguage = 'plaintext',
  theme = 'vs-dark',
  lineNumbers = true,
  minimap = true,
  wordWrap = false,
  readOnly = false,
  height = '400px',
  statusBar = true,
  className,
}: CodeEditorProps) {
  const editorRef = useRef<MonacoEditorType.IStandaloneCodeEditor | null>(null);
  const [activeTabId, setActiveTabId] = useState<string>(
    controlledActiveTab ?? tabs?.[0]?.id ?? ''
  );
  const [localTabs, setLocalTabs] = useState<CodeEditorTab[]>(tabs ?? []);
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });
  const [currentLang, setCurrentLang] = useState(singleLanguage);

  // Sync controlled props
  useEffect(() => {
    if (controlledActiveTab) setActiveTabId(controlledActiveTab);
  }, [controlledActiveTab]);

  useEffect(() => {
    if (tabs) setLocalTabs(tabs);
  }, [tabs]);

  const isMultiTab = localTabs.length > 0;
  const activeTab  = localTabs.find((t) => t.id === activeTabId);

  const currentValue    = isMultiTab ? (activeTab?.value ?? '') : singleValue;
  const currentLanguage = isMultiTab ? (activeTab?.language ?? 'plaintext') : currentLang;

  const handleMount: OnMount = (ed) => {
    editorRef.current = ed;
    ed.onDidChangeCursorPosition((e) => {
      setCursorPos({ line: e.position.lineNumber, col: e.position.column });
    });
  };

  const handleChange = useCallback((val: string | undefined) => {
    const v = val ?? '';
    if (isMultiTab) {
      setLocalTabs((prev) =>
        prev.map((t) => t.id === activeTabId ? { ...t, value: v, modified: true } : t)
      );
    } else {
      singleOnChange?.(v);
    }
  }, [isMultiTab, activeTabId, singleOnChange]);

  const handleTabClick = (id: string) => {
    setActiveTabId(id);
    onTabChange?.(id);
  };

  const handleTabClose = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const remaining = localTabs.filter((t) => t.id !== id);
    setLocalTabs(remaining);
    onTabClose?.(id);
    if (activeTabId === id && remaining.length > 0) {
      setActiveTabId(remaining[0].id);
    }
  };

  const containerStyle: React.CSSProperties = {
    ['--ce-height' as string]: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <div
      className={[s.container, className].filter(Boolean).join(' ')}
      style={containerStyle}
    >
      {/* ── Activity bar (VS Code left strip) ── */}
      <div className={s.activityBar}>
        <span className={s.activityIcon} title="Explorer">⎇</span>
        <span className={s.activityIcon} title="Search">⌕</span>
        <span className={s.activityIcon} title="Extensions">⬡</span>
      </div>

      <div className={s.main}>

        {/* ── Tab bar ── */}
        <div className={s.tabBar}>
          {isMultiTab ? (
            localTabs.map((tab) => (
              <div
                key={tab.id}
                className={`${s.tab}${tab.id === activeTabId ? ` ${s.tabActive}` : ''}`}
                onClick={() => handleTabClick(tab.id)}
              >
                <span className={s.tabIcon}>{fileIcon(tab.filename)}</span>
                <span className={s.tabName}>{tab.filename}</span>
                {tab.modified && <span className={s.tabModified} title="Unsaved" />}
                <button
                  type="button"
                  className={s.tabClose}
                  onClick={(e) => handleTabClose(e, tab.id)}
                >
                  ×
                </button>
              </div>
            ))
          ) : (
            <div className={`${s.tab} ${s.tabActive}`}>
              <span className={s.tabIcon}>{langDot(currentLanguage)}</span>
              <span className={s.tabName}>{currentLanguage}</span>
            </div>
          )}
          <div className={s.tabBarFill} />

          {/* Language selector (single-file mode) */}
          {!isMultiTab && (
            <select
              className={s.langSelect}
              value={currentLang}
              onChange={(e) => setCurrentLang(e.target.value)}
            >
              {LANGUAGES.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          )}
        </div>

        {/* ── Breadcrumb / path ── */}
        {isMultiTab && activeTab && (
          <div className={s.breadcrumb}>
            {langDot(activeTab.language)}
            <span>{activeTab.filename}</span>
          </div>
        )}

        {/* ── Editor ── */}
        <div className={s.editorWrap}>
          <MonacoEditor
            height="100%"
            language={currentLanguage}
            value={currentValue}
            theme={theme}
            onChange={handleChange}
            onMount={handleMount}
            options={{
              lineNumbers:      lineNumbers ? 'on' : 'off',
              minimap:          { enabled: minimap },
              wordWrap:         wordWrap ? 'on' : 'off',
              readOnly,
              fontSize:         13,
              fontFamily:       "'Fira Code', 'Cascadia Code', 'Consolas', monospace",
              fontLigatures:    true,
              cursorBlinking:   'smooth',
              cursorSmoothCaretAnimation: 'on',
              smoothScrolling:  true,
              scrollBeyondLastLine: false,
              renderLineHighlight: 'gutter',
              bracketPairColorization: { enabled: true },
              guides:           { bracketPairs: true, indentation: true },
              tabSize:          2,
              automaticLayout:  true,
              padding:          { top: 12, bottom: 12 },
            }}
          />
        </div>

        {/* ── Status bar ── */}
        {statusBar && (
          <div className={s.statusBar}>
            <span className={s.statusLeft}>
              {langDot(currentLanguage)}
              <span>{currentLanguage}</span>
            </span>
            <span className={s.statusRight}>
              <span>Ln {cursorPos.line}, Col {cursorPos.col}</span>
              <span>UTF-8</span>
              <span>{wordWrap ? 'Wrap' : 'No Wrap'}</span>
              {readOnly && <span className={s.statusReadOnly}>Read Only</span>}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
