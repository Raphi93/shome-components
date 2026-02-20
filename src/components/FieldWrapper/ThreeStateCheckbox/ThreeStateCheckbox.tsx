"use client";
import { ChangeEventHandler, CSSProperties, useEffect, useState } from 'react';
import clx from 'classnames';

import { FieldWrapper } from '../FieldWrapper';

import style from '../FieldWrapper.module.scss';
import React from 'react';
import { UseFormRegister } from '../../../types/Register';

export type ThreeStateCheckboxProps = {
  onChange?: (checked: CheckedState) => void;
  onRawChange?: (checked: React.ChangeEvent<HTMLInputElement>) => void;
  id?: string;
  register?: UseFormRegister;
  errorText?: string;
  isWrapped?: boolean;
  text?: string;
  value?: boolean | null;
  disabled?: boolean;
  label?: string;
  description?: string;
  isRequired?: boolean;
  cssClass?: string;
  styles?: CSSProperties;
};

export type CheckedState = boolean | null;

export const ThreeStateCheckbox = ({
  onChange,
  errorText,
  isWrapped = false,
  id,
  text,
  value = null,
  disabled = false,
  isRequired,
  description,
  label,
  cssClass,
  styles,
  onRawChange,
}: ThreeStateCheckboxProps) => {
  const [isChecked, setIsChecked] = useState<boolean | null>(value);

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (onRawChange) {
      onRawChange(e);
      return;
    }

    if (isChecked === true) {
      setIsChecked(false);
    }

    if (isChecked === false) {
      setIsChecked(null);
    }

    if (isChecked === null) {
      setIsChecked(true);
    }
  };

  useEffect(() => {
    if (onChange) {
      onChange(isChecked);
    }
  }, [isChecked, onChange]);

  useEffect(() => {
    setIsChecked(value);
  }, [value]);

  const checkbox = (
    <label className={style.checkbox} style={styles}>
      <input
        id={id}
        onChange={handleChange}
        type="checkbox"
        data-checked={isChecked === null ? 'null' : isChecked}
        checked={isChecked === true}
        disabled={disabled}
      />
      <span className={style.text}>{text}</span>
      {isChecked === null && (
        <div className={clx(style.nullStateElement, { [style.nullStateElementDisabled]: disabled })} />
      )}
    </label>
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
};
