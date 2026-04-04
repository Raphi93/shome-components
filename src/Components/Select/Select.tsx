'use client';

import React, { FC, JSX, useMemo, useState } from 'react';
import ReactSelect, { FormatOptionLabelMeta, Theme } from 'react-select';
import CreatableReactSelect from 'react-select/creatable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clx from 'classnames';

import { ErrorText } from '../ErrorText/ErrorText';
import { BorderInputLabel, DirtyIconWithBorderLabel } from '../FieldWrapper/hooks/useLabelInput';
import { Tooltip, TooltipContent, TooltipTrigger } from '../Tooltip/Tooltip';
import { CustomDropdownIndicator } from './CustomDropdownIndicator';
import { getMultiselectBorderLabelStyles, getMultiSelectStyles, getMultiSelectTheme } from './selectStyles';

import type {
  IconLabel,
  MultiValue,
  SingleValue,
  TSelectOption,
  TSelectProps,
} from './Select.type';
export type {
  IconLabel,
  MultiSelectProps,
  MultiValue,
  SingleSelectProps,
  SingleValue,
  TSelectOption,
  TSelectProps,
} from './Select.type';

import style from '../FieldWrapper/FieldWrapper.module.scss';
import s from './Select.module.scss';

const isIconLabel = (label: TSelectOption['label']): label is IconLabel =>
  typeof label === 'object' && label !== null && 'icon' in label;

const renderSelectLabel = (label: TSelectOption['label']) => {
  if (!isIconLabel(label)) return label;

  const iconEl = (
    <span className={s.iconLabel}>
      <FontAwesomeIcon icon={label.icon} />
    </span>
  );

  if (!label.title) return iconEl;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {iconEl}
      </TooltipTrigger>
      <TooltipContent>{label.title}</TooltipContent>
    </Tooltip>
  );
};

const createOption = (label: string): TSelectOption => ({
  value: label.toLowerCase().replace(/\W/g, ''),
  label,
});


