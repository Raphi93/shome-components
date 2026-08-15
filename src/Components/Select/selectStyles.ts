import { ControlProps, CSSObjectWithLabel, Theme } from 'react-select';

import type { TSelectOption } from './Select.type';

export const getMultiSelectStyles = (color?: string, colorActive?: string) => {
  return {
    menu: (provided: CSSObjectWithLabel) => ({
      ...provided,
      zIndex: 100,
      backgroundColor: 'var(--select-menu-bg)',
      color: 'var(--select-text)',
    }),
    option: (provided: CSSObjectWithLabel, state: any) => ({
      ...provided,
      cursor: 'pointer',
      minHeight: '40px',
      backgroundColor: state.isSelected
        ? 'var(--select-option-selected-bg)'
        : state.isFocused
        ? 'var(--select-option-focused-bg)'
        : 'var(--select-option-bg)',
      color: state.isSelected ? 'var(--select-option-selected-text)' : 'var(--select-text)',
    }),
    control: (provided: CSSObjectWithLabel, state: ControlProps<TSelectOption>) => ({
      ...provided,
      cursor: 'pointer',
      backgroundColor: state.isDisabled ? 'var(--select-control-bg-disabled)' : 'var(--select-control-bg)',
      boxShadow: state.isFocused ? '0 0 0 2px var(--input-focus-outline-color)' : provided.borderColor,
      borderColor: state.isFocused ? 'var(--select-control-border-focused)' : 'var(--select-control-border)',
      color: 'var(--select-text)',
      paddingTop: '1px',
      paddingBottom: '1px',
    }),
    multiValue: (provided: CSSObjectWithLabel) => ({
      ...provided,
      marginTop: '8px',
      height: '20px',
      backgroundColor: colorActive ? colorActive : 'var(--select-multi-value-bg)',
    }),
    multiValueLabel: (provided: CSSObjectWithLabel) => ({
      ...provided,
      display: 'flex',
      alignItems: 'center',
      color: 'var(--select-multi-value-text)',
    }),
    multiValueRemove: (provided: CSSObjectWithLabel) => ({
      ...provided,
      color: 'var(--select-multi-value-remove-text)',

      ':hover': {
        backgroundColor: color ? color : 'var(--select-multi-value-remove-hover-bg)',
        color: 'var(--select-multi-value-remove-hover-text)',
      },
    }),
  };
};

export const getMultiSelectTheme = (theme: Theme, colorActive?: string, color?: string, pressColor?: string) => {
  return {
    ...theme,
    borderRadius: 'var(--border-radius)',
    colors: {
      ...theme.colors,
      primary25: colorActive ? colorActive : 'var(--color-primary)',
      primary: color ? color : 'var(--color-primary-strong)',
      primary50: pressColor ? pressColor : 'var(--color-press-effect)',
    },
  } as any;
};

export const getMultiselectBorderLabelStyles = (isFocused?: boolean, colorActive?: string) => {
  return {
    color: isFocused ? `var(${colorActive || '--color-label-active'})` : `var(--color-text)`,
    transition: 'all 200ms ease-in-out',
    opacity: '1',
    top: '0',
    fontSize: '12px',
    lineHeight: '12px',
    padding: '0 5px',
  };
};
