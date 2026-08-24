'use client';

import { ChangeEventHandler, CSSProperties, FocusEventHandler, ReactNode } from 'react';
import clx from 'classnames';

import { FieldWrapper, FieldSetCommonFields } from '../FieldWrapper/FieldWrapper';
import { useDebouncedInput } from '../../hooks/useDebouncedInput';
import { TLabelInputWithDirtyState, useLabelInput } from '../../hooks/useLabelInput';
import { UseFormRegister } from '../../types';

import style from '../FieldWrapper/FieldWrapper.module.scss';

/**
 * Input for string types
 */
export function StringInput({
  type = 'text',
  label,
  isRequired,
  description,
  defaultValue,
  value,
  id,
  placeholder,
  disabled = false,
  isWrapped = true,
  register,
  onChange,
  onBlur,
  children,
  errorText,
  cssClass,
  styles,
  autofocus = false,
  isDirty,
  onClearDirty,
  dirtyText,
  hasBorderLabel,
  autoComplete,
  withDebounce = false,
  debounceDelay = 300,
  maxLength,
}: {
  /**
   * Type of the StringInput
   */
  type?: 'text' | 'password' | 'email' | 'tel' | 'search' | 'url';
  /**
   * Default value of the Input
   */
  defaultValue?: string;
  /**
   * Input value
   */
  value?: string;
  /**
   * Input id
   */
  id?: string;
  /**
   * Input placeholder
   */
  placeholder?: string;
  /**
   *  Allows to disable the input
   */
  disabled?: boolean;
  /**
   * Element is wrapped by FieldWrapper component for usage inside FieldSet form component
   */
  isWrapped?: boolean;
  register?: UseFormRegister;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  children?: ReactNode;
  cssClass?: string;
  styles?: CSSProperties;
  autofocus?: boolean;
  hasBorderLabel?: boolean;
  autoComplete?: string;
  withDebounce?: boolean;
  debounceDelay?: number;
  maxLength?: number;
} & TLabelInputWithDirtyState &
  FieldSetCommonFields) {
  const { internalValue, handleChange } = useDebouncedInput({
    onChange,
    withDebounce,
    debounceDelay,
    value,
    defaultValue,
  });

  const registered = register && id ? register(id, { required: isRequired, onChange: handleChange, onBlur }) : {};

  const input = (
    <input
      onChange={handleChange}
      onBlur={onBlur}
      {...registered}
      className={clx({
        [style.borderLabelInput]: hasBorderLabel,
        [style.active]: value && hasBorderLabel,
        [style.input]: !hasBorderLabel,
        [style.paddingForIcon]: hasBorderLabel && isDirty,
      })}
      id={id}
      type={type}
      placeholder={!hasBorderLabel ? placeholder : ''}
      required={isRequired}
      defaultValue={defaultValue}
      value={internalValue}
      disabled={disabled}
      style={styles}
      autoFocus={autofocus}
      autoComplete={autoComplete}
      maxLength={maxLength}
    />
  );

  const { borderLabelInput } = useLabelInput({
    label,
    cssClass,
    isDirty,
    onClearDirty,
    dirtyText,
    id,
    input,
    isRequired,
    errorText,
    isDisabled: disabled,
  });

  if (hasBorderLabel) {
    if (children) {
      return (
        <div className={style.childrenWrapper}>
          {borderLabelInput}
          <div className={style.children}>{children}</div>
        </div>
      );
    }

    return borderLabelInput;
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
        isDirty={isDirty}
        onClearDirty={onClearDirty}
        dirtyText={dirtyText}
      >
        {input}
        {children}
      </FieldWrapper>
    );
  }

  return input;
}
