'use client';

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import { useTranslation } from 'react-i18next';
import Placeholder from '@tiptap/extension-placeholder';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import FontFamily from '@tiptap/extension-font-family';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import Superscript from '@tiptap/extension-superscript';
import Subscript from '@tiptap/extension-subscript';
import Image from '@tiptap/extension-image';
import { Table, TableRow, TableHeader, TableCell } from '@tiptap/extension-table';
import { Extension, mergeAttributes } from '@tiptap/core';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { createLowlight, all } from 'lowlight';
import { Markdown } from 'tiptap-markdown';

import { TextEditorToolbar } from './TextEditorToolbar';
import { formatHtml } from './TextEditorToolbar.utils';
import type { FontOption, TextEditorFormat, TextEditorProps, ToolbarItem } from './TextEditor.type';
export type { TextEditorFormat, TextEditorProps };
export type { FontOption, ToolbarItem } from './TextEditor.type';
export type { TextEditorView } from './TextEditor.type';

import s from './TextEditor.module.scss';

const lowlight = createLowlight(all);

// ─── GlobalStyle: preserves inline style= on all block/mark nodes ─────────────
const GlobalStyle = Extension.create({
  name: 'globalStyle',
  addGlobalAttributes() {
    return [
      {
        types: [
          'paragraph', 'heading', 'bulletList', 'orderedList', 'listItem',
          'blockquote', 'table', 'tableRow', 'tableCell', 'tableHeader',
          'bold', 'italic', 'strike', 'underline', 'link', 'highlight',
          'superscript', 'subscript',
        ],
        attributes: {
          style: {
            default: null,
            parseHTML: (el) => (el as HTMLElement).getAttribute('style') || null,
            renderHTML: (attrs) => (attrs.style ? { style: attrs.style } : {}),
          },
        },
      },
    ];
  },
});

// ─── Custom Image extension (adds style support) ──────────────────────────────

const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      style: {
        default: null,
        parseHTML: (el) => (el as HTMLElement).getAttribute('style') || null,
        renderHTML: (attrs) => (attrs['style'] ? { style: attrs['style'] } : {}),
      },
    };
  },
  renderHTML({ HTMLAttributes }) {
    return ['img', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
  },
});

// ─── Custom FontSize extension ────────────────────────────────────────────────

const FontSize = Extension.create({
  name: 'fontSize',
  addGlobalAttributes() {
    return [{
      types: ['textStyle'],
      attributes: {
        fontSize: {
          default: null,
          parseHTML: (el) => (el as HTMLElement).style.fontSize || null,
          renderHTML: (attrs) => attrs['fontSize'] ? { style: `font-size: ${attrs['fontSize']}` } : {},
        },
      },
    }];
  },
  addCommands() {
    return {
      setFontSize:   (fontSize: string) => ({ chain }) => chain().setMark('textStyle', { fontSize }).run(),
      unsetFontSize: ()                 => ({ chain }) => chain().setMark('textStyle', { fontSize: null }).removeEmptyTextStyle().run(),
    };
  },
});

// ─── Brand font system ────────────────────────────────────────────────────────

type BrandFontAsset = { path: string; fileName: string; fontName: string };

const BRAND_FONTS: Record<string, BrandFontAsset> = {
  audi:    { path: '/Fonts/AudiType/AudiTypeVF-Variable.ttf',                          fileName: 'AudiTypeVF-Variable.ttf',                    fontName: 'AudiTypeVF-Variable' },
  renault: { path: '/Fonts/NouvelR/NouvelR-Variable.ttf',                              fileName: 'NouvelR-Variable.ttf',                       fontName: 'NouvelR-Variable' },
  kgm:     { path: '/Fonts/Montserrat/Montserrat-VariableFont_wght.ttf',               fileName: 'Montserrat-VariableFont_wght.ttf',            fontName: 'Montserrat-VariableFont_wght' },
  honda:   { path: '/Fonts/Inter/Inter-Variable.ttf',                                  fileName: 'Inter-Variable.ttf',                         fontName: 'Inter-Variable' },
  hyundai: { path: '/Fonts/Hyundai/HyundaiSansHeadOfficeText-Variable.ttf',            fileName: 'HyundaiSansHeadOfficeText-Variable.ttf',     fontName: 'HyundaiSansHeadOfficeText-Variable' },
  huntu:   { path: '/Fonts/Hyundai/HyundaiSansHeadOfficeText-Variable.ttf',            fileName: 'HyundaiSansHeadOfficeText-Variable.ttf',     fontName: 'HyundaiSansHeadOfficeText-Variable' },
};

