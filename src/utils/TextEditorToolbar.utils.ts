import React from 'react';

export function useClickOutside(ref: React.RefObject<HTMLElement | null>, onClose: () => void) {
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [ref, onClose]);
}

// ─── HTML formatter (pretty-prints raw HTML for source view) ─────────────────

const VOID_TAGS   = new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']);
const INLINE_TAGS = new Set(['a','abbr','acronym','b','bdo','big','br','cite','code','dfn','em','i','img','input','kbd','label','map','object','output','q','s','samp','select','small','span','strong','sub','sup','textarea','time','tt','u','var']);

export function formatHtml(html: string): string {
  let indent = 0;
  const tab = '  ';
  const tokens = html.split(/(<[^>]+>)/);
  const lines: string[] = [];
  let current = '';

  for (const token of tokens) {
    if (!token) continue;
    const isTag = token.startsWith('<');
    if (!isTag) { current += token; continue; }

    const isClose     = token.startsWith('</');
    const isSelfClose = token.endsWith('/>') || VOID_TAGS.has((token.match(/^<([a-zA-Z0-9]+)/) ?? [])[1]?.toLowerCase() ?? '');
    const tagName     = ((isClose ? token.match(/^<\/([a-zA-Z0-9]+)/) : token.match(/^<([a-zA-Z0-9]+)/)) ?? [])[1]?.toLowerCase() ?? '';
    const isInline    = INLINE_TAGS.has(tagName);

    if (isInline) { current += token; continue; }

    if (current.trim()) { lines.push(tab.repeat(indent) + current.trim()); current = ''; }

    if (isClose) indent = Math.max(0, indent - 1);
    lines.push(tab.repeat(indent) + token);
    if (!isClose && !isSelfClose) indent++;
  }

  if (current.trim()) lines.push(tab.repeat(indent) + current.trim());
  return lines.join('\n');
}

// ─── Image helpers ────────────────────────────────────────────────────────────

export type ImageAlignment = 'none' | 'left' | 'center' | 'right';

export function compressToBase64(file: File, maxW: number, maxH: number): Promise<string> {
  return new Promise((resolve) => {
    const img = new window.Image();
    const blobUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(blobUrl);
      let w = img.naturalWidth;
      let h = img.naturalHeight;
      if (maxW > 0 && w > maxW) { h = Math.round(h * maxW / w); w = maxW; }
      if (maxH > 0 && h > maxH) { w = Math.round(w * maxH / h); h = maxH; }
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      canvas.getContext('2d')!.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL('image/jpeg', 0.85));
    };
    img.src = blobUrl;
  });
}

export function buildImageStyle(alignment: ImageAlignment, width: string, height: string): string {
  const parts: string[] = [];
  const wNum = parseInt(width, 10);
  const hNum = parseInt(height, 10);
  if (width)  parts.push(`width: ${wNum > 0 ? `${wNum}px` : width}`);
  if (height) parts.push(`height: ${hNum > 0 ? `${hNum}px` : height}`);
  else if (width) parts.push('height: auto');
  if (alignment === 'left')   parts.push('float: left; margin: 0 1rem 0.5rem 0');
  if (alignment === 'center') parts.push('display: block; margin: 0.5rem auto');
  if (alignment === 'right')  parts.push('float: right; margin: 0 0 0.5rem 1rem');
  return parts.join('; ');
}
