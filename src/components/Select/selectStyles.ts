import type { CSSObjectWithLabel, StylesConfig, Theme } from 'react-select';

import { TSelectOption } from './Select';

// Explicit return type avoids TS7056 when rollup-plugin-dts serializes inferred types.
export const getMultiSelectStyles = (
  color?: string,
  colorActive?: string
): StylesConfig<TSelectOption, boolean> => {
  const height = 'calc(var(--spacing) * 5)';

  const styles: StylesConfig<TSelectOption, boolean> = {
    /* keep portal/menu above overlays */
    menuPortal: (provided: CSSObjectWithLabel) => ({ ...provided, zIndex: 9999 }),
    menu: (provided: CSSObjectWithLabel) => ({
      ...provided,
      zIndex: 9999,
      backgroundColor: 'var(--input-background, var(--color-background))',
      border: '1px solid var(--input-border, var(--color-gray-400))',
      boxShadow: 'var(--shadow-02, 0 10px 30px rgba(0,0,0,0.35))',
      overflow: 'hidden',
    }),

    /* input-like control (same tokens as FieldWrapper/input) */
    control: (provided: CSSObjectWithLabel, state) => ({
      ...provided,
      minHeight: height,
      height,
      borderRadius: 'var(--border-radius)',

      backgroundColor: state.isDisabled
        ? 'var(--color-gray-200)'
        : 'var(--input-background, var(--color-white))',
      color: 'var(--input-color, var(--color-gray-900))',

      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: state.isFocused
        ? 'var(--color-primary-dark)'
        : 'var(--input-border, var(--color-gray-400))',

      boxShadow: state.isFocused ? '0 0 0 2px var(--input-focus-outline-color)' : 'none',

      transition: 'border-color var(--transition-duration-base), box-shadow var(--transition-duration-base)',
      cursor: state.isDisabled ? 'not-allowed' : 'pointer',

      ':hover': {
        borderColor: state.isFocused
          ? 'var(--color-primary-dark)'
          : 'var(--input-border, var(--color-gray-400))',
      },
    }),

    valueContainer: (provided: CSSObjectWithLabel) => ({
      ...provided,
      height,
      padding: '0 calc(var(--spacing) * 1.5)',
    }),

    input: (provided: CSSObjectWithLabel) => ({
      ...provided,
      color: 'var(--input-color, var(--color-gray-900))',
      margin: 0,
      padding: 0,
    }),

    placeholder: (provided: CSSObjectWithLabel) => ({
      ...provided,
      color: 'var(--input-placeholder-color, var(--color-text-light))',
    }),

    singleValue: (provided: CSSObjectWithLabel) => ({
      ...provided,
      color: 'var(--input-color, var(--color-gray-900))',
    }),

    indicatorsContainer: (provided: CSSObjectWithLabel) => ({
      ...provided,
      height,
    }),

    dropdownIndicator: (provided: CSSObjectWithLabel) => ({
      ...provided,
      color: 'var(--input-label-color, var(--color-text-light))',
      ':hover': { color: 'var(--input-color, var(--color-gray-900))' },
    }),

    clearIndicator: (provided: CSSObjectWithLabel) => ({
      ...provided,
      color: 'var(--input-label-color, var(--color-text-light))',
      ':hover': { color: 'var(--input-color, var(--color-gray-900))' },
    }),

    indicatorSeparator: (provided: CSSObjectWithLabel) => ({
      ...provided,
      backgroundColor: 'var(--input-border, var(--color-gray-400))',
      opacity: 0.6,
    }),

    option: (provided: CSSObjectWithLabel, state) => ({
      ...provided,
      cursor: 'pointer',
      minHeight: '40px',
      backgroundColor: state?.isSelected
        ? `var(--color-primary-dark)`
        : state?.isFocused
          ? `rgba(var(--color-brand-rgb, 0, 230, 255), 0.6)`
          : 'transparent',
      color: state?.isSelected
        ? 'var(--color-primary-contrast, #0b0d10)'
        : 'var(--input-color, var(--color-gray-900))',
    }),

    multiValue: (provided: CSSObjectWithLabel) => ({
      ...provided,
      marginTop: '8px',
      height: '20px',
      borderRadius: '8px',
      backgroundColor: colorActive ? colorActive : `rgba(var(--color-brand-rgb, 0, 230, 255), 0.18)`,
    }),

    multiValueLabel: (provided: CSSObjectWithLabel) => ({
      ...provided,
      display: 'flex',
      alignItems: 'center',
      color: 'var(--input-color, var(--color-gray-900))',
    }),

    multiValueRemove: (provided: CSSObjectWithLabel) => ({
      ...provided,
      color: 'var(--input-label-color, var(--color-text-light))',
      ':hover': {
        backgroundColor: color ? color : `rgba(var(--color-brand-rgb, 0, 230, 255), 0.22)`,
        color: 'var(--input-color, var(--color-gray-900))',
      },
    }),
  };

  return styles;
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

export const getMultiselectBorderLabelStyles = () => {
  return {
    transition: 'all 200ms ease-in-out',
    opacity: '1',
    top: '0',
    fontSize: '12px',
    lineHeight: '12px',
    padding: '0 5px',
  } as React.CSSProperties;
};
