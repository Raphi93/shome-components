'use client';

import React, { useLayoutEffect, useRef, useState } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '../Tooltip/Tooltip';

const RIGHTS_ORDER = ['A', 'I', 'N', 'Z', 'F', 'G', 'M', 'P'];
const mapRights: Record<string, string> = {
  A: 'Admin',
  I: 'Intern',
  N: 'Named',
  Z: 'Zone',
  F: 'Fleet',
  G: 'Groups',
  M: 'Dealer',
  P: 'Person',
};

export function rightsTranslate(rights: string, t: (key: string) => string): string {
  const allowed = rights
    .toUpperCase()
    .split('')
    .filter((c) => RIGHTS_ORDER.includes(c))
    .sort((a, b) => RIGHTS_ORDER.indexOf(a) - RIGHTS_ORDER.indexOf(b))
    .map((c) => t(mapRights[c]));

  return String(allowed[allowed.length - 1] || '');
}

export function useIsOverflow<T extends HTMLElement>(ref: React.RefObject<T>, deps: any[] = []) {
  const [isOverflow, setIsOverflow] = useState(false);
  const last = useRef<boolean>(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) {
      last.current = false;
      setIsOverflow(false);
      return;
    }

    const compute = () => {
      const cw = el.clientWidth;
      const sw = el.scrollWidth;
      if (cw === 0 || sw === 0) return null;
      return sw - cw > 1;
    };

    const apply = () => {
      const nextOrNull = compute();
      if (nextOrNull === null) return;
      const next = nextOrNull;
      if (last.current !== next) {
        last.current = next;
        setIsOverflow(next);
      }
    };

    const onResize = () => apply();
    const ro = new ResizeObserver(() => apply());
    const raf = requestAnimationFrame(() => apply());

    ro.observe(el);
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('resize', onResize);
    };
    // deps spread is intentional: caller controls which deps trigger re-measurement
  }, [ref, ...deps]);

  return isOverflow;
}

export function LabelNameWithTooltip({
  itemName,
  rights,
  t,
}: {
  itemName: string;
  rights?: string;
  t: (key: string) => string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isOverflow = useIsOverflow(ref as React.RefObject<HTMLElement>);

  const label = (
    <span className="menu-name" ref={ref}>
      {itemName}
    </span>
  );

  const hasRights = !!rights && rights.trim() !== '';
  if (!isOverflow && !hasRights) return label;

  const translatedRights = hasRights ? rightsTranslate(rights!, t) : '';

  return (
    <Tooltip>
      <TooltipTrigger asChild>{label}</TooltipTrigger>
      <TooltipContent>
        <div className="tooltip-content-menu">
          {translatedRights && <div className="tooltip-rights">{translatedRights}</div>}
          {isOverflow && <div className="tooltip-item-name">{itemName}</div>}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
