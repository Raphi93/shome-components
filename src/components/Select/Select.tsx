import React, { FC, JSX, useMemo, useState } from 'react';
import ReactSelect, {
  FormatOptionLabelMeta,
  MenuPlacement,
  MenuPosition,
  MultiValue,
  SingleValue,
  Theme,
} from 'react-select';
import CreatableReactSelect from 'react-select/creatable';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clx from 'classnames';

import { ErrorText } from '../ErrorText/ErrorText';
import { BorderInputLabel, DirtyIconWithBorderLabel } from '../FieldWrapper/hooks/useLabelInput';
import { Tooltip, TooltipContent, TooltipTrigger } from '../Tooltip/Tooltip';

import { CustomDropdownIndicator } from './CustomDropdownIndicator';
import { getMultiselectBorderLabelStyles, getMultiSelectStyles, getMultiSelectTheme } from './selectStyles';

import style from '../FieldWrapper/FieldWrapper.module.scss';
import s from './Select.module.scss';

type IconLabel = {
  icon: IconProp;
  title?: string;
};

type TSelectOption = {
  value: string;
  label: string | IconLabel;
};

type TSelectBaseProps = {
  options: TSelectOption[];
  isDisabled?: boolean;
  placeholder?: string;
  closeMenuOnSelect?: boolean;
  hideSelectedOptions?: boolean;
  isClearable?: boolean;
  isSearchable?: boolean;
  maxMenuHeight?: number;
  label?: string;
  selectWidth?: string;
  color?: string;
  colorActive?: string;
  pressColor?: string;
  isCreatable?: boolean;
  description?: string;
  isRequired?: boolean;
  errorText?: string;
  hasBorderLabel?: boolean;
  isDirty?: boolean;
  onClearDirty?: (arg: any) => void;
  dirtyText?: string;
  menuPortalTarget?: HTMLElement | null;
  menuPlacement?: MenuPlacement;
  menuPosition?: MenuPosition;
};

export type MultiSelectProps = TSelectBaseProps & {
  isMulti: true;
  selectedOptions?: MultiValue<TSelectOption> | SingleValue<TSelectOption> | null;
  setSelectedOptions: (option: MultiValue<TSelectOption>) => void;
  value?: string[];
};

export type SingleSelectProps = TSelectBaseProps & {
  isMulti: false;
  selectedOptions?: SingleValue<TSelectOption> | null;
  setSelectedOptions: (option: SingleValue<TSelectOption>) => void;
  value?: string;
};

type TSelectProps = SingleSelectProps | MultiSelectProps;

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

export type { IconLabel, MultiValue, SingleValue, TSelectOption, TSelectProps };

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