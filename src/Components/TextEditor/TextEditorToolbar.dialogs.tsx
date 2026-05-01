'use client';

import React, { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '../Button';
import s from './TextEditor.module.scss';
import { type ImageAlignment, buildImageStyle, compressToBase64 } from './TextEditorToolbar.utils';

// ─── LinkDialog ───────────────────────────────────────────────────────────────

interface LinkDialogProps {
  initialHref?: string;
  onInsert: (href: string) => void;
  onClose: () => void;
}

export function LinkDialog({ initialHref = '', onInsert, onClose }: LinkDialogProps) {
  const { t } = useTranslation();
  const [url, setUrl] = useState(initialHref || 'https://');

  const handleAdd = () => {
    if (!url.trim()) return;
    onInsert(url.trim());
    onClose();
  };

  return (
    <div className={s.imageDialog} onMouseDown={(e) => e.stopPropagation()}>
      <div className={s.imageForm}>
        <div className={s.imageField}>
          <label className={s.imageLabel}>URL <span className={s.imageRequired}>*</span></label>
          <input
            className={s.imageInput}
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            autoFocus
            onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); if (e.key === 'Escape') onClose(); }}
          />
        </div>
        <div className={s.imageActions}>
          <Button isLightColor color="light" border text={t('Cancel')} onClick={onClose} />
          <Button text={t('Insert')} onClick={handleAdd} disabled={!url.trim()} />
        </div>
      </div>
    </div>
  );
}

// ─── TableDialog ──────────────────────────────────────────────────────────────

interface TableDialogProps {
  onInsert: (rows: number, cols: number, withHeaderRow: boolean) => void;
  onClose: () => void;
}

export function TableDialog({ onInsert, onClose }: TableDialogProps) {
  const { t } = useTranslation();
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [withHeaderRow, setWithHeaderRow] = useState(true);

  const handleAdd = () => {
    onInsert(rows, cols, withHeaderRow);
    onClose();
  };

  return (
    <div className={s.imageDialog} onMouseDown={(e) => e.stopPropagation()}>
      <div className={s.imageForm}>
        <div className={s.imageRow}>
          <div className={s.imageField}>
            <label className={s.imageLabel}>{t('Rows')}</label>
            <input className={s.imageInput} type="number" min="1" max="50" value={rows}
              onChange={(e) => setRows(Math.max(1, parseInt(e.target.value, 10) || 1))} />
          </div>
          <div className={s.imageField}>
            <label className={s.imageLabel}>{t('Columns')}</label>
            <input className={s.imageInput} type="number" min="1" max="20" value={cols}
              onChange={(e) => setCols(Math.max(1, parseInt(e.target.value, 10) || 1))} />
          </div>
        </div>
        <div className={s.imageField}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <input type="checkbox" checked={withHeaderRow} onChange={(e) => setWithHeaderRow(e.target.checked)} />
            <span className={s.imageLabel} style={{ marginBottom: 0 }}>{t('Header row')}</span>
          </label>
        </div>
        <div className={s.imageActions}>
          <Button isLightColor color="light" border text={t('Cancel')} onClick={onClose} />
          <Button text={t('Insert')} onClick={handleAdd} />
        </div>
      </div>
    </div>
  );
}

// ─── ImageDialog ──────────────────────────────────────────────────────────────

interface ImageDialogProps {
  onInsert: (attrs: { src: string; alt?: string; style?: string }) => void;
  onClose: () => void;
}

export function ImageDialog({ onInsert, onClose }: ImageDialogProps) {
  const { t } = useTranslation();
  const [tab, setTab]             = useState<'url' | 'file'>('url');
  const [url, setUrl]             = useState('');
  const [alt, setAlt]             = useState('');
  const [width, setWidth]         = useState('');
  const [height, setHeight]       = useState('');
  const [alignment, setAlignment] = useState<ImageAlignment>('none');
  const [preview, setPreview]     = useState('');
  const [dragging, setDragging]   = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(async (file: File) => {
    const b64 = await compressToBase64(file, parseInt(width, 10) || 1200, parseInt(height, 10) || 0);
    setPreview(b64);
  }, [width, height]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file?.type.startsWith('image/')) processFile(file);
  };

  const handleAdd = () => {
    const src = tab === 'url' ? url.trim() : preview;
    if (!src) return;
    const style = buildImageStyle(alignment, width, height) || undefined;
    onInsert({ src, alt: alt.trim() || undefined, style });
    onClose();
  };

  const ALIGNMENTS: { value: ImageAlignment; label: string }[] = [
    { value: 'none',   label: t('Inline') },
    { value: 'left',   label: t('Left')   },
    { value: 'center', label: t('Center') },
    { value: 'right',  label: t('Right')  },
  ];

  return (
    <div className={s.imageDialog} onMouseDown={(e) => e.stopPropagation()}>

      <div className={s.imageTabs}>
        <button type="button" className={`${s.imageTab}${tab === 'url'  ? ` ${s.active}` : ''}`} onClick={() => setTab('url')}>URL</button>
        <button type="button" className={`${s.imageTab}${tab === 'file' ? ` ${s.active}` : ''}`} onClick={() => setTab('file')}>{t('Upload')}</button>
      </div>

      <div className={s.imageForm}>

        {tab === 'url' && (
          <div className={s.imageField}>
            <label className={s.imageLabel}>URL <span className={s.imageRequired}>*</span></label>
            <input
              className={s.imageInput}
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              autoFocus
            />
          </div>
        )}

        {tab === 'file' && (
          <div
            className={`${s.imageDropZone}${dragging ? ` ${s.dragging}` : ''}`}
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
          >
            {preview
              ? <img src={preview} alt="preview" className={s.imagePreview} />
              : <span className={s.imageDropHint}>{t('Drop image here or click')}</span>
            }
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => { const f = e.target.files?.[0]; if (f) processFile(f); }}
            />
          </div>
        )}

        <div className={s.imageField}>
          <label className={s.imageLabel}>{t('Alt text')}</label>
          <input className={s.imageInput} type="text" value={alt} onChange={(e) => setAlt(e.target.value)}
            placeholder={t('Image description…')} />
        </div>

        <div className={s.imageRow}>
          <div className={s.imageField}>
            <label className={s.imageLabel}>{t('Width (px)')}</label>
            <input className={s.imageInput} type="number" min="1" value={width}
              onChange={(e) => setWidth(e.target.value)} placeholder="auto" />
          </div>
          <div className={s.imageField}>
            <label className={s.imageLabel}>{t('Height (px)')}</label>
            <input className={s.imageInput} type="number" min="1" value={height}
              onChange={(e) => setHeight(e.target.value)} placeholder="auto" />
          </div>
        </div>

        <div className={s.imageField}>
          <label className={s.imageLabel}>{t('Position')}</label>
          <div className={s.imageAlignRow}>
            {ALIGNMENTS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                className={`${s.imageAlignBtn}${alignment === value ? ` ${s.active}` : ''}`}
                onClick={() => setAlignment(value)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className={s.imageActions}>
          <Button isLightColor color="light" border text={t('Cancel')} onClick={onClose} />
          <Button text={t('Insert')} onClick={handleAdd} disabled={tab === 'url' ? !url.trim() : !preview} />
        </div>

      </div>
    </div>
  );
}
