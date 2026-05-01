'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Tooltip, TooltipContent, TooltipTrigger } from '../Tooltip';
import s from './TextEditor.module.scss';
import { EMOJI_GROUPS } from './TextEditorToolbar.data';

// ─── Sep ─────────────────────────────────────────────────────────────────────

export function Sep() {
  return <div className={s.toolbarSeparator} />;
}

// ─── Btn ─────────────────────────────────────────────────────────────────────

interface BtnProps {
  active?: boolean;
  disabled?: boolean;
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}

export function Btn({ active, disabled, label, onClick, children }: BtnProps) {
  return (
    <Tooltip placement="bottom">
      <TooltipTrigger
        disabled={disabled}
        className={`${s.toolbarBtn}${active ? ` ${s.active}` : ''}`}
        onMouseDown={(e: React.MouseEvent) => { e.preventDefault(); if (!disabled) onClick(); }}
      >
        <div className={s.toolbarBtnInner}>{children}</div>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

// ─── ColorPicker ─────────────────────────────────────────────────────────────

interface ColorPickerProps {
  colors: string[];
  current: string;
  onSelect: (c: string) => void;
}

export function ColorPicker({ colors, current, onSelect }: ColorPickerProps) {
  const { t } = useTranslation();
  return (
    <div className={s.colorPicker} onMouseDown={(e) => e.preventDefault()}>
      <div className={s.colorGrid}>
        {colors.map((c) => (
          <button
            key={c}
            type="button"
            className={`${s.colorSwatch}${current === c ? ` ${s.active}` : ''}`}
            style={{ background: c }}
            title={c}
            onClick={() => onSelect(c)}
          />
        ))}
      </div>
      <button type="button" className={s.colorReset} onClick={() => onSelect('')}>{t('Reset')}</button>
    </div>
  );
}

// ─── EmojiPicker ─────────────────────────────────────────────────────────────

interface EmojiPickerProps {
  onSelect: (e: string) => void;
}

export function EmojiPicker({ onSelect }: EmojiPickerProps) {
  const { t } = useTranslation();
  const [groupIdx, setGroupIdx] = useState(0);
  const group = EMOJI_GROUPS[groupIdx];

  return (
    <div className={s.emojiPicker} onMouseDown={(e) => e.preventDefault()}>
      <div className={s.emojiTabs}>
        {EMOJI_GROUPS.map((g, i) => (
          <button
            key={g.label}
            type="button"
            title={t(g.label)}
            className={`${s.emojiTab}${groupIdx === i ? ` ${s.active}` : ''}`}
            onClick={() => setGroupIdx(i)}
          >
            {g.tab}
          </button>
        ))}
      </div>
      <div className={s.emojiLabel}>{t(group.label)}</div>
      <div className={s.emojiGrid}>
        {group.emojis.map((em) => (
          <button key={em} type="button" className={s.emojiItem} onClick={() => onSelect(em)}>
            {em}
          </button>
        ))}
      </div>
    </div>
  );
}
