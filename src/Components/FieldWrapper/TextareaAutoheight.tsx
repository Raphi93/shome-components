'use client';

import React, { ChangeEventHandler, CSSProperties, ReactNode, useEffect, useRef } from 'react';
import clx from 'classnames';

import { FieldSetCommonFields, FieldWrapper } from './FieldWrapper';
import { useLabelInput } from './hooks/useLabelInput';
import { UseFormRegister } from '../../types';

import style from './FieldWrapper.module.scss';

export interface TextareaAutoheightProps extends FieldSetCommonFields {
  value?: string;
  defaultValue?: string;
  id?: string;
  placeholder?: string;
  disabled?: boolean;
  /** Minimum visible rows (default: 2) */
  startRows?: number;
  /** Maximum height in px before scrolling kicks in (default: 400) */
  maxHeight?: number;
  isWrapped?: boolean;
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
  register?: UseFormRegister;
  children?: ReactNode;
  hasBorderLabel?: boolean;
  styles?: CSSProperties;
  autofocus?: boolean;
  autoComplete?: string;
}

export function TextareaAutoheight({
  label,
  isRequired = false,
  description,
  value,
  defaultValue,
  id,
  placeholder,
  disabled = false,
  startRows = 2,
  maxHeight = 400,
  isWrapped = true,
  onChange,
  register,
  children,
  errorText,
  cssClass,
  hasBorderLabel,
  styles,
  autofocus = false,
  autoComplete,
}: TextareaAutoheightProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const registered = register && id ? register(id, { onChange }) : { ref: undefined };
  const formRef = (registered as { ref?: ((el: HTMLTextAreaElement | null) => void) | null }).ref;

  function adjustHeight() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const next = Math.min(el.scrollHeight, maxHeight);
    el.style.height = `${next}px`;
    el.style.overflowY = el.scrollHeight > maxHeight ? 'auto' : 'hidden';
  }

  useEffect(() => {
    adjustHeight();
  }, [value, maxHeight]);

  const textarea = (
    <textarea
      data-testid="text-area"
      onChange={onChange}
      {...registered}
      ref={(el) => {
        (textareaRef as React.MutableRefObject<HTMLTextAreaElement | null>).current = el;
        if (formRef) formRef(el);
      }}
      id={id}
      rows={startRows}
      className={clx(
        {
          [style.borderLabelInput]: hasBorderLabel,
          [style.active]: value && hasBorderLabel,
          [style.input]: !hasBorderLabel,
        },
        style.textarea,
        style['textarea-autoheight'],
      )}
      required={isRequired}
      defaultValue={defaultValue}
      value={value}
      disabled={disabled}
      placeholder={!hasBorderLabel ? placeholder : ''}
      autoFocus={autofocus}
      autoComplete={autoComplete}
      style={styles}
      onInput={adjustHeight}
    />
  );

  const { borderLabelInput: textAreaWithLabel } = useLabelInput({
    input: textarea,
    cssClass,
    dirtyIconCssClass: style.dirtyIconForWithOtherIcon,
    id,
    label,
    isRequired,
    errorText,
    isDisabled: disabled,
    labelClass: style.textAreaBorderLabel,
  });

  if (hasBorderLabel) {
    if (children) {
      return (
        <div className={style.childrenWrapper}>
          {textAreaWithLabel}
          <div className={style.children}>{children}</div>
        </div>
      );
    }
    return textAreaWithLabel;
  }

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
        {textarea}
        {children}
      </FieldWrapper>
    );
  }

  return textarea;
}