const STANDARD_FONT_OPTIONS: FontOption[] = [
  { label: 'Default',         value: '' },
  { label: 'Arial',           value: 'Arial, sans-serif' },
  { label: 'Helvetica',       value: 'Helvetica, Arial, sans-serif' },
  { label: 'Verdana',         value: 'Verdana, Geneva, sans-serif' },
  { label: 'Tahoma',          value: 'Tahoma, Geneva, sans-serif' },
  { label: 'Trebuchet MS',    value: '"Trebuchet MS", Helvetica, sans-serif' },
  { label: 'Georgia',         value: 'Georgia, serif' },
  { label: 'Times New Roman', value: '"Times New Roman", Times, serif' },
  { label: 'Courier New',     value: '"Courier New", Courier, monospace' },
  { label: 'Outfit',          value: 'Outfit, sans-serif' },
];

const normalizeBrand = (brand?: string) => (brand ?? '').trim().toLowerCase();

const getDefaultFonts = (brand?: string): FontOption[] => {
  const brandFont = BRAND_FONTS[normalizeBrand(brand)];
  if (!brandFont) return STANDARD_FONT_OPTIONS;
  return [
    STANDARD_FONT_OPTIONS[0],
    { label: brandFont.fontName, value: brandFont.fontName },
    ...STANDARD_FONT_OPTIONS.slice(1),
  ];
};

const ensureBrandFontFace = (font?: BrandFontAsset) => {
  if (!font || typeof document === 'undefined') return;
  const styleId = `text-editor-font-${font.fontName}`;
  if (document.getElementById(styleId)) return;
  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `@font-face { font-family: '${font.fontName}'; src: url('${font.path}') format('truetype'); font-display: swap; }`;
  document.head.appendChild(style);
};

// ─── TextEditor ───────────────────────────────────────────────────────────────

