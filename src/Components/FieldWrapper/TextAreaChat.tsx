'use client';

import { ChangeEventHandler, KeyboardEvent, ReactNode, useEffect, useRef } from 'react';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clx from 'classnames';

import { FieldWrapper, type FieldSetCommonFields } from './FieldWrapper';

import style from './FieldWrapper.module.scss';

export interface TextAreaChatProps extends FieldSetCommonFields {
  value?: string;
  id?: string;
  placeholder?: string;
  disabled?: boolean;
  isWrapped?: boolean;
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
  onSend?: (value: string) => void;
  children?: ReactNode;
  sendButtonTitle?: string;
}

export function TextAreaChat({
  label,
  isRequired = false,
  description,
  value,
  id,
  placeholder,
  disabled = false,
  isWrapped = true,
  onChange,
  onSend,
  children,
  errorText,
  cssClass,
  sendButtonTitle = 'Send',
}: TextAreaChatProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    adjustHeight();
  }, [value]);

  function adjustHeight() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleSend() {
    if (disabled) return;
    const val = value ?? textareaRef.current?.value ?? '';
    if (val.trim() && onSend) {
      onSend(val);
    }
  }

  const hasValue = value !== undefined ? value.trim().length > 0 : false;

  const chatInput = (
    <div className={clx(style.textAreaChatWrapper, { [style.textAreaChatDisabled]: disabled })}>
      <textarea
        ref={textareaRef}
        id={id}
        rows={1}
        className={style.textAreaChatInput}
        value={value}
        onChange={(e) => {
          adjustHeight();
          onChange?.(e);
        }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        required={isRequired}
      />
      <button
        type="button"
        className={style.textAreaChatSendBtn}
        onClick={handleSend}
        disabled={disabled || !hasValue}
        aria-label={sendButtonTitle}
        title={sendButtonTitle}
      >
        <FontAwesomeIcon icon={faPaperPlane} />
      </button>
    </div>
  );

  if (isWrapped) {
    return (
      <FieldWrapper
        errorText={errorText}
        label={label}
        description={description}
        isRequired={isRequired}
        labelFor={id}
        cssClass={cssClass}
      >
        {chatInput}
        {children}
      </FieldWrapper>
    );
  }

  return chatInput;
}
