"use client";

import { CSSProperties, FC, useEffect, useMemo, useRef, useState } from 'react';
import ReactDatePicker, { DatePickerProps as ReactDatePickerProps } from 'react-datepicker';
import { useTranslation } from 'react-i18next';
import { faArrowsLeftRight, faCalendarDays, faEquals, faGreaterThan, faLessThan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clx from 'classnames';
import { parseISO } from 'date-fns';

import ErrorText from '../ErrorText/ErrorText';
import { BorderInputLabel, DirtyIconWithBorderLabel, TLabelInputWithDirtyState } from '../FieldWrapper/hooks/useLabelInput';
import { PdcSelect, TSelectOption } from '../Select';

import style from '../FieldWrapper/FieldWrapper.module.scss';
import React from 'react';

export type FilterMode = 'eq' | 'gt' | 'lt' | 'between';

export type TStyledReactDatepicker = ReactDatePickerProps & {
  id?: string;
  min?: string;
  max?: string;
  cssClass?: string;
  styles?: CSSProperties;
  description?: string;
  filter?: boolean; // default false
  setMode?: (mode: FilterMode) => void;
  setToDate?: (date: Date | null) => void;
  filterModes?: FilterMode;
  selectedDateTo?: Date | null;
  setErrorStatus?: (hasError: boolean) => void;
} & TLabelInputWithDirtyState;

export const StyledReactDatepicker: FC<TStyledReactDatepicker> = (props) => {
  const datepickerRef = useRef<ReactDatePicker | null>(null);
  const datepickerToRef = useRef<ReactDatePicker | null>(null);

  const { t } = useTranslation();

  const {
    label,
    isRequired = false,
    id,
    min = '1990-01-01',
    max,
    disabled = false,
    errorText,
    cssClass,
    styles,
    isDirty,
    dirtyText,
    onClearDirty,
    description,
    filter = false,
    setMode,
    setToDate,
    filterModes,
    selectedDateTo,
    setErrorStatus,
  } = props;

  const [filterMode, setFilterMode] = useState<FilterMode>(filterModes || 'eq');
  const [toDates, setToDates] = useState<Date | null>(selectedDateTo || null);

  useEffect(() => {
    if (!filter) return;
    if (filterModes && filterModes !== filterMode) {
      setFilterMode(filterModes);
      if (filterModes !== 'between') setToDates(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterModes, filter]);

  useEffect(() => {
    setToDates(selectedDateTo ?? null);
  }, [selectedDateTo]);

  const filterOptions: TSelectOption[] = useMemo(
    () => [
      { value: 'eq', label: { icon: faEquals, title: t('Equals') } },
      { value: 'gt', label: { icon: faLessThan, title: t('Less Than') } },
      { value: 'lt', label: { icon: faGreaterThan, title: t('Greater Than') } },
      { value: 'between', label: { icon: faArrowsLeftRight, title: t('Between') } },
    ],
    [t]
  );

  const selectedFilterOption = useMemo(() => {
  return filterOptions.find((o) => o.value === filterMode) ?? filterOptions[0];
}, [filterOptions, filterMode]);

  const handleIconClick = () => {
    if (!disabled && datepickerRef.current) {
      datepickerRef.current.setOpen(true);
    }
  };

  const handleIconClickSecond = () => {
    if (!disabled && datepickerToRef.current) {
      datepickerToRef.current.setOpen(true);
    }
  };

  const chooseMode = (m: FilterMode) => {
    setFilterMode(m);
    setMode?.(m);
    if (m !== 'between') setToDates(null);
  };

  const minDate = min ? parseISO(min) : undefined;
  const maxDate = max ? parseISO(max) : undefined;

  const showBetween = filter && filterMode === 'between';

  return (
    <div
      id={id}
      className={clx(
        style['datetime-wrap'],
        {
          [style['js-disabled']]: disabled,
        },
        style.borderLabelInputWrapper,
        cssClass
      )}
      style={styles}
      data-type="date"
    >
      {/* --- Normal single picker --- */}
      {!showBetween && (
        <ReactDatePicker
          ref={datepickerRef}
          portalId="root-portal"
          minDate={minDate}
          maxDate={maxDate}
          className={clx(style.input, style.borderLabelInput)}
          {...props}
        />
      )}

      {/* --- Between: two pickers NEBENEINANDER --- */}
      {showBetween && (
        <div className={style.betweenRow}>
          {/* FROM */}
          <div className={style.betweenColFirst}>
            <ReactDatePicker
              ref={datepickerRef}
              portalId="root-portal"
              minDate={minDate}
              maxDate={maxDate}
              className={clx(style.input, style.borderLabelInput)}
              {...props}
              placeholderText={props.placeholderText}
            />
            {/* <span className={style.betweenLabelFrom}>{t('DatePicker.From')}</span> */}
            {/* <FontAwesomeIcon icon={faCalendarDays} className={style.calendarIconBetweenFrom} onClick={handleIconClick} /> */}
          </div>

          {/* TO */}
          <div className={style.betweenCol}>
            <ReactDatePicker
              ref={datepickerToRef}
              id={`${id}-to`}
              portalId="root-portal"
              minDate={props.selected ? props.selected : minDate}
              maxDate={maxDate}
              selected={toDates}
              onChange={(d: Date | null) => {
                setToDates(d);
                setToDate?.(d);
              }}
              dateFormat={props.dateFormat}
              placeholderText={props.placeholderText}
              showYearDropdown={props.showYearDropdown}
              showMonthDropdown={props.showMonthDropdown}
              dropdownMode={props.dropdownMode}
              autoComplete={props.dropdownMode}
            />
            {/* <span className={style.betweenLabelTo}>{t('DatePicker.To')}</span> */}
            {/* <FontAwesomeIcon
              icon={faCalendarDays}
              className={style.calendarIconBetweenTo}
              onClick={handleIconClickSecond}
            /> */}
            <BorderInputLabel label={t('DatePicker.To')} isRequired={isRequired} id={`${id}-to`} className={style.staticBorderLabel} />
          </div>
        </div>
      )}

      {description && <div className={style['field-description']}>{description}</div>}

      {filterMode !== 'between' && <BorderInputLabel label={`${label}`} isRequired={isRequired} id={id} className={style.staticBorderLabel} />}
      {filterMode === 'between' && (
        <BorderInputLabel label={`${label} ${t('DatePicker.From')}`} isRequired={isRequired} id={id} className={style.staticBorderLabel} />
      )}

      {isDirty && (
        <DirtyIconWithBorderLabel onClearDirty={onClearDirty} dirtyText={dirtyText} className={style.dateDirtyIcon} />
      )}

      {/* Filter select (rechts oben, absolut) */}
      {filter && (
        <div className={style.filterPicklist}>
          <PdcSelect
            isMulti={false}
            isDisabled={disabled}
            options={filterOptions}
            value={filterMode}
            setSelectedOptions={(opt) => {
              if (!opt) return;
              chooseMode(opt.value as FilterMode);
            }}
            isSearchable={false}
            isClearable={false}
            closeMenuOnSelect
            placeholder=""
            menuPortalTarget={document.body}
          />
        </div>
      )}

      {/* Calendar Icon für Single-Mode */}
      {!showBetween && (
        <FontAwesomeIcon
          icon={faCalendarDays}
          className={filter ? style.filterIcon : style.calendarIcon}
          onClick={handleIconClick}
        />
      )}

      <ErrorText errorMessage={errorText} />
    </div>
  );
};