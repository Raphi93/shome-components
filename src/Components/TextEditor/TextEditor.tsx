'use client';

import { useEffect, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import { useTranslation } from 'react-i18next';
import Placeholder from '@tiptap/extension-placeholder';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from 'tiptap-markdown';
import { faCode, faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { TextEditorToolbar } from './TextEditorToolbar';
import type { TextEditorFormat, TextEditorProps } from './TextEditor.type';
export type { TextEditorFormat, TextEditorProps };

import s from './TextEditor.module.scss';

export function TextEditor({
  value = '',
  onChange,
  format = 'html',
  onFormatChange,
  placeholder = '',
  readOnly = false,
  className,
}: TextEditorProps) {
  const { t } = useTranslation();
  const [currentFormat, setCurrentFormat] = useState<TextEditorFormat>(format);
  const [viewMode, setViewMode] = useState<'visual' | 'source'>('visual');
  const [sourceValue, setSourceValue] = useState('');

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
      StarterKit,
      Placeholder.configure({ placeholder }),
      Markdown.configure({ html: true, transformPastedText: true }),
    ],
    editable: !readOnly,
    content: value,
    onUpdate({ editor }) {
      if (viewMode === 'source') return;
      onChange?.(getOutput(editor));
    },
  });

  useEffect(() => {
    editor?.setEditable(!readOnly);
  }, [editor, readOnly]);

  useEffect(() => {
    setCurrentFormat(format);
  }, [format]);

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

  return (
    <div className={`${s.container}${className ? ` ${className}` : ''}`}>
      {!readOnly && (
        <div className={s.header}>
          {viewMode === 'visual' && <TextEditorToolbar editor={editor} />}

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
              title={viewMode === 'visual' ? t('Show source') : t('Show visual')}
              className={`${s.viewToggle}${viewMode === 'source' ? ` ${s.active}` : ''}`}
              onClick={viewMode === 'visual' ? enterSource : exitSource}
            >
              <FontAwesomeIcon icon={viewMode === 'visual' ? faCode : faEye} />
            </button>
          </div>
        </div>
      )}

      {viewMode === 'visual' ? (
        <EditorContent editor={editor} className={s.editorContent} />
      ) : (
        <textarea
          className={s.source}
          value={sourceValue}
          onChange={(e) => setSourceValue(e.target.value)}
          spellCheck={false}
        />
      )}
    </div>
  );
}
