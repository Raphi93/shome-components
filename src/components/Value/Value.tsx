'use client';

import { JSX, ReactNode } from 'react';
import { faCheckSquare, faSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { ActionWrapper } from '../Actions/ActionElement';
import { FieldWrapper, FieldSetCommonFields } from '../FieldWrapper/FieldWrapper';
import { useDateFormat } from '../../hooks/dateFormat';

/**
 * Read only - value, missing 'size option'
 */
export type ValueType = 'dateTime' | 'boolean' | 'date' | 'time' | 'text';

export function Value({
  label,
  isRequired,
  description,
  id,
  value,
  link,
  hideEmpty,
  valueType,
  children,
  isWrapped = true,
}: {
  id?: string;
  value?: number | string | boolean;
  link?: string | JSX.Element;
  hideEmpty?: boolean;
  valueType?: ValueType;
  readOnly?: boolean;
  children?: ReactNode;
  isWrapped?: boolean;
} & FieldSetCommonFields) {
  const formatDate = useDateFormat();

  /**
   * checkbox for readonly mode without wrapper
   */
  function ValueCheckbox({ checked }: { checked?: boolean }) {
    return <FontAwesomeIcon icon={checked ? faCheckSquare : faSquare} />;
  }

  if (hideEmpty && !value && value !== false) {
    return null;
  }

  if (value && typeof value === 'string') {
    if (valueType === 'dateTime') {
      value = formatDate.formatDateTime(value);
    }
    if (valueType === 'date') {
      value = formatDate.formatDate(value);
    }
    if (valueType === 'time') {
      value = formatDate.formatTime(value);
    }
  }

  let valueComponent = <>{value}</>;

  if (valueType === 'boolean' || typeof value === 'boolean') {
    const classes = [];
    if (value) {
      classes.push('color-positive');
    } else {
      classes.push('color-gray-500');
    }

    valueComponent = (
      <span className={classes.join(' ')}>
        <ValueCheckbox checked={Boolean(value)} />
      </span>
    );
  }

  if (link) {
    // check if link is instance of Link component (from react-router-dom)
    // if yes, render it directly
    if (typeof link === 'object') {
      valueComponent = link;
    } else {
      valueComponent = (
        <ActionWrapper link={link} isExternalLink={true}>
          {valueComponent}
        </ActionWrapper>
      );
    }
  }

  if (isWrapped) {
    return (
      <FieldWrapper label={label} description={description} isRequired={isRequired} labelFor={id} readOnly={true}>
        {valueComponent}
        {children}
      </FieldWrapper>
    );
  }

  return valueComponent;
}
