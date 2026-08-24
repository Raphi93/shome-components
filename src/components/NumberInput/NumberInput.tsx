'use client';

import { ChangeEventHandler, CSSProperties, FocusEventHandler, ReactNode } from 'react';
import clx from 'classnames';

import { FieldWrapper, FieldSetCommonFields } from '../FieldWrapper/FieldWrapper';
import { useDebouncedInput } from '../../hooks/useDebouncedInput';
import { TLabelInputWithDirtyState, useLabelInput } from '../../hooks/useLabelInput';
import { UseFormRegister } from '../../types';

import style from '../FieldWrapper/FieldWrapper.module.scss';

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
