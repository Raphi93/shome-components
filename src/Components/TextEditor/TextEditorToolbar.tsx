'use client';

import React from 'react';
import { type Editor } from '@tiptap/react';
import { useTranslation } from 'react-i18next';
import {
  faBold,
  faCode,
  faItalic,
  faListOl,
  faListUl,
  faQuoteLeft,
  faRotateLeft,
  faRotateRight,
  faStrikethrough,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import s from './TextEditor.module.scss';

interface ToolbarButtonProps {
  active?: boolean;
  disabled?: boolean;
  title: string;
  onClick: () => void;
  children: React.ReactNode;
}

function ToolbarButton({ active, disabled, title, onClick, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      className={`${s.toolbarBtn}${active ? ` ${s.active}` : ''}`}
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
    >
      {children}
    </button>
  );
}

interface Props {
  editor: Editor | null;
}

export function TextEditorToolbar({ editor }: Props) {
  const { t } = useTranslation();
  if (!editor) return null;

  return (
    <div className={s.toolbar}>
      <div className={s.toolbarGroup}>
        <ToolbarButton active={editor.isActive('bold')} title={t('Bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
          <FontAwesomeIcon icon={faBold} />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive('italic')} title={t('Italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <FontAwesomeIcon icon={faItalic} />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive('strike')} title={t('Strikethrough')} onClick={() => editor.chain().focus().toggleStrike().run()}>
          <FontAwesomeIcon icon={faStrikethrough} />
        </ToolbarButton>
      </div>

      <div className={s.toolbarSeparator} />

      <div className={s.toolbarGroup}>
        <ToolbarButton active={editor.isActive('heading', { level: 1 })} title={t('Heading 1')} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>H1</ToolbarButton>
        <ToolbarButton active={editor.isActive('heading', { level: 2 })} title={t('Heading 2')} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</ToolbarButton>
        <ToolbarButton active={editor.isActive('heading', { level: 3 })} title={t('Heading 3')} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</ToolbarButton>
      </div>

      <div className={s.toolbarSeparator} />

      <div className={s.toolbarGroup}>
        <ToolbarButton active={editor.isActive('bulletList')} title={t('Bullet list')} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <FontAwesomeIcon icon={faListUl} />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive('orderedList')} title={t('Ordered list')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <FontAwesomeIcon icon={faListOl} />
        </ToolbarButton>
      </div>

      <div className={s.toolbarSeparator} />

      <div className={s.toolbarGroup}>
        <ToolbarButton active={editor.isActive('blockquote')} title={t('Quote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <FontAwesomeIcon icon={faQuoteLeft} />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive('codeBlock')} title={t('Code block')} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
          <FontAwesomeIcon icon={faCode} />
        </ToolbarButton>
      </div>

      <div className={s.toolbarSeparator} />

      <div className={s.toolbarGroup}>
        <ToolbarButton disabled={!editor.can().undo()} title={t('Undo')} onClick={() => editor.chain().focus().undo().run()}>
          <FontAwesomeIcon icon={faRotateLeft} />
        </ToolbarButton>
        <ToolbarButton disabled={!editor.can().redo()} title={t('Redo')} onClick={() => editor.chain().focus().redo().run()}>
          <FontAwesomeIcon icon={faRotateRight} />
        </ToolbarButton>
      </div>
    </div>
  );
}
