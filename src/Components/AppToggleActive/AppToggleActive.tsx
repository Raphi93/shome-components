'use client';

import { ChangeEventHandler, ReactNode } from 'react';
import clx from 'classnames';

import style from './Toggle.module.scss';
import React from 'react';
import { DirtyIconWithBorderLabel, TLabelInputWithDirtyState } from '../FieldWrapper/hooks/useLabelInput';
import { FieldSetCommonFields, FieldWrapper } from '../FieldWrapper';
import { ErrorText } from '../ErrorText';
import { UseFormRegister } from '../../types';


/**
 * AppToggleActive
 *
 * A toggle (checkbox) UI component representing an "active" / "disabled" state with optional
 * inline active/disabled labels, border-style label support, integration with react-hook-form,
 * and optional FieldWrapper usage for form layouts.
 *
 * Behavior notes:
 * - If `register` and `id` are provided, the input will be registered via react-hook-form
 *   with `{ required: isRequired, onChange }`.
 * - If both `activeText` and `disabledText` are provided, both text labels are rendered next
 *   to the toggle; otherwise a compact "no-text" style is used.
 * - When `hasBorderLabel` is true, the `label` is rendered inside the toggle as a border label
 *   and error text rendering differs (error shown below the toggle if `hasBorderLabel` or when
 *   `isWrapped` is false).
 * - When `isWrapped` is true and `hasBorderLabel` is false, the toggle is wrapped in a
 *   FieldWrapper that provides `label`, `description`, required indicator, dirty-handling props,
 *   and shows `errorText`. Otherwise the component returns the toggle markup directly.
 *
 * @param props - Component props (destructured)
 * @param props.label - Visible field label (also used as the border label when `hasBorderLabel`).
 * @param props.description - Optional description text shown by the FieldWrapper when wrapped.
 * @param props.activeText - Text to show for the active/on state (must be used together with `disabledText` to render).
 * @param props.disabledText - Text to show for the disabled/off state (must be used together with `activeText` to render).
 * @param props.textOnLeft - If true, positions the state text on the left side of the toggle. Default: false.
 * @param props.id - Input id attribute; required for react-hook-form registration and for label association.
 * @param props.isRequired - Marks the field as required for validation and will be passed to register.
 * @param props.disabled - Disables the input when true. Default: false.
 * @param props.isWrapped - When true (default) the toggle will be rendered inside a FieldWrapper (unless `hasBorderLabel` is true).
 * @param props.defaultValue - Uncontrolled default checked state (mapped to input.defaultChecked).
 * @param props.value - Controlled checked state (mapped to input.checked).
 * @param props.secondary - Applies an alternative visual style when true. Default: false.
 * @param props.register - react-hook-form register function (UseFormRegister) used to register the input when provided.
 * @param props.onChange - onChange event handler for the input; also forwarded to register when available.
 * @param props.errorText - Error message to display below the control or via the wrapper.
 * @param props.hasBorderLabel - When true, renders `label` as an inline border label inside the toggle.
 * @param props.onClearDirty - Callback invoked to clear the dirty state indicator.
 * @param props.dirtyText - Text shown by the dirty-state indicator control.
 * @param props.isDirty - If true, shows the dirty indicator UI next to the toggle (when applicable).
 * @param props.cssClass - Optional extra CSS class applied to the outer wrapper element.
 *
 * @returns JSX.Element - The rendered toggle element (wrapped in FieldWrapper when applicable).
 */
export function AppToggleActive({
  label,
  brandedColor,
  small,
  description,
  activeText,
  disabledText,
  textOnLeft = false,
  id,
  isRequired,
  disabled = false,
  isWrapped = true,
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
  brandedColor?: boolean;
  small?: boolean;
  activeText?: string;
  disabledText?: string;
  textOnLeft?: boolean;
  id?: string;
  disabled?: boolean;
  isWrapped?: boolean;
  value?: boolean;
  secondary?: boolean;
  register?: UseFormRegister;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  hasBorderLabel?: boolean;
} & TLabelInputWithDirtyState &
  FieldSetCommonFields) {
  
  const registered =
    register && id
      ? register(id, {
        required: isRequired,
        onChange: (e) => {
          if (onChange) onChange(e);
        },
      })
      : {};

  const classes = clx(
    style['toggle-wrapper'],
    style['toggle-active'],
    secondary && style.secondary,
    textOnLeft && style['text-left'],
    small && style['small'],
    brandedColor && style['branded-color'],
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
          id={id}
          type="checkbox"
          checked={!!value}
          disabled={disabled}
          onChange={onChange}
          {...registered}
        />

        <div className={style.inner}>
          {hasBorderLabel && (
            <span className={style.borderLabel}>
              <span>{label}</span>
            </span>
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
