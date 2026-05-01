'use client';

import React, { useReducer, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  faAlignCenter, faAlignJustify, faAlignLeft, faAlignRight,
  faBold, faCompress, faDroplet,
  faEraser, faExpand, faFaceSmile, faHighlighter,
  faImage, faIndent, faItalic, faLink, faLinkSlash,
  faListOl, faListUl, faMinus, faOutdent,
  faQuoteLeft, faRotateLeft, faRotateRight,
  faStrikethrough, faSubscript, faSuperscript,
  faTable, faTerminal, faUnderline,
  faEllipsis, faWandMagicSparkles,
  faEye, faFileCode,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { type Editor } from '@tiptap/react';

import type { FontOption, TextEditorFormat, TextEditorView, ToolbarItem } from './TextEditor.type';
import s from './TextEditor.module.scss';
import { DEFAULT_COLORS } from './TextEditorToolbar.data';
import { useClickOutside } from './TextEditorToolbar.utils';
import { LinkDialog, TableDialog, ImageDialog } from './TextEditorToolbar.dialogs';
import { Sep, Btn, ColorPicker, EmojiPicker } from './TextEditorToolbar.ui';
import { CodeInlineIcon } from './TextEditorIcons';

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  editor: Editor | null;
  hide?: ToolbarItem[];
  fonts?: FontOption[];
  colors?: string[];
  fullscreen?: boolean;
  onFullscreen?: () => void;
  onMagicWandClick?: () => void;
  format?: TextEditorFormat;
  onFormatChange?: (format: TextEditorFormat) => void;
  onlyFormat?: TextEditorFormat;
  viewMode?: TextEditorView;
  onToggleViewMode?: () => void;
}

// ─── TextEditorToolbar ───────────────────────────────────────────────────────

