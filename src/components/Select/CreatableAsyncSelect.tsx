"use client";

import React, { MutableRefObject, useState } from 'react';
import { Theme } from 'react-select';
import AsyncCreatableSelect, { AsyncCreatableProps } from 'react-select/async-creatable';
import clx from 'classnames';

import ErrorText from '../ErrorText/ErrorText';
import { BorderInputLabel } from '../FieldWrapper/hooks/useLabelInput';

import { CustomDropdownIndicator } from './CustomDropdownIndicator';
import { getMultiselectBorderLabelStyles, getMultiSelectStyles, getMultiSelectTheme } from './selectStyles';

import style from '../FieldWrapper/FieldWrapper.module.scss';
import s from './Select.module.scss';

export type TCreatableAsyncSelectProps = {
  color?: string;
  colorActive?: string;
  pressColor?: string;
  selectWidth?: number;
  label?: string;
  isRequired?: boolean;
  errorText?: string;
  description?: string;
  ref?: MutableRefObject<any>;
  hasBorderLabel?: boolean;
} & AsyncCreatableProps<any, any, any>;
export const CreatableAsyncSelect = ({
  color,
  colorActive,
  pressColor,
  selectWidth,
  label,
  isRequired,
  errorText,
  description,
  ref,
  id,
  hasBorderLabel,
  ...rest
}: TCreatableAsyncSelectProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    rest.onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    rest.onBlur?.(e);
  };

  return (
    <>
      <div
        className={clx({ [style.borderLabelInputWrapper]: hasBorderLabel })}
        style={{ width: selectWidth ? `${selectWidth}px` : '100%' }}
      >
        {label && !hasBorderLabel && (
          <span className={s.label}>
            {label}
            {isRequired && <span className={s.required}>*</span>}
          </span>
        )}

        {hasBorderLabel && (
          <BorderInputLabel
            label={label}
            isRequired={isRequired}
            id={id}
            className={clx(style.borderLabel, { [style.disabledBorderLabel]: rest.isDisabled })}
            styles={isFocused || rest.value ? getMultiselectBorderLabelStyles(isFocused, colorActive) : {}}
          />
        )}

        <AsyncCreatableSelect
          theme={(theme: Theme) => getMultiSelectTheme(theme, colorActive, color, pressColor)}
          styles={getMultiSelectStyles(color, colorActive)}
          cacheOptions
          defaultOptions
          placeholder={hasBorderLabel ? '' : rest.placeholder}
          ref={ref}
          {...rest}
          onFocus={handleFocus}
          onBlur={handleBlur}
          components={{
            DropdownIndicator: CustomDropdownIndicator,
          }}
        />
      </div>
      <ErrorText errorMessage={errorText} />
      {description && <p className={s.description}>{description}</p>}
    </>
  );
};