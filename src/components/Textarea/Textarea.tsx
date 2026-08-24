'use client';

import { ChangeEventHandler, CSSProperties, ReactNode, useEffect, useRef } from 'react';
import clx from 'classnames';

import { FieldWrapper, FieldSetCommonFields } from '../FieldWrapper/FieldWrapper';
import { useLabelInput } from '../../hooks/useLabelInput';
import { UseFormRegister } from '../../types';

import style from '../FieldWrapper/FieldWrapper.module.scss';

/**
 * Multi-row text field
 */
export function Textarea({
  label,
  isRequired = false,
  description,
  defaultValue,
  value,
  id,
  placeholder,
  disabled = false,
  isWrapped = true,
  onChange,
  register,
  children,
  errorText,
  cssClass,
  styles,
  autofocus = false,
  hasBorderLabel,
  autoComplete,
  autoHeight = false,
  rows,
  maxHeight,
}: {
  /**
   *  `TextArea` default value
   */
  defaultValue?: string;
  /**
   *  `TextArea`  value
   */
  value?: string;
  /**
   *  Input ID
   */
  id?: string;
  /**
   *  Input placeholder
   */
  placeholder?: string;
  /**
   * Sets input disabled
   */
  disabled?: boolean;
  /**
   * Element is wrapped by FieldWrapper component for usage inside FieldSet form component
   */
  isWrapped?: boolean;
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
  children?: ReactNode;
  cssClass?: string;
  styles?: CSSProperties;
  autofocus?: boolean;
  register?: UseFormRegister;
  hasBorderLabel?: boolean;
  autoComplete?: string;
  /** Auto-grow height as the user types */
  autoHeight?: boolean;
  /** Minimum visible rows when autoHeight is enabled (default: 2) */
  rows?: number;
  /** Maximum height in px before scrolling kicks in when autoHeight is enabled (default: 400) */
  maxHeight?: number;
} & FieldSetCommonFields) {
  const registered = register && id ? register(id, { onChange }) : {};
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function adjustHeight() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const max = maxHeight ?? 400;
    const next = Math.min(el.scrollHeight, max);
    el.style.height = `${next}px`;
    el.style.overflowY = el.scrollHeight > max ? 'auto' : 'hidden';
  }

  useEffect(() => {
    if (autoHeight) adjustHeight();
  }, [value, autoHeight, maxHeight]);

  const textarea = (
    <textarea
      onChange={onChange}
      {...registered}
      ref={(el) => {
        (textareaRef as React.MutableRefObject<HTMLTextAreaElement | null>).current = el;
        const formRef = (registered as { ref?: ((e: HTMLTextAreaElement | null) => void) | null }).ref;
        if (formRef) formRef(el);
      }}
      id={id}
      rows={autoHeight ? (rows ?? 2) : undefined}
      className={clx(
        {
          [style.borderLabelInput]: hasBorderLabel,
          [style.active]: value && hasBorderLabel,
          [style.input]: !hasBorderLabel,
        },
        style.textarea,
        autoHeight && style['textarea-autoheight'],
      )}
      required={isRequired}
      defaultValue={defaultValue}
      value={value}
      disabled={disabled}
      placeholder={!hasBorderLabel ? placeholder : ''}
      style={autoHeight ? styles : { height: 'auto', ...styles }}
      autoFocus={autofocus}
      autoComplete={autoComplete}
      onInput={autoHeight ? adjustHeight : undefined}
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
