"use client";
import { ChangeEventHandler, CSSProperties, FocusEventHandler, JSX, ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { faCheckSquare, faEye, faEyeSlash, faSquare, faUndo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clx from 'classnames';

import { useDateFormat } from '../../hooks/dateFormat';

import { Tooltip, TooltipContent, TooltipTrigger } from '../Tooltip/Tooltip';

import { useDebouncedInput } from './hooks/useDebouncedInput';
import { TLabelInputWithDirtyState, useLabelInput } from './hooks/useLabelInput';

import style from './FieldWrapper.module.scss';
import React from 'react';
import ErrorText from '../ErrorText/ErrorText';
import { UseFormRegister } from '../../types/Register/FormRegister';
import { ActionWrapper } from '../Actions/ActionElement';

export type FieldSetCommonFields = {
  label?: string;
  isRequired?: boolean;
  description?: string;
  readOnly?: boolean;
  errorText?: string;
  cssClass?: string;
};

export function FieldWrapper({
  label,
  isRequired,
  children,
  description,
  labelFor,
  readOnly,
  errorText,
  cssClass,
  isDirty,
  onClearDirty,
  dirtyText,
}: FieldSetCommonFields & {
  children?: ReactNode;
  readOnly?: boolean;
  labelFor?: string;
  isDirty?: boolean;
  onClearDirty?: (arg: any) => void;
  dirtyText?: string;
}) {
  let requiredNode: ReactNode = undefined;
  let exampleNode: ReactNode = undefined;
  let dirtyNode: ReactNode = undefined;

  const classes = [style['field-wrapper']];
  const { t } = useTranslation();

  if (isDirty) {
    dirtyNode = (
      <span className={style.dirty}>
        <Tooltip>
          <TooltipTrigger
            className={clx({
              [style.dirtyTrigger]: onClearDirty,
            })}
            onClick={onClearDirty}
          >
            <FontAwesomeIcon className={style.dirtyIcon} icon={faUndo} />
          </TooltipTrigger>
          <TooltipContent>{dirtyText || t('Click to reset input value to initial state')}</TooltipContent>
        </Tooltip>
      </span>
    );
  }

  if (isRequired) {
    requiredNode = (
      <span className={style.required} title={`${t('The value')} ${label} ${t('Is required')}`}>
        &#42;
      </span>
    );
  }
  if (description) {
    exampleNode = <div className={style['field-description']}>{description}</div>;
  }
  if (readOnly) {
    classes.push(style['read-only']);
  }

  return (
    <div className={`${classes.join(' ')} ${cssClass ?? ''}`}>
      <div className={style['field-label']}>
        <label htmlFor={labelFor}>
          {label}
          {requiredNode}
          {dirtyNode}
        </label>
      </div>
      <div className={style['field-content']}>{children}</div>
      <ErrorText errorMessage={errorText} />
      {exampleNode}
    </div>
  );
}


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
}: {
  type?: 'text' | 'password' | 'email' | 'tel' | 'search' | 'url';
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
  cssClass?: string;
  styles?: CSSProperties;
  autofocus?: boolean;
  hasBorderLabel?: boolean;
  autoComplete?: string;
  withDebounce?: boolean;
  debounceDelay?: number;
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
      {isShowPassword ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}
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

export function NumberInput({
  label,
  isRequired = false,
  description,
  defaultValue,
  value,
  id,
  placeholder,
  disabled = false,
  isWrapped = true,
  min,
  max,
  step,
  register,
  onChange,
  onBlur,
  children,
  errorText,
  showPercent,
  cssClass,
  styles,
  isDirty,
  dirtyText,
  onClearDirty,
  hasBorderLabel,
  withDebounce,
  debounceDelay,
}: {
  /**
   *  Default value for number input
   */
  defaultValue?: number;
  value?: number;
  /**
   *  Input ID
   */
  id?: string;
  /**
   *  Placeholder for the input
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
  /**
   *  Minimum value
   */
  min?: number;
  /**
   *  Maximum value
   */
  max?: number;
  /**
   *  Sets step number
   */
  step?: number;
  register?: UseFormRegister;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  children?: ReactNode;
  showPercent?: boolean;
  cssClass?: string;
  styles?: CSSProperties;
  hasBorderLabel?: boolean;
  withDebounce?: boolean;
  debounceDelay?: number;
} & TLabelInputWithDirtyState &
  FieldSetCommonFields) {
  const { internalValue, handleChange } = useDebouncedInput({
    onChange,
    withDebounce,
    debounceDelay,
    value,
    defaultValue,
  });

  const registered =
    register && id ? register(id, { required: isRequired, valueAsNumber: true, onChange: handleChange, onBlur }) : {};

  const isValue = internalValue !== null && internalValue !== undefined && internalValue !== '';

  const input = (
    <input
      onChange={handleChange}
      onBlur={onBlur}
      {...registered}
      className={clx({
        [style.borderLabelInput]: hasBorderLabel,
        [style.percent]: showPercent,
        [style.active]: isValue && hasBorderLabel,
        [style.input]: !hasBorderLabel,
        [style.paddingForTwoIcons]: hasBorderLabel && isDirty,
      })}
      id={id}
      type="number"
      style={styles}
      placeholder={!hasBorderLabel ? placeholder : ''}
      required={isRequired}
      defaultValue={defaultValue}
      value={internalValue}
      disabled={disabled}
      min={min}
      max={max}
      step={step}
    />
  );

  const percentChildren = <>{showPercent && <span className={style.percentText}>%</span>}</>;

  const { borderLabelInput } = useLabelInput({
    label,
    cssClass,
    isDirty,
    onClearDirty,
    dirtyText,
    id,
    input,
    element: percentChildren,
    dirtyIconCssClass: style.dirtyIconWithOtherIcon,
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
        <div className={style.inputNumberWrapper}>
          {input} {percentChildren}
        </div>
        {children}
      </FieldWrapper>
    );
  }

  return input;
}

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
}: {
  defaultValue?: string;
  value?: string;
  id?: string;
  placeholder?: string;
  disabled?: boolean;
  isWrapped?: boolean;
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
  children?: ReactNode;
  cssClass?: string;
  styles?: CSSProperties;
  autofocus?: boolean;
  register?: UseFormRegister;
  hasBorderLabel?: boolean;
  autoComplete?: string;
} & FieldSetCommonFields) {
  const registered = register && id ? register(id, { onChange }) : {};

  const textarea = (
    <textarea
      onChange={onChange}
      {...registered}
      id={id}
      className={clx(
        {
          [style.borderLabelInput]: hasBorderLabel,
          [style.active]: value && hasBorderLabel,
          [style.input]: !hasBorderLabel,
        },
        style.textarea
      )}
      required={isRequired}
      defaultValue={defaultValue}
      value={value}
      disabled={disabled}
      placeholder={!hasBorderLabel ? placeholder : ''}
      style={{ height: 'auto', ...styles }}
      autoFocus={autofocus}
      autoComplete={autoComplete}
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

export type ValueType = 'dateTime' | 'boolean' | 'date' | 'time' | 'text';

export function Value({
  label,
  isRequired,
  description,
  id,
  value,
  link,
  hideEmpty,
  valueType,
  children,
  isWrapped = true,
}: {
  id?: string;
  value?: number | string | boolean;
  link?: string | JSX.Element;
  hideEmpty?: boolean;
  valueType?: ValueType;
  readOnly?: boolean;
  children?: ReactNode;
  isWrapped?: boolean;
} & FieldSetCommonFields) {
  const formatDate = useDateFormat();

  /**
   * checkbox for readonly mode without wrapper
   */
  function ValueCheckbox({ checked }: { checked?: boolean }) {
    return <FontAwesomeIcon icon={checked ? faCheckSquare : faSquare} />;
  }

  if (hideEmpty && !value && value !== false) {
    return null;
  }

  if (value && typeof value === 'string') {
    if (valueType === 'dateTime') {
      value = formatDate.formatDateTime(value);
    }
    if (valueType === 'date') {
      value = formatDate.formatDate(value);
    }
    if (valueType === 'time') {
      value = formatDate.formatTime(value);
    }
  }

  let valueComponent = <>{value}</>;

  if (valueType === 'boolean' || typeof value === 'boolean') {
    const classes = [];
    if (value) {
      classes.push('color-positive');
    } else {
      classes.push('color-gray-500');
    }

    valueComponent = (
      <span className={classes.join(' ')}>
        <ValueCheckbox checked={Boolean(value)} />
      </span>
    );
  }

  if (link) {
    // check if link is instance of Link component (from react-router-dom)
    // if yes, render it directly
    if (typeof link === 'object') {
      valueComponent = link;
    } else {
      valueComponent = (
        <ActionWrapper link={link} isExternalLink={true}>
          {valueComponent}
        </ActionWrapper>
      );
    }
  }

  if (isWrapped) {
    return (
      <FieldWrapper label={label} description={description} isRequired={isRequired} labelFor={id} readOnly={true}>
        {valueComponent}
        {children}
      </FieldWrapper>
    );
  }

  return valueComponent;
}