export const Select: FC<TSelectProps> = ({
  options,
  selectedOptions,
  setSelectedOptions,
  isDisabled,
  isMulti,
  placeholder,
  closeMenuOnSelect,
  hideSelectedOptions,
  isClearable,
  isSearchable,
  maxMenuHeight,
  label,
  selectWidth,
  color,
  colorActive,
  pressColor,
  isCreatable,
  description,
  isRequired,
  errorText,
  hasBorderLabel,
  onClearDirty,
  dirtyText,
  isDirty,
  value,
  menuPortalTarget = typeof document !== 'undefined' ? document.body : null,
  menuPlacement = 'auto',
  menuPosition = 'fixed',
}): JSX.Element => {
  const [newOptions, setNewOptions] = useState(options);
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const isActiveLabel =
    isFocused ||
    (Array.isArray(selectedOptions) ? selectedOptions.length > 0 : selectedOptions) ||
    value === '' ||
    value;

  const currentSelectedValue = useMemo(() => {
    if (isCreatable && selectedOptions) {
      return selectedOptions;
    }

    if (value === '') {
      const allOption = options.find((option) => option.value === '');
      return allOption || null;
    }

    if (value && !isMulti) {
      return options.find((option) => option.value === value) || null;
    }

    if (value && isMulti) {
      return options.filter((option) => value.includes(option.value));
    }

    return selectedOptions || null;
  }, [isCreatable, isMulti, options, selectedOptions, value]);

  const labelElement = (
    <>
      {label && !hasBorderLabel && (
        <span className={s.label}>
          {label}
          {isRequired && <span className={s.required}>*</span>}
        </span>
      )}

      {hasBorderLabel && (
        <>
          <BorderInputLabel
            label={label}
            isRequired={isRequired}
            className={clx(style.borderLabel, { [style.disabledBorderLabel]: isDisabled })}
            styles={isActiveLabel ? getMultiselectBorderLabelStyles(isFocused, colorActive) : {}}
          />

          {isDirty && (
            <DirtyIconWithBorderLabel
              onClearDirty={onClearDirty}
              dirtyText={dirtyText}
              className={clx({
                [s.selectDirtyIcon]: hasBorderLabel,
                [s.clearableSelectDirtyIcon]: hasBorderLabel && isClearable,
              })}
            />
          )}
        </>
      )}
    </>
  );

  const formatOptionLabel = (option: TSelectOption, meta: FormatOptionLabelMeta<TSelectOption>) => {
    return renderSelectLabel(option.label);
  };

  if (isCreatable) {
    const handleCreate = (inputValue: string) => {
      const newOption = createOption(inputValue);

      if (isMulti) {
        if (selectedOptions) {
          if (Array.isArray(selectedOptions)) {
            setNewOptions((prev) => [...prev, newOption]);
            setSelectedOptions([...selectedOptions, newOption]);
          } else {
            setSelectedOptions([selectedOptions as TSelectOption, newOption]);
          }
        } else {
          setNewOptions((prev) => [...prev, newOption]);
          setSelectedOptions([newOption]);
        }
      } else {
        setNewOptions((prev) => [...prev, newOption]);
        setSelectedOptions(newOption);
      }
    };

    return (
      <>
        <div
          className={clx({ [style.borderLabelInputWrapper]: hasBorderLabel })}
          style={{ width: selectWidth ? `${selectWidth}px` : '100%' }}
        >
          {labelElement}

          <CreatableReactSelect
            theme={(theme: Theme) => getMultiSelectTheme(theme, colorActive, color, pressColor)}
            styles={getMultiSelectStyles(color, colorActive)}
            onCreateOption={handleCreate}
            value={currentSelectedValue}
            onChange={setSelectedOptions as (option: MultiValue<TSelectOption> | SingleValue<TSelectOption>) => void}
            options={newOptions}
            isDisabled={isDisabled}
            isMulti={isMulti}
            placeholder={hasBorderLabel ? '' : placeholder}
            closeMenuOnSelect={closeMenuOnSelect}
            hideSelectedOptions={hideSelectedOptions}
            isClearable={isClearable}
            isSearchable={isSearchable}
            maxMenuHeight={maxMenuHeight}
            onFocus={handleFocus}
            onBlur={handleBlur}
            formatOptionLabel={formatOptionLabel}
            components={{
              DropdownIndicator: CustomDropdownIndicator,
            }}
            menuPortalTarget={menuPortalTarget}
            menuPlacement={menuPlacement}
            menuPosition={menuPosition}
          />
        </div>

        <ErrorText errorMessage={errorText} />
        {description && <p className={s.description}>{description}</p>}
      </>
    );
  }

  return (
    <>
      <div
        className={clx({ [style.borderLabelInputWrapper]: hasBorderLabel })}
        style={{ width: selectWidth ? `${selectWidth}px` : '100%' }}
      >
        {labelElement}

        <ReactSelect
          theme={(theme: Theme) => getMultiSelectTheme(theme, colorActive, color, pressColor)}
          styles={getMultiSelectStyles(color, colorActive)}
          value={currentSelectedValue}
          onChange={setSelectedOptions as (option: MultiValue<TSelectOption> | SingleValue<TSelectOption>) => void}
          options={options}
          isDisabled={isDisabled}
          isMulti={isMulti}
          placeholder={hasBorderLabel ? '' : placeholder}
          closeMenuOnSelect={closeMenuOnSelect}
          hideSelectedOptions={hideSelectedOptions}
          isClearable={isClearable}
          isSearchable={isSearchable}
          maxMenuHeight={maxMenuHeight}
          onFocus={handleFocus}
          onBlur={handleBlur}
          formatOptionLabel={formatOptionLabel}
          components={{
            DropdownIndicator: CustomDropdownIndicator,
          }}
          menuPortalTarget={menuPortalTarget}
          menuPlacement={menuPlacement}
          menuPosition={menuPosition}
        />
      </div>

      <ErrorText errorMessage={errorText} />
      {description && <p className={s.description}>{description}</p>}
    </>
  );
};