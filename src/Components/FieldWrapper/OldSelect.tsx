"use client";
import { ChangeEventHandler, CSSProperties, MouseEventHandler, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import clx from 'classnames';


import { BorderInputLabel, DirtyIconWithBorderLabel, TLabelInputWithDirtyState } from './hooks/useLabelInput';
import { FieldSetCommonFields, FieldWrapper } from './FieldWrapper';

import style from './FieldWrapper.module.scss';
import React from 'react';
import { UseFormRegister } from '../../types';
import ErrorText from '../ErrorText/ErrorText';

type OldSelectProps = {
  defaultValue?: string;
  value?: string;
  dropBoxOptions?: { name: string; value: string; disabled?: boolean }[];
  id?: string;
  disabled?: boolean;
  isWrapped?: boolean;
  register?: UseFormRegister;
  onChange?: ChangeEventHandler<HTMLSelectElement>;
  onClick?: MouseEventHandler<HTMLSelectElement>;
  children?: ReactNode;
  isLoading?: boolean;
  cssClass?: string;
  styles?: CSSProperties;
  hasBorderLabel?: boolean;
} & TLabelInputWithDirtyState &
  FieldSetCommonFields;

export function OldSelect(props: OldSelectProps) {
  const {
    label,
    description,
    isRequired,
    defaultValue,
    value,
    dropBoxOptions,
    id,
    disabled,
    isWrapped = true,
    register,
    onChange,
    onClick,
    children,
    errorText,
    isLoading,
    cssClass,
    styles,
    isDirty,
    dirtyText,
    onClearDirty,
    hasBorderLabel,
  } = props;

  const { t } = useTranslation();

  const registered = register && id ? register(id, { required: isRequired, onChange }) : {};

  const select = (
    <>
      <div className={clx(style['select-wrap'], { [style.borderLabelInputWrapper]: hasBorderLabel })}>
        <select
          onChange={onChange}
          onClick={onClick}
          {...registered}
          className={clx(style.select, { [style.borderLabelInput]: hasBorderLabel })}
          id={id}
          disabled={disabled}
          defaultValue={defaultValue || '-100'}
          value={value}
          required={isRequired}
          style={styles}
        >
          <option key={'-1'} value="-100" disabled style={{ display: 'none' }}>
            {t('Select')}
          </option>
          {dropBoxOptions?.map((option, i) => (
            <option key={i} value={option.value} disabled={option.disabled}>
              {option.name}
            </option>
          ))}
        </select>
        {hasBorderLabel && (
          <>
            <BorderInputLabel label={label} isRequired={isRequired} id={id} className={style.staticBorderLabel} />

            {isDirty && (
              <DirtyIconWithBorderLabel
                onClearDirty={onClearDirty}
                dirtyText={dirtyText}
                className={clx({
                  [style.dirtyIconWithOtherIcon]: hasBorderLabel,
                })}
              />
            )}
          </>
        )}

        <span className={style.arrow}></span>
      </div>
      {hasBorderLabel && <ErrorText errorMessage={errorText} />}
    </>
  );

  if (isLoading) {
    return <SelectLoading {...props} />;
  }

  if (isWrapped && !hasBorderLabel) {
    return (
      <FieldWrapper
        errorText={errorText}
        label={label}
        description={description}
        isRequired={isRequired}
        labelFor={id}
        cssClass={cssClass}
        isDirty={isDirty}
        onClearDirty={onClearDirty}
        dirtyText={dirtyText}
      >
        {select}
        {children}
      </FieldWrapper>
    );
  }

  return select;
}

export function SelectLoading(props: OldSelectProps) {
  const { t } = useTranslation();

  return (
    <OldSelect
      {...props}
      value={'-3'}
      isLoading={false}
      dropBoxOptions={[{ name: t('Loading...'), value: '-3' }]}
      disabled={true}
    />
  );
}
