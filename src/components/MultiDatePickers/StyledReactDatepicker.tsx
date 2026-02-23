import { CSSProperties, FC, useRef } from 'react';
import ReactDatePicker, { DatePickerProps as ReactDatePickerProps } from 'react-datepicker';
import clx from 'classnames';
import { parseISO } from 'date-fns';

import ErrorText from '../ErrorText/ErrorText';
import {
  BorderInputLabel,
  DirtyIconWithBorderLabel,
  TLabelInputWithDirtyState,
} from '../FieldWrapper/hooks/useLabelInput';
import { Icon, Icons } from '../Icon/Icon';

import style from '../FieldWrapper/FieldWrapper.module.scss';

export type TStyledReactDatepicker = ReactDatePickerProps & {
  id?: string;
  min?: string;
  max?: string;
  cssClass?: string;
  styles?: CSSProperties;
  description?: string;
} & TLabelInputWithDirtyState;

export const StyledReactDatepicker: FC<TStyledReactDatepicker> = (props) => {
  const datepickerRef = useRef<ReactDatePicker | null>(null);

  const {
    label,
    isRequired = false,
    id,
    min = '1900-01-01',
    max,
    disabled = false,
    errorText,
    cssClass,
    styles,
    isDirty,
    dirtyText,
    onClearDirty,
    description,
  } = props;

  const handleIconClick = () => {
    if (!disabled && datepickerRef.current) {
      datepickerRef.current.setOpen(true);
    }
  };

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
      <ReactDatePicker
        ref={datepickerRef}
        portalId="root-portal"
        minDate={min ? parseISO(min) : undefined}
        maxDate={max ? parseISO(max) : undefined}
        className={clx(style.input, style.borderLabelInput)}
        {...props}
      />

      {description && <div className={style['field-description']}>{description}</div>}

      <BorderInputLabel label={label} isRequired={isRequired} id={id} className={style.staticBorderLabel} />

      {isDirty && (
        <DirtyIconWithBorderLabel onClearDirty={onClearDirty} dirtyText={dirtyText} className={style.dateDirtyIcon} />
      )}

      <Icon onClick={handleIconClick} icon={Icons.Calendar} className={style.calendarIcon} />
      <ErrorText errorMessage={errorText} />
    </div>
  );
};