export function TextEditor({
  value = '',
  onChange,
  format = 'html',
  onFormatChange,
  onlyFormat,
  placeholder = '',
  readOnly = false,
  id,
  className,
  hide = [],
  fonts,
  colors,
  brand,
  minHeight = 120,
  maxHeight,
  wordCount = false,
  onMagicWandClick,
}: TextEditorProps) {
  const { t } = useTranslation();
  const [currentFormat, setCurrentFormat] = useState<TextEditorFormat>(onlyFormat ?? format);
  const [viewMode, setViewMode]           = useState<'visual' | 'source'>('visual');
  const [sourceValue, setSourceValue]     = useState('');
  const [fullscreen, setFullscreen]       = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const normalizedBrand  = normalizeBrand(brand);
  const resolvedBrandFont = BRAND_FONTS[normalizedBrand];

  const resolvedFonts = useMemo(() => {
    const defaultFonts = getDefaultFonts(brand);
    if (!fonts || fonts.length === 0) return defaultFonts;
    const seen = new Set<string>();
    return [...defaultFonts, ...fonts].filter((item) => {
      const key = `${item.label}__${item.value}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [brand, fonts]);

  const mdStorage = (editor: ReturnType<typeof useEditor>) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (editor?.storage as any)?.markdown as { getMarkdown: () => string; parser: { parse: (s: string) => unknown } } | undefined;

  const getOutput = (editor: ReturnType<typeof useEditor>): string => {
    if (!editor) return '';
    return currentFormat === 'markdown'
      ? (mdStorage(editor)?.getMarkdown() ?? '')
      : editor.getHTML();
  };

  const editor = useEditor({
    extensions: [
      GlobalStyle,
      StarterKit.configure({ codeBlock: false }),
      CodeBlockLowlight.configure({ lowlight }),
      Placeholder.configure({ placeholder }),
      Markdown.configure({ html: true, transformPastedText: true }),
      Underline,
      TextStyle,
      Color,
      FontFamily,
      FontSize,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Highlight,
      Link.configure({ openOnClick: false }),
      Superscript,
      Subscript,
      CustomImage,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    immediatelyRender: false,
    editable: !readOnly,
    content: value,
    onUpdate({ editor }) {
      if (viewMode === 'source') return;
      onChange?.(getOutput(editor));
    },
  });

  useEffect(() => { editor?.setEditable(!readOnly); }, [editor, readOnly]);
  useEffect(() => { if (!onlyFormat) setCurrentFormat(format); }, [format, onlyFormat]);

  // Sync external value changes into the editor (controlled component)
  useEffect(() => {
    if (!editor || viewMode === 'source') return;
    const current = getOutput(editor);
    if (value !== current) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (editor.commands as any).setContent(value, { emitUpdate: false });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, value]);

  useEffect(() => { ensureBrandFontFace(resolvedBrandFont); }, [resolvedBrandFont]);

  // Close fullscreen on Escape
  useEffect(() => {
    if (!fullscreen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setFullscreen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [fullscreen]);

  const handleFormatChange = (newFormat: TextEditorFormat) => {
    setCurrentFormat(newFormat);
    onFormatChange?.(newFormat);
    if (editor) {
      const output = newFormat === 'markdown'
        ? (mdStorage(editor)?.getMarkdown() ?? '')
        : editor.getHTML();
      onChange?.(output);
    }
  };

  const enterSource = () => {
    if (!editor) return;
    const output = getOutput(editor);
    setSourceValue(currentFormat === 'html' ? formatHtml(output) : output);
    setViewMode('source');
  };

  const exitSource = () => {
    if (!editor) return;
    if (currentFormat === 'markdown') {
      editor.commands.setContent(mdStorage(editor)?.parser.parse(sourceValue) as string);
    } else {
      editor.commands.setContent(sourceValue);
    }
    onChange?.(sourceValue);
    setViewMode('visual');
  };

  // Word / char count
  const text  = editor?.getText() ?? '';
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;

  const contentStyle: CSSProperties = {
    ['--te-min-h' as string]: `${minHeight}px`,
    ['--te-font-primary' as string]: resolvedBrandFont?.fontName ?? 'Outfit, Arial, sans-serif',
    ...(maxHeight ? { ['--te-max-h' as string]: `${maxHeight}px` } : {}),
  };

  const containerClass = [
    s.container,
    fullscreen ? s.fullscreen : '',
    className ?? '',
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClass} ref={containerRef}>
      {!readOnly && (
        <div className={s.header}>
          <TextEditorToolbar
            editor={editor}
            hide={hide}
            fonts={resolvedFonts}
            colors={colors}
            fullscreen={fullscreen}
            onFullscreen={() => setFullscreen((f) => !f)}
            onMagicWandClick={onMagicWandClick}
            format={currentFormat}
            onFormatChange={handleFormatChange}
            onlyFormat={onlyFormat}
            viewMode={viewMode}
            onToggleViewMode={viewMode === 'visual' ? enterSource : exitSource}
          />
        </div>
      )}

      {viewMode === 'visual' ? (
        <EditorContent editor={editor} className={s.editorContent} style={contentStyle} id={id} />
      ) : (
        <textarea
          id={id}
          className={s.source}
          value={sourceValue}
          onChange={(e) => setSourceValue(e.target.value)}
          spellCheck={false}
          style={contentStyle}
        />
      )}

      {wordCount && !readOnly && (
        <div className={s.wordCount}>
          {words} {t('words')} &middot; {chars} {t('characters')}
        </div>
      )}
    </div>
  );
}
