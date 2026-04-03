import { ControlProps, CSSObjectWithLabel, Theme } from 'react-select';

import type { TSelectOption } from './Select.type';

export const getMultiSelectStyles = (color?: string, colorActive?: string) => {
  return {
    menu: (provided: CSSObjectWithLabel) => ({ ...provided, zIndex: 100 }),
    control: (provided: CSSObjectWithLabel, state: ControlProps<TSelectOption>) => ({
      ...provided,
      cursor: 'pointer',
      backgroundColor: state.isDisabled ? 'var(--color-gray-200)' : provided.backgroundColor,
      boxShadow: state.isFocused ? '0 0 0 2px var(--input-focus-outline-color)' : provided.borderColor,
      borderColor: state.isFocused ? 'var(--color-primary-dark)' : 'var(--color-gray-400)',
      paddingTop: '1px',
      paddingBottom: '1px',
    }),
    multiValue: (provided: CSSObjectWithLabel) => ({
      ...provided,
      marginTop: '8px',
      height: '20px',
      backgroundColor: colorActive ? colorActive : 'var(--color-brand)',
    }),
    multiValueLabel: (provided: CSSObjectWithLabel) => ({
      ...provided,
      display: 'flex',
      alignItems: 'center',
      color: 'white',
    }),
    multiValueRemove: (provided: CSSObjectWithLabel) => ({
      ...provided,
      color: 'white',

      ':hover': {
        backgroundColor: color ? color : 'var(--color-primary-dark)',
        color: 'white',
      },
    }),
    option: (provided: CSSObjectWithLabel) => ({
      ...provided,
      cursor: 'pointer',
      minHeight: '40px',
    }),
  };
};

export const getMultiSelectTheme = (theme: Theme, colorActive?: string, color?: string, pressColor?: string) => {
  return {
    ...theme,
    borderRadius: 'var(--border-radius)',
    colors: {
      ...theme.colors,
      primary25: colorActive ? colorActive : 'var(--color-brand)',
      primary: color ? color : 'var(--color-primary-dark)',
      primary50: pressColor ? pressColor : 'var(--color-press-effect)',
    },
  } as any;
};

export const getMultiselectBorderLabelStyles = (isFocused?: boolean, colorActive?: string) => {
  return {
    color: isFocused ? `var(${colorActive || '--color-label-active'})` : `var(--color-gray-400)`,
    transition: 'all 200ms ease-in-out',
    opacity: '1',
    top: '0',
    fontSize: '12px',
    lineHeight: '12px',
    padding: '0 5px',
  };
};
