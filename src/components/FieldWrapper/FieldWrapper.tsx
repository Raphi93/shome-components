'use client';

import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import clx from 'classnames';
import { faUndo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import ErrorText from '../ErrorText/ErrorText';
import { Tooltip, TooltipContent, TooltipTrigger } from '../Tooltip/Tooltip';

import style from './FieldWrapper.module.scss';

export type FieldSetCommonFields = {
  /**
   *  Label for the input
   */
  label?: string;
  /**
   *  Sets it as required
   */
  isRequired?: boolean;
  /**
   *  Description for the input
   */
  description?: string;
  /**
   *  Sets input to read-only variant
   */
  readOnly?: boolean;

  errorText?: string;
  cssClass?: string;
};

export function FieldWrapper({
  label,
  isRequired,
  children,
  description,
  labelFor,
  readOnly,
  errorText,
  cssClass,
  isDirty,
  onClearDirty,
  dirtyText,
}: FieldSetCommonFields & {
  children?: ReactNode;
  readOnly?: boolean;
  /**
   * ID of the input element inside
   */
  labelFor?: string;
  isDirty?: boolean;
  onClearDirty?: (arg: any) => void;
  dirtyText?: string;
}) {
  let requiredNode: ReactNode = undefined;
  let exampleNode: ReactNode = undefined;
  let dirtyNode: ReactNode = undefined;

  const classes = [style['field-wrapper']];
  const { t } = useTranslation();

  if (isDirty) {
    dirtyNode = (
      <span className={style.dirty}>
        <Tooltip>
          <TooltipTrigger
            className={clx({
              [style.dirtyTrigger]: onClearDirty,
            })}
            onClick={onClearDirty}
          >
            <FontAwesomeIcon className={style.dirtyIcon} icon={faUndo} />
          </TooltipTrigger>
          <TooltipContent>{dirtyText || t('Click to reset input value to initial state')}</TooltipContent>
        </Tooltip>
      </span>
    );
  }

  if (isRequired) {
    requiredNode = (
      <span className={style.required} title={`${t('The value')} ${label} ${t('Is required')}`}>
        &#42;
      </span>
    );
  }
  if (description) {
    exampleNode = <div className={style['field-description']}>{description}</div>;
  }
  if (readOnly) {
    classes.push(style['read-only']);
  }

  return (
    <div className={`${classes.join(' ')} ${cssClass ?? ''}`}>
      <div className={style['field-label']}>
        <label htmlFor={labelFor}>
          {label}
          {requiredNode}
          {dirtyNode}
        </label>
      </div>
      <div className={style['field-content']}>{children}</div>
      <ErrorText errorMessage={errorText} />
      {exampleNode}
    </div>
  );
}
