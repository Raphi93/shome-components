'use client';

import { ChangeEventHandler, CSSProperties, FocusEventHandler, ReactNode, useState } from 'react';
import clx from 'classnames';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { FieldWrapper, FieldSetCommonFields } from '../FieldWrapper/FieldWrapper';
import { useDebouncedInput } from '../../hooks/useDebouncedInput';
import { TLabelInputWithDirtyState, useLabelInput } from '../../hooks/useLabelInput';
import { UseFormRegister } from '../../types';

import style from '../FieldWrapper/FieldWrapper.module.scss';

export function PasswordInput({
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
  isDirty,
  dirtyText,
  onClearDirty,
  cssClass,
  readOnly,
  hasBorderLabel,
  autoComplete,
  styles,
  withDebounce = false,
  debounceDelay = 300,
}: {
  defaultValue?: string;
  value?: string;
  id?: string;
  placeholder?: string;
  disabled?: boolean;
  isWrapped?: boolean;
  register?: UseFormRegister;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  children?: ReactNode;
  hasBorderLabel?: boolean;
  autoComplete?: string;
  styles?: CSSProperties;
  withDebounce?: boolean;
  debounceDelay?: number;
} & TLabelInputWithDirtyState &
  FieldSetCommonFields) {
  const [isShowPassword, setIsShowPassword] = useState(false);
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
      className={clx(style.paddingForIcon, {
        [style.borderLabelInput]: hasBorderLabel,
        [style.active]: value && hasBorderLabel,
        [style.input]: !hasBorderLabel,
        [style.paddingForTwoIcons]: hasBorderLabel && isDirty,
      })}
      id={id}
      type={isShowPassword ? 'text' : 'password'}
      placeholder={!hasBorderLabel ? placeholder : ''}
      required={isRequired}
      defaultValue={defaultValue}
      style={styles}
      value={internalValue}
      disabled={disabled}
      autoComplete={autoComplete}
    />
  );

  const passwordIcon = (
    <button type="button" className={style.passwordInputBtn} onClick={() => setIsShowPassword((show) => !show)}>
      <FontAwesomeIcon icon={isShowPassword ? faEyeSlash : faEye} />
    </button>
  );

  const { borderLabelInput } = useLabelInput({
    input,
    cssClass,
    dirtyIconCssClass: style.dirtyIconWithOtherIcon,
    dirtyText,
    element: passwordIcon,
    onClearDirty,
    isDirty,
    id,
    label,
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
        cssClass={cssClass}
        errorText={errorText}
        readOnly={readOnly}
        label={label}
        description={description}
        isRequired={isRequired}
        labelFor={id}
        isDirty={isDirty}
        onClearDirty={onClearDirty}
        dirtyText={dirtyText}
      >
        <div className={style.passwordInputWrapper}>
          {input}
          {passwordIcon}
        </div>
        {children}
      </FieldWrapper>
    );
  }

  return input;
}
