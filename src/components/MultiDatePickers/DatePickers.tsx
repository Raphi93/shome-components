"use client";

import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { BaseDatePicker, TDatePickerProps } from './BaseDatePicker';
import {
  dateFormatsByLangCode,
  dateFormatToSave,
  dateTimeFormatsByLangCode,
  dateTimeFormatToSave,
  timeFormatsByLangCode,
  timeFormatToSave,
} from './date-helpers';
import React from 'react';

export const LangDatePicker = (props: TDatePickerProps) => {
  const dateAllowedFormat = /^\d{4}-\d{2}-\d{2}$/;
  const [hasError, setHasError] = useState(false);
  const { t } = useTranslation();

  return (
    <BaseDatePicker
      {...props}
      dateAllowedFormatRegex={dateAllowedFormat}
      dateFormatToSave={dateFormatToSave}
      formatsByLangCode={dateFormatsByLangCode}
      setErrorStatus={setHasError}
      errorText={hasError ? t('Invalid date') : props.errorText}
    />
  );
};

export const LangDateTimePicker = (props: TDatePickerProps) => {
  const dateAllowedFormat = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/;

  const pickersProps = useMemo(() => {
    const timeSelectProps = { showTimeSelect: true };

    if (props.pickersProps) {
      return { ...timeSelectProps, ...props.pickersProps };
    }

    return timeSelectProps;
  }, [props.pickersProps]);

  return (
    <BaseDatePicker
      {...props}
      pickersProps={pickersProps}
      dateAllowedFormatRegex={dateAllowedFormat}
      dateFormatToSave={dateTimeFormatToSave}
      formatsByLangCode={dateTimeFormatsByLangCode}
    />
  );
};

export const LangTimePicker = (props: TDatePickerProps) => {
  const dateAllowedFormat = /^\d{2}:\d{2}$/;

  const pickersProps = useMemo(() => {
    const timeSelectProps = { showTimeSelect: true, showTimeSelectOnly: true };

    if (props.pickersProps) {
      return { ...timeSelectProps, ...props.pickersProps };
    }

    return timeSelectProps;
  }, [props.pickersProps]);

  return (
    <BaseDatePicker
      {...props}
      pickersProps={pickersProps}
      dateAllowedFormatRegex={dateAllowedFormat}
      dateFormatToSave={timeFormatToSave}
      formatsByLangCode={timeFormatsByLangCode}
    />
  );
};