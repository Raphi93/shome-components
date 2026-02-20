"use client";
import { CSSProperties, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { faUndo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clx from 'classnames';

import ErrorText from '../../ErrorText/ErrorText';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../Tooltip/Tooltip';

import style from '../FieldWrapper.module.scss';
import React from 'react';

type TUseLabelInputProps = {
  isDirty?: boolean;
  onClearDirty?: (arg: any) => void;
  dirtyText?: string;
  input: ReactNode;
  cssClass?: string;
  label?: string;
  id?: string;
  element?: ReactNode;
  dirtyIconCssClass?: string;
  isRequired?: boolean;
  errorText?: string;
  isDisabled?: boolean;
  labelClass?: string;
};

export type TLabelInputWithDirtyState = Omit<TUseLabelInputProps, 'input'>;
export const useLabelInput = ({
  id,
  isDirty,
  onClearDirty,
  dirtyText,
  input,
  cssClass,
  label,
  element,
  dirtyIconCssClass,
  isRequired,
  errorText,
  isDisabled,
  labelClass,
}: TUseLabelInputProps) => {
  const borderLabelInput = (
    <div className={style.fullWidth}>
      <div className={`${style.borderLabelInputWrapper} ${cssClass ?? ''}`}>
        {input}
        <BorderInputLabel
          label={label}
          isRequired={isRequired}
          id={id}
          className={clx(style.borderLabel, labelClass, { [style.disabledBorderLabel]: isDisabled })}
        />
        {element}
        {isDirty && (
          <DirtyIconWithBorderLabel className={dirtyIconCssClass} dirtyText={dirtyText} onClearDirty={onClearDirty} />
        )}
      </div>
      <ErrorText errorMessage={errorText} />
    </div>
  );

  return { borderLabelInput };
};

export const DirtyIconWithBorderLabel = ({
  onClearDirty,
  dirtyText,
  className,
}: {
  onClearDirty?: (arg: any) => void;
  dirtyText?: string;
  className?: string;
}) => {
  const { t } = useTranslation();
  return (
    <span className={clx(style.dirtyInputIcon, className)}>
      <Tooltip>
        <TooltipTrigger
          className={clx({
            [style.dirtyTrigger]: onClearDirty,
          })}
          onClick={onClearDirty}
        >
        <FontAwesomeIcon icon={faUndo} />
        </TooltipTrigger>
        <TooltipContent>{dirtyText || t('Click to reset input value to initial state')}</TooltipContent>
      </Tooltip>
    </span>
  );
};

export const BorderInputLabel = ({
  id,
  label,
  isRequired,
  className,
  styles,
}: {
  id?: string;
  label?: string;
  isRequired?: boolean;
  className?: string;
  styles?: CSSProperties;
}) => {
  const { t } = useTranslation();
  return (
    <label htmlFor={id} className={className} style={styles}>
      {label}
      {isRequired && (
        <span className={style.required} title={`${t('The value')} ${label} ${t('Is required')}`}>
          &#42;
        </span>
      )}
    </label>
  );
};