export function TextEditorToolbar({
  editor,
  hide = [],
  fonts,
  colors = DEFAULT_COLORS,
  fullscreen = false,
  onFullscreen,
  onMagicWandClick,
  format = 'html',
  onFormatChange,
  onlyFormat,
  viewMode = 'visual',
  onToggleViewMode,
}: Props) {
  const { t } = useTranslation();

  const [colorOpen, setColorOpen] = useState(false);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);
  const [linkOpen,  setLinkOpen]  = useState(false);
  const [tableOpen, setTableOpen] = useState(false);
  const [moreOpen,  setMoreOpen]  = useState(false);

  const colorRef = useRef<HTMLDivElement>(null);
  const emojiRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const linkRef  = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  useClickOutside(colorRef, () => setColorOpen(false));
  useClickOutside(emojiRef, () => setEmojiOpen(false));
  useClickOutside(imageRef, () => setImageOpen(false));
  useClickOutside(linkRef,  () => setLinkOpen(false));
  useClickOutside(tableRef, () => setTableOpen(false));

  // Re-render on every editor selection/content change so isActive() stays current
  const [, forceUpdate] = useReducer((x: number) => x + 1, 0);
  useEffect(() => {
    if (!editor) return;
    editor.on('selectionUpdate', forceUpdate);
    editor.on('transaction',     forceUpdate);
    return () => {
      editor.off('selectionUpdate', forceUpdate);
      editor.off('transaction',     forceUpdate);
    };
  }, [editor]);

  if (!editor) return null;

  const vis    = (item: ToolbarItem) => !hide.includes(item);
  const hasSep = (...items: ToolbarItem[]) => items.some(vis);

  // ── Heading value ─────────────────────────────────────────────────────────
  const headingVal = (() => {
    for (let i = 1; i <= 6; i++) {
      if (editor.isActive('heading', { level: i })) return `h${i}`;
    }
    return 'p';
  })();

  const applyBlock = (val: string) => {
    if (val === 'p') { editor.chain().focus().setParagraph().run(); return; }
    const lv = parseInt(val.replace('h', ''), 10) as 1|2|3|4|5|6;
    editor.chain().focus().toggleHeading({ level: lv }).run();
  };

  // ── Font size ──────────────────────────────────────────────────────────────
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const currentSize: string = (editor.getAttributes('textStyle') as any)?.fontSize?.replace('px', '') ?? '';

  const applySize = (sz: string) => {
    if (!sz) { editor.chain().focus().unsetMark('textStyle').run(); return; }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (editor.chain().focus() as any).setFontSize(`${sz}px`).run();
  };

  // ── Font family ────────────────────────────────────────────────────────────
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const currentFont: string = (editor.getAttributes('textStyle') as any)?.fontFamily ?? '';

  // ── Text color ─────────────────────────────────────────────────────────────
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const currentColor: string = (editor.getAttributes('textStyle') as any)?.color ?? '';

  const applyColor = (c: string) => {
    if (!c) editor.chain().focus().unsetColor().run();
    else editor.chain().focus().setColor(c).run();
    setColorOpen(false);
  };

  // ── Link ──────────────────────────────────────────────────────────────────
  const insertLink = (href: string) => {
    editor.chain().focus().extendMarkRange('link').setLink({ href }).run();
  };

  // ── Image ─────────────────────────────────────────────────────────────────
  const insertImage = (attrs: { src: string; alt?: string; style?: string }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (editor.chain().focus() as any).setImage(attrs).run();
  };

  // ── Build toolbar groups ──────────────────────────────────────────────────
  const groups: React.ReactNode[] = [];

  if (hasSep('undo', 'redo')) {
    groups.push(
      <div className={s.toolbarGroup} key="history">
        {vis('undo') && <Btn disabled={!editor.can().undo()} label={t('Undo')} onClick={() => editor.chain().focus().undo().run()}><FontAwesomeIcon icon={faRotateLeft} /></Btn>}
        {vis('redo') && <Btn disabled={!editor.can().redo()} label={t('Redo')} onClick={() => editor.chain().focus().redo().run()}><FontAwesomeIcon icon={faRotateRight} /></Btn>}
      </div>
    );
  }

  if (vis('clearFormatting')) {
    groups.push(
      <div className={s.toolbarGroup} key="clearFormatting">
        <Btn label={t('Clear formatting')} onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}>
          <FontAwesomeIcon icon={faEraser} />
        </Btn>
      </div>
    );
  }

  if (vis('magicWand') && onMagicWandClick) {
    groups.push(
      <div className={s.toolbarGroup} key="magicWand">
        <Btn label={t('Magic wand')} onClick={onMagicWandClick}>
          <FontAwesomeIcon icon={faWandMagicSparkles} />
        </Btn>
      </div>
    );
  }

  if (vis('formatSelect') && !onlyFormat) {
    groups.push(
      <div className={s.toolbarGroup} key="formatSelect">
        <select
          className={s.toolbarSelect}
          value={format}
          title={t('Format')}
          onChange={(e) => onFormatChange?.(e.target.value as TextEditorFormat)}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <option value="html">HTML</option>
          <option value="markdown">Markdown</option>
        </select>
      </div>
    );
  }

  if (vis('viewMode') && onToggleViewMode) {
    groups.push(
      <div className={s.toolbarGroup} key="viewMode">
        <Btn active={viewMode === 'source'} label={viewMode === 'visual' ? t('Source') : t('Visual')} onClick={onToggleViewMode}>
          <FontAwesomeIcon icon={viewMode === 'visual' ? faFileCode : faEye} />
        </Btn>
      </div>
    );
  }

  if (vis('emoji')) {
    groups.push(
      <div className={s.toolbarGroup} key="emoji" ref={emojiRef} style={{ position: 'relative' }}>
        <Btn active={emojiOpen} label={t('Emoji')} onClick={() => setEmojiOpen((o) => !o)}>
          <FontAwesomeIcon icon={faFaceSmile} />
        </Btn>
        {emojiOpen && (
          <EmojiPicker onSelect={(em) => { editor.chain().focus().insertContent(em).run(); setEmojiOpen(false); }} />
        )}
      </div>
    );
  }

  if (hasSep('bold', 'italic', 'underline', 'strike', 'code', 'superscript', 'subscript')) {
    groups.push(
      <div className={s.toolbarGroup} key="inline">
        {vis('bold')        && <Btn active={editor.isActive('bold')}        label={t('Bold')}          onClick={() => editor.chain().focus().toggleBold().run()}>        <FontAwesomeIcon icon={faBold} /></Btn>}
        {vis('italic')      && <Btn active={editor.isActive('italic')}      label={t('Italic')}        onClick={() => editor.chain().focus().toggleItalic().run()}>      <FontAwesomeIcon icon={faItalic} /></Btn>}
        {vis('underline')   && <Btn active={editor.isActive('underline')}   label={t('Underline')}     onClick={() => editor.chain().focus().toggleUnderline().run()}>   <FontAwesomeIcon icon={faUnderline} /></Btn>}
        {vis('strike')      && <Btn active={editor.isActive('strike')}      label={t('Strikethrough')} onClick={() => editor.chain().focus().toggleStrike().run()}>      <FontAwesomeIcon icon={faStrikethrough} /></Btn>}
        {vis('code')        && <Btn active={editor.isActive('code')}        label={t('Inline code')}   onClick={() => editor.chain().focus().toggleCode().run()}>        <CodeInlineIcon /></Btn>}
        {vis('superscript') && <Btn active={editor.isActive('superscript')} label={t('Superscript')}   onClick={() => editor.chain().focus().toggleSuperscript().run()}><FontAwesomeIcon icon={faSuperscript} /></Btn>}
        {vis('subscript')   && <Btn active={editor.isActive('subscript')}   label={t('Subscript')}     onClick={() => editor.chain().focus().toggleSubscript().run()}>   <FontAwesomeIcon icon={faSubscript} /></Btn>}
      </div>
    );
  }

  if (vis('blockType')) {
    groups.push(
      <div className={s.toolbarGroup} key="blockType">
        <select
          className={`${s.toolbarSelect} ${s.selectBlock}`}
          value={headingVal}
          title={t('Text style')}
          onChange={(e) => applyBlock(e.target.value)}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <option value="p">Normal</option>
          {[1,2,3,4,5,6].map((n) => <option key={n} value={`h${n}`}>H{n}</option>)}
        </select>
      </div>
    );
  }

  if (vis('fontSize')) {
    groups.push(
      <div className={s.toolbarGroup} key="fontSize">
        <select
          className={`${s.toolbarSelect} ${s.selectSize}`}
          value={currentSize}
          title={t('Font size')}
          onChange={(e) => applySize(e.target.value)}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <option value="">–</option>
          {[8,9,10,11,12,14,16,18,20,22,24,28,32,36,48,60,72,96].map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>
    );
  }

  if (vis('fontFamily') && fonts && fonts.length > 0) {
    groups.push(
      <div className={s.toolbarGroup} key="fontFamily">
        <select
          className={`${s.toolbarSelect} ${s.selectFont}`}
          value={currentFont}
          title={t('Font family')}
          onChange={(e) => {
            if (e.target.value) editor.chain().focus().setFontFamily(e.target.value).run();
            else editor.chain().focus().unsetFontFamily().run();
          }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {fonts.map((f) => (
            <option key={`${f.label}-${f.value}`} value={f.value} style={{ fontFamily: f.value || undefined }}>{f.label}</option>
          ))}
        </select>
      </div>
    );
  }

  if (hasSep('bulletList', 'orderedList')) {
    groups.push(
      <div className={s.toolbarGroup} key="lists">
        {vis('bulletList')  && <Btn active={editor.isActive('bulletList')}  label={t('Bullet list')}  onClick={() => editor.chain().focus().toggleBulletList().run()}>  <FontAwesomeIcon icon={faListUl} /></Btn>}
        {vis('orderedList') && <Btn active={editor.isActive('orderedList')} label={t('Ordered list')} onClick={() => editor.chain().focus().toggleOrderedList().run()}><FontAwesomeIcon icon={faListOl} /></Btn>}
      </div>
    );
  }

  if (hasSep('alignLeft', 'alignCenter', 'alignRight', 'alignJustify')) {
    groups.push(
      <div className={s.toolbarGroup} key="align">
        {vis('alignLeft')    && <Btn active={editor.isActive({ textAlign: 'left' })}    label={t('Align left')}    onClick={() => editor.chain().focus().setTextAlign('left').run()}>    <FontAwesomeIcon icon={faAlignLeft} /></Btn>}
        {vis('alignCenter')  && <Btn active={editor.isActive({ textAlign: 'center' })}  label={t('Align center')}  onClick={() => editor.chain().focus().setTextAlign('center').run()}>  <FontAwesomeIcon icon={faAlignCenter} /></Btn>}
        {vis('alignRight')   && <Btn active={editor.isActive({ textAlign: 'right' })}   label={t('Align right')}   onClick={() => editor.chain().focus().setTextAlign('right').run()}>   <FontAwesomeIcon icon={faAlignRight} /></Btn>}
        {vis('alignJustify') && <Btn active={editor.isActive({ textAlign: 'justify' })} label={t('Justify')}       onClick={() => editor.chain().focus().setTextAlign('justify').run()}><FontAwesomeIcon icon={faAlignJustify} /></Btn>}
      </div>
    );
  }

  if (vis('colorPicker')) {
    groups.push(
      <div className={s.toolbarGroup} key="color" ref={colorRef} style={{ position: 'relative' }}>
        <Btn active={colorOpen} label={t('Text color')} onClick={() => setColorOpen((o) => !o)}>
          <span className={s.colorIcon}>
            <FontAwesomeIcon icon={faDroplet} />
            <span className={s.colorBar} style={{ background: currentColor || 'currentColor' }} />
          </span>
        </Btn>
        {colorOpen && <ColorPicker colors={colors} current={currentColor} onSelect={applyColor} />}
      </div>
    );
  }

  if (vis('highlight')) {
    groups.push(
      <div className={s.toolbarGroup} key="highlight">
        <Btn active={editor.isActive('highlight')} label={t('Highlight')} onClick={() => editor.chain().focus().toggleHighlight().run()}>
          <FontAwesomeIcon icon={faHighlighter} />
        </Btn>
      </div>
    );
  }

  if (hasSep('link', 'unlink')) {
    groups.push(
      <div className={s.toolbarGroup} key="link" ref={linkRef} style={{ position: 'relative' }}>
        {vis('link') && (
          <Btn active={linkOpen || editor.isActive('link')} label={t('Set link')} onClick={() => setLinkOpen((o) => !o)}>
            <FontAwesomeIcon icon={faLink} />
          </Btn>
        )}
        {vis('unlink') && (
          <Btn disabled={!editor.isActive('link')} label={t('Remove link')} onClick={() => editor.chain().focus().extendMarkRange('link').unsetLink().run()}>
            <FontAwesomeIcon icon={faLinkSlash} />
          </Btn>
        )}
        {linkOpen && (
          <LinkDialog
            initialHref={editor.getAttributes('link').href as string | undefined}
            onInsert={insertLink}
            onClose={() => setLinkOpen(false)}
          />
        )}
      </div>
    );
  }

  if (vis('blockquote')) {
    groups.push(
      <div className={s.toolbarGroup} key="blockquote">
        <Btn active={editor.isActive('blockquote')} label={t('Quote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <FontAwesomeIcon icon={faQuoteLeft} />
        </Btn>
      </div>
    );
  }

  if (hasSep('indent', 'outdent')) {
    groups.push(
      <div className={s.toolbarGroup} key="indent">
        {vis('outdent') && <Btn label={t('Outdent')} onClick={() => editor.chain().focus().liftListItem('listItem').run()}><FontAwesomeIcon icon={faOutdent} /></Btn>}
        {vis('indent')  && <Btn label={t('Indent')}  onClick={() => editor.chain().focus().sinkListItem('listItem').run()}><FontAwesomeIcon icon={faIndent} /></Btn>}
      </div>
    );
  }

  if (vis('codeBlock')) {
    groups.push(
      <div className={s.toolbarGroup} key="codeBlock">
        <Btn active={editor.isActive('codeBlock')} label={t('Code block')} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
          <FontAwesomeIcon icon={faTerminal} />
        </Btn>
      </div>
    );
  }

  if (vis('horizontalRule')) {
    groups.push(
      <div className={s.toolbarGroup} key="horizontalRule">
        <Btn label={t('Horizontal rule')} onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          <FontAwesomeIcon icon={faMinus} />
        </Btn>
      </div>
    );
  }

  if (vis('table')) {
    groups.push(
      <div className={s.toolbarGroup} key="table" ref={tableRef} style={{ position: 'relative' }}>
        <Btn
          active={tableOpen || editor.isActive('table')}
          label={editor.isActive('table') ? t('Delete table') : t('Insert table')}
          onClick={() => {
            if (editor.isActive('table')) editor.chain().focus().deleteTable().run();
            else setTableOpen((o) => !o);
          }}
        >
          <FontAwesomeIcon icon={faTable} />
        </Btn>
        {tableOpen && (
          <TableDialog
            onInsert={(rows, cols, withHeaderRow) => editor.chain().focus().insertTable({ rows, cols, withHeaderRow }).run()}
            onClose={() => setTableOpen(false)}
          />
        )}
      </div>
    );
  }

  if (vis('image')) {
    groups.push(
      <div className={s.toolbarGroup} key="image" ref={imageRef} style={{ position: 'relative' }}>
        <Btn active={imageOpen} label={t('Insert image')} onClick={() => setImageOpen((o) => !o)}>
          <FontAwesomeIcon icon={faImage} />
        </Btn>
        {imageOpen && (
          <ImageDialog onInsert={insertImage} onClose={() => setImageOpen(false)} />
        )}
      </div>
    );
  }

  if (vis('fullscreen') && onFullscreen) {
    groups.push(
      <div className={s.toolbarGroup} key="fullscreen">
        <Btn active={fullscreen} label={fullscreen ? t('Exit fullscreen') : t('Fullscreen')} onClick={onFullscreen}>
          <FontAwesomeIcon icon={fullscreen ? faCompress : faExpand} />
        </Btn>
      </div>
    );
  }

  // ── Split into main / overflow / right-pinned ─────────────────────────────
  const RIGHT_PINNED = new Set(['magicWand', 'formatSelect', 'viewMode']);
  const ALWAYS_MAIN  = new Set(['color', 'link']);

  const getKey = (g: React.ReactNode) =>
    g != null && typeof g === 'object' && 'key' in g ? (g as React.ReactElement).key : null;

  const mainGroups     = groups.filter((g, i) => !RIGHT_PINNED.has(getKey(g) ?? '') && (i < 8 || ALWAYS_MAIN.has(getKey(g) ?? '')));
  const overflowGroups = groups.filter((g, i) => !RIGHT_PINNED.has(getKey(g) ?? '') && i >= 8 && !ALWAYS_MAIN.has(getKey(g) ?? ''));
  const rightGroups    = groups.filter((g)    =>  RIGHT_PINNED.has(getKey(g) ?? ''));

  return (
    <div className={s.toolbarWrapper}>

      {/* ── Row 1 ── */}
      <div className={s.toolbar}>
        {mainGroups.map((group, index) => (
          <React.Fragment key={`main-${index}`}>
            {index > 0 && <Sep />}
            {group}
          </React.Fragment>
        ))}

        {vis('more') && overflowGroups.length > 0 && (
          <>
            {mainGroups.length > 0 && <Sep />}
            <Btn active={moreOpen} label={t('More')} onClick={() => setMoreOpen((o) => !o)}>
              <FontAwesomeIcon icon={faEllipsis} rotation={90} />
            </Btn>
          </>
        )}

        {rightGroups.length > 0 && (
          <div className={s.controls}>
            {rightGroups}
          </div>
        )}
      </div>

      {/* ── Row 2 (overflow expanded) ── */}
      {moreOpen && overflowGroups.length > 0 && (
        <div className={s.toolbarSecondRow}>
          {overflowGroups.map((group, index) => (
            <React.Fragment key={`overflow-${index}`}>
              {index > 0 && <Sep />}
              {group}
            </React.Fragment>
          ))}
        </div>
      )}

    </div>
  );
}
