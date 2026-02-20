"use client";
import { ChangeEventHandler, ReactNode } from 'react';
import clx from 'classnames';

import { UseFormRegister } from '../../types/Register/FormRegister';
import { ErrorText } from '../ErrorText/ErrorText';

import { DirtyIconWithBorderLabel, TLabelInputWithDirtyState } from './hooks/useLabelInput';
import { FieldSetCommonFields, FieldWrapper } from './FieldWrapper';

import style from './Toggle.module.scss';


/**
 * Toggle for enabling / disabling
 */
export function ToggleActive({
  label,
  description,
  activeText,
  disabledText,
  textOnLeft = false,
  id,
  isRequired,
  disabled = false,
  isWrapped = true,
  defaultValue,
  value,
  secondary = false,
  register,
  onChange,
  errorText,
  hasBorderLabel,
  onClearDirty,
  dirtyText,
  isDirty,
  cssClass,
}: {
  activeText?: string;
  disabledText?: string;
  textOnLeft?: boolean;
  id?: string;
  disabled?: boolean;
  isWrapped?: boolean;
  defaultValue?: boolean;
  value?: boolean;
  secondary?: boolean;
  register?: UseFormRegister;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  hasBorderLabel?: boolean;
} & TLabelInputWithDirtyState &
  FieldSetCommonFields) {
  const registered = register && id ? register(id, { required: isRequired, onChange }) : {};

  const classes = clx(
    style['toggle-wrapper'],
    style['toggle-active'],
    secondary && style.secondary,
    textOnLeft && style['text-left'],
    !(activeText && disabledText) && style['no-text'],
    { [style.borderLabelWrapper]: hasBorderLabel },
    cssClass
  );

  let textNode: ReactNode = undefined;

  if (activeText && disabledText) {
    textNode = (
      <>
        <span className={style['disabled']}>{disabledText}</span>
        <span className={style['active']}>{activeText}</span>
      </>
    );
  }

  const toggle = (
    <>
      <label className={classes}>
        <input
          onChange={onChange}
          {...registered}
          id={id}
          type="checkbox"
          defaultChecked={defaultValue}
          checked={value}
          disabled={disabled}
        />

        <div className={style.inner}>
          {hasBorderLabel && (
            <>
              <span className={style.borderLabel}>
                <span>{label}</span>
              </span>
            </>
          )}

          <span className={style['toggle']}></span>

          {activeText && disabledText && textNode}

          {isDirty && hasBorderLabel && (
            <DirtyIconWithBorderLabel
              onClearDirty={onClearDirty}
              dirtyText={dirtyText}
              className={style.toggleDirtyIcon}
            />
          )}
        </div>
      </label>
      {(hasBorderLabel || !isWrapped) && <ErrorText errorMessage={errorText} />}
    </>
  );

  if (isWrapped && !hasBorderLabel) {
    return (
      <FieldWrapper
        errorText={errorText}
        label={label}
        description={description}
        isRequired={isRequired}
        labelFor={id}
        dirtyText={dirtyText}
        onClearDirty={onClearDirty}
        isDirty={isDirty}
      >
        {toggle}
      </FieldWrapper>
    );
  }

  return toggle;
}

export function ToggleOptions({
  label,
  leftChoice,
  rightChoice,
  description,
  id,
  isRequired,
  disabled = false,
  isWrapped = true,
  defaultValue,
  value,
  secondary = false,
  register,
  onChange,
}: {
  leftChoice: string;
  rightChoice: string;
  id?: string;
  disabled?: boolean;
  isWrapped?: boolean;
  defaultValue?: boolean;
  value?: boolean;
  secondary?: boolean;
  register?: UseFormRegister;
  onChange?: ChangeEventHandler<HTMLInputElement>;
} & FieldSetCommonFields) {
  const registered = register && id ? register(id, { required: isRequired, onChange }) : {};

  const toggle = (
    <label className={clx(style['toggle-wrapper'], secondary && style.secondary)}>
      <input
        onChange={onChange}
        {...registered}
        id={id}
        type="checkbox"
        defaultChecked={defaultValue}
        checked={value}
        disabled={disabled}
      />
      <div className={style.inner}>
        <span className={style['left']}>{leftChoice}</span>
        <span className={style['toggle']}></span>
        <span className={style['right']}>{rightChoice}</span>
      </div>
    </label>
  );

  if (isWrapped) {
    return (
      <FieldWrapper label={label} description={description} isRequired={isRequired} labelFor={id}>
        {toggle}
      </FieldWrapper>
    );
  }

  return toggle;
}
