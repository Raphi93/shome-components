'use client';

import { CSSProperties, FocusEvent, FocusEventHandler, useCallback, useEffect, useMemo, useState } from 'react';
import { DatePickerProps } from 'react-datepicker';
import clx from 'classnames';
import { format, isValid, parse, parseISO } from 'date-fns';

import { TLabelInputWithDirtyState } from '../FieldWrapper/hooks/useLabelInput';

import { DatePickerLanguages, dateTimePickerLanguageByCode, timeFormatToSave } from './date-helpers';
import { StyledReactDatepicker } from './StyledReactDatepicker';

import 'react-datepicker/dist/react-datepicker.css';
import style from '../FieldWrapper/FieldWrapper.module.scss';

export type TBaseDatePickerProps = {
  dateAllowedFormatRegex: RegExp;
  dateFormatToSave: string;
  formatsByLangCode: Record<DatePickerLanguages, string>;
} & TDatePickerProps;

export type TDatePickerProps = {
  id?: string;
  value?: string;
  min?: string;
  max?: string;
  disabled?: boolean;
  onChange?: (dateString: string | null) => void;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  cssClass?: string;
  styles?: CSSProperties;
  languageCode?: DatePickerLanguages;
  placeholder?: string;
  description?: string;
  pickersProps?: Partial<DatePickerProps>;
  setValueOnCalendarClose?: (value: string | null) => void;
} & TLabelInputWithDirtyState;

export const BaseDatePicker = ({
  label,
  isRequired = false,
  id,
  value,
  min = '1900-01-01',
  max,
  disabled = false,
  onChange,
  onBlur,
  errorText,
  cssClass,
  styles,
  isDirty,
  dirtyText,
  onClearDirty,
  languageCode = 'E',
  placeholder,
  dateAllowedFormatRegex,
  formatsByLangCode,
  dateFormatToSave,
  pickersProps,
  description,
  setValueOnCalendarClose,
}: TBaseDatePickerProps) => {
  const { datePickerLocale, datePickerFormat, onDateChange, selectedDate } = useDatePickerActions({
    languageCode,
    value,
    dateFormatToSave,
    formatsByLangCode,
  });

  const [renderKey, setRenderKey] = useState(0);
  const [dateResult, setDateResult] = useState<string | null>(value || null);

  const handleDateChange = (date: Date | null) => {
    const stringDate = onDateChange(date);

    const inputValue = stringDate || '';
    const isValidFormat = dateAllowedFormatRegex.test(inputValue);
    const dateStringResult = isValidFormat ? stringDate : "";
    setDateResult(dateStringResult);
    onChange?.(dateStringResult);
  };

  const onDateBlur = (e: FocusEvent<HTMLInputElement>) => {
    setRenderKey((prev) => prev + 1);
    onBlur?.(e);
  };

  const onCalendarClose = () => {
    pickersProps?.onCalendarClose?.();
    setValueOnCalendarClose?.(dateResult);
  };

  return (
    <StyledReactDatepicker
      id={id}
      key={renderKey}
      portalId="root-portal"
      onChange={handleDateChange}
      onBlur={onDateBlur}
      className={clx(style.input, style.borderLabelInput)}
      selected={selectedDate}
      dateFormat={datePickerFormat}
      locale={datePickerLocale}
      onCalendarClose={onCalendarClose}
      placeholderText={placeholder || formatsByLangCode[languageCode]}
      disabled={disabled}
      minDate={min ? parseISO(min) : undefined}
      maxDate={max ? parseISO(max) : undefined}
      label={label}
      isRequired={isRequired}
      description={description}
      errorText={errorText}
      cssClass={cssClass}
      styles={styles}
      isDirty={isDirty}
      dirtyText={dirtyText}
      onClearDirty={onClearDirty}
      {...(pickersProps as any)}
    />
  );
};

type TUseDatePickerActionsProps = {
  languageCode: DatePickerLanguages;
  value?: string;
  dateFormatToSave: string;
  formatsByLangCode: Record<DatePickerLanguages, string>;
};
const useDatePickerActions = ({
  languageCode,
  value,
  dateFormatToSave,
  formatsByLangCode,
}: TUseDatePickerActionsProps) => {
  const [selectedDateString, setSelectedDateString] = useState<string | null>(value || null);

  const onDateChange = useCallback(
    (date: Date | null) => {
      if (!date || !isValid(date)) {
        setSelectedDateString(null);
        return null;
      }

      try {
        const formattedDate = format(date, dateFormatToSave);
        setSelectedDateString(formattedDate);
        return formattedDate;
      } catch {
        setSelectedDateString(null);
        return null;
      }
    },
    [dateFormatToSave]
  );

  useEffect(() => {
    value && setSelectedDateString(value);
  }, [value]);

  const datePickerFormat = formatsByLangCode[languageCode];
  const datePickerLocale = dateTimePickerLanguageByCode[languageCode];

  const selectedDate = useMemo(() => {
    if (!selectedDateString) {
      setSelectedDateString(null);
      return null;
    }
    try {
      let parsedDate: Date;

      if (dateFormatToSave === timeFormatToSave) {
        parsedDate = parse(selectedDateString, timeFormatToSave, new Date());
      } else {
        parsedDate = parseISO(selectedDateString);
      }

      if (!isValid(parsedDate)) {
        setSelectedDateString(null);
        return null;
      }

      return parsedDate;
    } catch {
      setSelectedDateString(null);
      return null;
    }
  }, [dateFormatToSave, selectedDateString]);

  useEffect(() => {
    setSelectedDateString(value || null);
  }, [value]);

  return {
    selectedDate,
    onDateChange,
    datePickerFormat,
    datePickerLocale,
  };
};
