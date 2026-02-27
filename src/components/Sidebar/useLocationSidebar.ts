"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { NavigationItem } from "../..";


export type Result = {
  parentClick: string;
  childClick: string;
  leafClick: string;
  pathClicks: string[];
};

type Best = { score: number; linkLen: number; names: string[] };

const normalizePath = (p: string) => {
  const n = p.replace(/\/+$/, "");
  return n === "" ? "/" : n;
};

const isExternal = (s: string) => /^https?:\/\//i.test(s);

const linkNorm = (link?: string) => {
  if (!link) return "";
  if (isExternal(link)) return link;
  const withSlash = link.startsWith("/") ? link : `/${link}`;
  return normalizePath(withSlash);
};

function splitLink(full: string) {
  const qIndex = full.indexOf("?");
  if (qIndex === -1) return { path: normalizePath(full), search: "" };
  return { path: normalizePath(full.slice(0, qIndex)), search: full.slice(qIndex) };
}

function queryContainsAll(actualSearch: string, requiredSearch: string): boolean {
  if (!requiredSearch) return true;

  const actual = new URLSearchParams(actualSearch.startsWith("?") ? actualSearch : `?${actualSearch}`);
  const required = new URLSearchParams(requiredSearch.startsWith("?") ? requiredSearch : `?${requiredSearch}`);

  for (const [k, v] of required.entries()) {
    if (!actual.has(k)) return false;

    const actualValues = actual.getAll(k);
    if (!actualValues.includes(v)) return false;
  }

  return true;
}

function matchScore(
  locationPath: string,
  locationSearch: string,
  menuLinkRaw: string
): { ok: boolean; score: number; linkLen: number } {
  if (!menuLinkRaw || isExternal(menuLinkRaw)) return { ok: false, score: 0, linkLen: 0 };

  const normalized = linkNorm(menuLinkRaw);
  const { path: linkPath, search: linkSearch } = splitLink(normalized);

  const locPath = normalizePath(locationPath);

  const pathOk = locPath === linkPath || locPath.startsWith(linkPath + "/");
  if (!pathOk) return { ok: false, score: 0, linkLen: 0 };

  const queryOk = queryContainsAll(locationSearch, linkSearch);
  if (!queryOk) return { ok: false, score: 0, linkLen: linkPath.length };

  // scoring: query-links win against plain path links (so /xproduction?Category=... beats /xproduction)
  const score = (linkPath.length * 10) + (linkSearch ? 100000 : 0) + (linkSearch.length || 0);
  const linkLen = linkPath.length + (linkSearch?.length ?? 0);

  return { ok: true, score, linkLen };
}

function trimDynamicSubPath(menu: NavigationItem[], pathname: string): string {
  let bestPrefix: string | null = null;

  const visit = (node: NavigationItem) => {
    const l = linkNorm(node.link);
    if (!l || isExternal(l)) return;

    const nodePath = splitLink(l).path;

    if (nodePath && pathname.startsWith(nodePath + "/")) {
      if (!bestPrefix || nodePath.length > bestPrefix.length) bestPrefix = nodePath;
    }

    node.children?.forEach(visit);
  };

  menu.forEach(visit);
  return bestPrefix ?? pathname;
}

function findBest(menu: NavigationItem[], path: string, search: string): Best | null {
  let best: Best | null = null;

  const visit = (node: NavigationItem, names: string[]) => {
    const l = node.link ?? "";
    const m = matchScore(path, search, l);

    if (m.ok) {
      if (!best || m.score > best.score || (m.score === best.score && m.linkLen > best.linkLen)) {
        best = { score: m.score, linkLen: m.linkLen, names };
      }
    }

    node.children?.forEach((ch) => visit(ch, [...names, ch.name]));
  };

  menu.forEach((parent) => visit(parent, [parent.name]));
  return best;
}

export function useLocationSidebar(menu: NavigationItem[] | null): Result {
  const pathname = usePathname();
  const searchParams = useSearchParams();
const [parentClick, setParentClick] = useState("");
  const [childClick, setChildClick] = useState("");
  const [leafClick, setLeafClick] = useState("");
  const [pathClicks, setPathClicks] = useState<string[]>([]);

  useEffect(() => {
    if (!menu?.length) return;

    const path = pathname;
    const search = (searchParams ? `?${searchParams.toString()}` : "");

    let best = findBest(menu, path, search);

    // fallback: wenn du auf /vouchers/myvoucher bist und kein Menu-Link exakt das hat,
    // dann trimmen wir auf den längsten bekannten prefix (z.B. /vouchers) und suchen nochmal.
    if (best === null) {
      const trimmedPath = trimDynamicSubPath(menu, path);
      best = findBest(menu, trimmedPath, search);
    }

    if (best === null) {
      setParentClick("");
      setChildClick("");
      setLeafClick("");
      setPathClicks([]);
      return;
    }

    setPathClicks(best.names);
    setParentClick(best.names[0] ?? "");
    setChildClick(best.names[1] ?? "");
    setLeafClick(best.names[best.names.length - 1] ?? "");
  }, [pathname, (searchParams ? `?${searchParams.toString()}` : ""), menu]);

  return { parentClick, childClick, leafClick, pathClicks };
}
