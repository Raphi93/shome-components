'use client';

import { ChangeEvent, ReactNode, useCallback, useRef, useState } from 'react';
import clx from 'classnames';
import { debounce } from 'lodash';
import { faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import ErrorText from '../ErrorText/ErrorText';
import { BorderInputLabel } from '../FieldWrapper/hooks/useLabelInput';
import { Button } from '../Button';

import style from './SearchBox.module.scss';
import { useFocus } from '../../hooks/useFocus';

export function SearchTextBox({
  value,
  valueChanged,
  placeholder,
  errorText,
  hasBorderLabel,
  searchDelay = 500,
  minLengthToSearch = 3,
  hasLeftIcon = true,
}: {
  value?: string;
  valueChanged?: (value: string) => void;
  placeholder?: string;
  errorText?: string;
  hasBorderLabel?: boolean;
  searchDelay?: number;
  minLengthToSearch?: number;
  hasLeftIcon?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const isFocused = useFocus(inputRef, 150);

  const [query, setQuery] = useState(value ?? '');

  const isClearIconShown = !!query.length && isFocused;
  const [isActiveDuringAnimation, setIsActiveDuringAnimation] = useState(false);

  const debouncedValueChanged = useCallback(
    debounce((newValue) => {
      valueChanged?.(newValue);
    }, searchDelay),
    [valueChanged, searchDelay]
  );

  const handleClear = useCallback(() => {
    setIsActiveDuringAnimation(true);
    setQuery('');
    valueChanged?.('');
    setTimeout(() => {
      inputRef?.current?.focus();
      setIsActiveDuringAnimation(false);
    }, 200);
  }, [valueChanged]);

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const stringValue = e.target.value;
      setQuery(stringValue);

      if (stringValue.length < minLengthToSearch) {
        valueChanged?.('');
        debouncedValueChanged('');
        return;
      }

      debouncedValueChanged(stringValue);
    },
    [debouncedValueChanged, minLengthToSearch, valueChanged]
  );

  return (
    <div className={style.container}>
      <div className={style.searchBox}>
        <div className={style.inputWrapper}>
          <input
            ref={inputRef}
            className={clx({
              [style.active]: hasBorderLabel && query,
              [style.hasLeftIcon]: hasLeftIcon,
            })}
            type="text"
            placeholder={!hasBorderLabel ? placeholder : ''}
            style={
              isActiveDuringAnimation
                ? {
                    outline: 'none',
                    borderColor: 'var(--color-primary-dark)',
                    boxShadow: '0 0 0 2px var(--input-focus-outline-color)',
                  }
                : {}
            }
            value={query}
            onChange={onChange}
          />

          {hasBorderLabel && (
            <BorderInputLabel
              label={placeholder}
              className={clx(style.borderLabel, {
                [style.hasLeftIcon]: hasLeftIcon,
              })}
              styles={
                isActiveDuringAnimation
                  ? {
                      color: 'var(--color-label-active)',
                      opacity: 1,
                      top: 0,
                      fontSize: '12px',
                      padding: '0 5px',
                      left: 'var(--spacing)',
                    }
                  : {}
              }
            />
          )}

          {isClearIconShown && (
            <button type="button" onClick={handleClear} className={style.close}>
              <FontAwesomeIcon icon={faXmark} />
            </button>
          )}
        </div>

        {!hasLeftIcon ? (
          <Button className={style.searchButton} icon={faMagnifyingGlass} color="primary" />
        ) : (
          <span className={style.searchIcon}>
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </span>
        )}
      </div>
      <ErrorText errorMessage={errorText} />
    </div>
  );
}

export function Help({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  const [helpOpened, setHelpOpened] = useState(false);
  return (
    <div className={style.message}>
      <h3
        className={helpOpened ? style['js-open'] : ''}
        onClick={() => setHelpOpened(!helpOpened)}
      >
        {title}
      </h3>
      <div className={helpOpened ? style['js-open'] : ''}>{children}</div>
    </div>
  );
}

export function SearchTextBoxWithHelp({
  compact,
  children,
}: {
  compact?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={`${style['searchBox-withHelp']} ${compact ? style['searchBox-compact'] : ''}`}>
      {children}
    </div>
  );
}
