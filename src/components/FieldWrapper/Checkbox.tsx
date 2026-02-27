"use client";
import { ChangeEventHandler, CSSProperties } from 'react';

import { FieldSetCommonFields, FieldWrapper } from './FieldWrapper';

import style from './FieldWrapper.module.scss';
import React from 'react';
import { UseFormRegister } from '../..';

export function Checkbox({
  id,
  label,
  isRequired,
  description,
  text,
  defaultValue,
  value,
  disabled = false,
  isWrapped = true,
  onChange,
  onNotWrappedLabelClick,
  register,
  errorText,
  cssClass,
  styles,
}: {
  id?: string;
  text?: string;
  defaultValue?: boolean;
  value?: boolean;
  disabled?: boolean;
  isWrapped?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onNotWrappedLabelClick?: (e: React.MouseEvent<HTMLLabelElement>) => void;
  register?: UseFormRegister;
  errorText?: string;
  cssClass?: string;
  styles?: CSSProperties;
} & FieldSetCommonFields) {
  const registered = register && id ? register(id, { onChange }) : {};

  const checkbox = (
    <>
      <label className={style.checkbox} style={styles} onClick={onNotWrappedLabelClick}>
        <input
          onChange={onChange}
          {...registered}
          id={id}
          type="checkbox"
          defaultChecked={defaultValue}
          checked={value}
          disabled={disabled}
        />
        <span className={style.text}>{text}</span>
      </label>
    </>
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
        {checkbox}
      </FieldWrapper>
    );
  }

  return checkbox;
}
