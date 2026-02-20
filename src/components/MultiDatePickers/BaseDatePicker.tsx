"use client";

import { CSSProperties, FocusEvent, FocusEventHandler, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DatePickerProps } from 'react-datepicker';
import clx from 'classnames';
import { format, isValid, parse, parseISO } from 'date-fns';

import { TLabelInputWithDirtyState } from '../FieldWrapper/hooks/useLabelInput';

import { DatePickerLanguages, dateTimePickerLanguageByCode, timeFormatToSave } from './date-helpers';
import { FilterMode, StyledReactDatepicker } from './StyledReactDatepicker';
import style from '../FieldWrapper/FieldWrapper.module.scss';
import React from 'react';

type ParsedFilterValue =
  | { kind: 'empty' }
  | { kind: 'single'; mode: 'eq' | 'gt' | 'lt'; raw: string }
  | { kind: 'between'; from: string; to: string };

function parseFilterValue(value: string | null | undefined): ParsedFilterValue {
  if (value == null || value === '') return { kind: 'empty' };

  if (value.startsWith('>')) return { kind: 'single', mode: 'gt', raw: value.slice(1) };
  if (value.startsWith('<')) return { kind: 'single', mode: 'lt', raw: value.slice(1) };

  if (value.includes('|')) {
    const [from = '', to = ''] = value.split('|');
    return { kind: 'between', from, to };
  }

  return { kind: 'single', mode: 'eq', raw: value };
}

function parseDateOrNull(dateString: string, dateFormatToSave: string) {
  if (!dateString) return null;
  const d = parse(dateString, dateFormatToSave, new Date());
  return isValid(d) ? d : null;
}

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
  filter?: boolean;
  setErrorStatus?: (hasError: boolean) => void;
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
  languageCode = 'D',
  placeholder,
  dateAllowedFormatRegex,
  formatsByLangCode,
  dateFormatToSave,
  pickersProps,
  description,
  setValueOnCalendarClose,
  filter = false,
  setErrorStatus,
}: TBaseDatePickerProps) => {
  const { datePickerLocale, datePickerFormat, onDateChange, selectedDate } = useDatePickerActions({
    languageCode,
    value,
    dateFormatToSave,
    formatsByLangCode,
  });

  const [renderKey, setRenderKey] = useState(0);
  const [dateResult, setDateResult] = useState<string | null>(value || null);
  const [dateResultTo, setDateResultTo] = useState<Date | null>(null);
  const [selectedDateTo, setSelectedDateTo] = useState<Date | null>(null);
  const [filterMode, setFilterMode] = useState<FilterMode>('eq');

  const handleDateChange = (date: Date | null) => {
    if (!date) {
      setDateResult(null);
      setDateResultTo(null);
      setSelectedDateTo(null);
      setErrorStatus?.(isRequired ? true : false);
      onChange?.(null);
      return;
    }

    const stringDate = onDateChange(date);
    if (!stringDate) {
      setErrorStatus?.(isRequired ? true : false);
      onChange?.(null);
      return;
    }

    const isValidFormat = dateAllowedFormatRegex.test(stringDate);
    if (!isValidFormat) {
      setErrorStatus?.(isRequired ? true : false);
      onChange?.(null);
      return;
    }

    setErrorStatus?.(false);
    setDateResult(stringDate);
    setDateResultTo(date);

    if (filter && filterMode === 'between') {
      const to = selectedDateTo ? onDateChange(selectedDateTo) : null;
      onChange?.(to ? `${stringDate}|${to}` : null);
      return;
    }

    const out =
      filter && filterMode === 'gt'
        ? `>${stringDate}`
        : filter && filterMode === 'lt'
          ? `<${stringDate}`
          : stringDate;

    onChange?.(out);
  };

  function handleDateChangeToDate(date: Date | null) {
    setSelectedDateTo(date);

    if (filter && filterMode === 'between' && dateResult) {
      const to = date ? onDateChange(date) : null;
      onChange?.(to ? `${dateResult}|${to}` : null);
      return;
    }

    const stringDate = onDateChange(date);
    const inputValue = stringDate || '';
    const isValidFormat = dateAllowedFormatRegex.test(inputValue);
    const dateStringResult = isValidFormat ? stringDate : null;
    onChange?.(dateStringResult);
  }

  const manualModeRef = useRef(false);

  function emitValueForMode(m: FilterMode, from: string | null, toDate: Date | null) {
    if (!filter) return from;

    if (!from) return null;

    if (m === 'between') {
      const to = toDate ? onDateChange(toDate) : null;
      return to ? `${from}|${to}` : null;
    }

    if (m === 'gt') return `>${from}`;
    if (m === 'lt') return `<${from}`;
    return from; // eq
  }

  const handleSetMode = (m: FilterMode) => {
    manualModeRef.current = true;
    setFilterMode(m);

    const out = emitValueForMode(m, dateResult, selectedDateTo);
    onChange?.(out);
  };

  const onDateBlur = (e: FocusEvent<HTMLInputElement>) => {
    setRenderKey((prev) => prev + 1);
    onBlur?.(e);
  };

  const onCalendarClose = () => {
    pickersProps?.onCalendarClose?.();
    setValueOnCalendarClose?.(dateResult);
  };

  useEffect(() => {
    // Wenn der Mode gerade manuell gesetzt wurde, NICHT sofort wieder aus value rekonstruieren
    if (manualModeRef.current) {
      manualModeRef.current = false;
      return;
    }

    const parsed = parseFilterValue(value);

    if (parsed.kind === 'empty') {
      setDateResult(null);
      setDateResultTo(null);
      setSelectedDateTo(null);
      setFilterMode('eq');
      return;
    }

    if (!filter) {
      const raw = parsed.kind === 'between' ? parsed.from : parsed.raw;
      setFilterMode('eq');
      setDateResult(raw);
      setDateResultTo(parseDateOrNull(raw, dateFormatToSave));
      setSelectedDateTo(null);
      return;
    }

    if (parsed.kind === 'single') {
      setFilterMode(parsed.mode);
      setDateResult(parsed.raw);
      setDateResultTo(parseDateOrNull(parsed.raw, dateFormatToSave));
      setSelectedDateTo(null);
      return;
    }

    setFilterMode('between');
    setDateResult(parsed.from);
    setDateResultTo(parseDateOrNull(parsed.from, dateFormatToSave));
    setSelectedDateTo(parseDateOrNull(parsed.to, dateFormatToSave));
  }, [value, filter, dateFormatToSave]);

  return (
    <StyledReactDatepicker
      id={id}
      key={renderKey}
      portalId="root-portal"
      onChange={handleDateChange}
      onBlur={onDateBlur}
      className={clx(style.input, style.borderLabelInput)}
      selected={dateResultTo || selectedDate}
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
      filter={filter}
      setMode={handleSetMode}
      setToDate={handleDateChangeToDate}
      value={dateResultTo}
      filterModes={filterMode}
      selectedDateTo={selectedDateTo}
      setErrorStatus={setErrorStatus}
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