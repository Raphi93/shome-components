'use client';

import { useEffect, useRef, useState } from 'react';
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

const lowlight = createLowlight(all);
import { faCode, faEye, faExpand, faCompress } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { TextEditorToolbar } from './TextEditorToolbar';
import type { TextEditorFormat, TextEditorProps } from './TextEditor.type';
export type { TextEditorFormat, TextEditorProps };
export type { FontOption, ToolbarItem } from './TextEditor.type';

import s from './TextEditor.module.scss';

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

// ─── TextEditor ───────────────────────────────────────────────────────────────

export function TextEditor({
  value = '',
  onChange,
  format = 'html',
  onFormatChange,
  placeholder = '',
  readOnly = false,
  className,
  hide = [],
  fonts,
  colors,
  emoji = false,
  minHeight = 120,
  maxHeight,
  wordCount = false,
}: TextEditorProps) {
  const { t } = useTranslation();
  const [currentFormat, setCurrentFormat] = useState<TextEditorFormat>(format);
  const [viewMode, setViewMode]           = useState<'visual' | 'source'>('visual');
  const [sourceValue, setSourceValue]     = useState('');
  const [fullscreen, setFullscreen]       = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const mdStorage = (editor: ReturnType<typeof useEditor>) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (editor?.storage as any)?.markdown as { getMarkdown: () => string; parseMarkdown: (s: string) => unknown } | undefined;

  const getOutput = (editor: ReturnType<typeof useEditor>): string => {
    if (!editor) return '';
    return currentFormat === 'markdown'
      ? (mdStorage(editor)?.getMarkdown() ?? '')
      : editor.getHTML();
  };

  const editor = useEditor({
    extensions: [
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
  useEffect(() => { setCurrentFormat(format); }, [format]);

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
    setSourceValue(getOutput(editor));
    setViewMode('source');
  };

  const exitSource = () => {
    if (!editor) return;
    if (currentFormat === 'markdown') {
      editor.commands.setContent(mdStorage(editor)?.parseMarkdown(sourceValue) as string);
    } else {
      editor.commands.setContent(sourceValue);
    }
    onChange?.(sourceValue);
    setViewMode('visual');
  };

  // Word / char count
  const text   = editor?.getText() ?? '';
  const words  = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars  = text.length;

  // CSS custom properties for min/max height
  const contentStyle: React.CSSProperties = {
    ['--te-min-h' as string]: `${minHeight}px`,
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
          {viewMode === 'visual' && (
            <TextEditorToolbar
              editor={editor}
              hide={hide}
              fonts={fonts}
              colors={colors}
              emoji={emoji}
              fullscreen={fullscreen}
              onFullscreen={() => setFullscreen((f) => !f)}
            />
          )}

          <div className={s.controls}>
            <select
              className={s.formatSelect}
              value={currentFormat}
              onChange={(e) => handleFormatChange(e.target.value as TextEditorFormat)}
            >
              <option value="html">{t('HTML')}</option>
              <option value="markdown">{t('Markdown')}</option>
            </select>

            <button
              type="button"
              className={`${s.viewToggle}${viewMode === 'source' ? ` ${s.active}` : ''}`}
              onClick={viewMode === 'visual' ? enterSource : exitSource}
            >
              <FontAwesomeIcon icon={viewMode === 'visual' ? faCode : faEye} />
            </button>

            <button
              type="button"
              className={s.viewToggle}
              onClick={() => setFullscreen((f) => !f)}
            >
              <FontAwesomeIcon icon={fullscreen ? faCompress : faExpand} />
            </button>
          </div>
        </div>
      )}

      {viewMode === 'visual' ? (
        <EditorContent editor={editor} className={s.editorContent} style={contentStyle} />
      ) : (
        <textarea
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
