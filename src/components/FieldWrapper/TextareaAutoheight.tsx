"use client";
import { ChangeEventHandler, ReactNode, useEffect, useRef } from 'react';
import clx from 'classnames';


import { useLabelInput } from './hooks/useLabelInput';
import { FieldSetCommonFields, FieldWrapper } from './FieldWrapper';

import style from './FieldWrapper.module.scss';
import React from 'react';
import { UseFormRegister } from '../..';
import { useScreenWidth } from '../../hooks/useScreenWidth';

export function TextareaAutoheight({
  label,
  isRequired = false,
  description,
  defaultValue,
  value,
  id,
  placeholder,
  disabled = false,
  isWrapped = true,
  startRows,
  onChange,
  register,
  children,
  errorText,
  hasBorderLabel,
  cssClass,
}: {
  defaultValue?: string;
  value?: string;
  id?: string;
  placeholder?: string;
  disabled?: boolean;
  startRows?: number;
  isWrapped?: boolean;
  children?: ReactNode;
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
  register?: UseFormRegister;
  hasBorderLabel?: boolean;
} & FieldSetCommonFields) {
  const registered = register && id ? register(id, { onChange }) : { ref: undefined };
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const formRef = registered.ref;
  const { screenWidth } = useScreenWidth();

  useEffect(() => {
    if (textareaRef.current) {
      const minHeight = startRows ? startRows * 24 : 40;

      textareaRef.current.style.height =
        textareaRef.current.scrollHeight > minHeight ? textareaRef.current.scrollHeight + 'px' : minHeight + 'px';
    }
  }, [screenWidth, startRows]);

  const textarea = (
    <textarea
      data-testid="text-area"
      onChange={onChange}
      {...registered}
      ref={(elm) => {
        (textareaRef as any).current = elm;
        formRef && formRef(elm);
      }}
      rows={startRows ?? 1}
      id={id}
      className={clx(
        {
          [style.borderLabelInput]: hasBorderLabel,
          [style.active]: value && hasBorderLabel,
          [style.input]: !hasBorderLabel,
        },
        style.textarea,
        style['textarea-autoheight']
      )}
      required={isRequired}
      defaultValue={defaultValue}
      value={value}
      disabled={disabled}
      placeholder={!hasBorderLabel ? placeholder : ''}
      onInput={(e) => {
        const input = e.target as HTMLTextAreaElement;
        if (input) {
          input.style.height = 'auto';
          input.style.height = input.scrollHeight + 'px';
        }
      }}
    ></textarea>
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
      <FieldWrapper errorText={errorText} label={label} description={description} isRequired={isRequired} labelFor={id}>
        {textarea}
        {children}
      </FieldWrapper>
    );
  }

  return textarea;
}
