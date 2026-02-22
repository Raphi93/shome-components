import { ChangeEvent, ReactNode, useCallback, useRef, useState } from 'react';
import clx from 'classnames';
import { debounce } from 'lodash';

import { Button } from '../Button/Button';
import ErrorText from '../ErrorText/ErrorText';
import { BorderInputLabel } from '../FieldWrapper/hooks/useLabelInput';
import { Icon, Icons } from '../Icon/Icon';

import style from './SearchBox.module.scss';
import { useFocus } from '../../hooks/useFocus';
import { ActionButton } from '../Button';

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
  /**
   * Search query
   */
  value?: string;
  /**
   * Search query changed event
   */
  valueChanged?: (value: string) => void;
  /**
   * Placeholder that can be used for Searchbox.
   */
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

      if (stringValue.length >= minLengthToSearch) {
        debouncedValueChanged(stringValue);
        return;
      }
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
          {isClearIconShown && <Icon onClick={handleClear} className={style.close} icon={Icons.Close} />}
        </div>

        {!hasLeftIcon ? (
          <ActionButton className={style.searchButton} icon={Icons.Search} />
        ) : (
          <Icon icon={Icons.Search} className={style.searchIcon} />
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
  /**
   * Search query changed event
   */
  title?: string;
  /**
   * List of options that can be used for help
   */
  children: ReactNode;
}) {
  const [helpOpened, setHelpOpened] = useState(false);
  return (
    <div className={style.message}>
      <h3 className={`${helpOpened ? style['js-open'] : ''} `} onClick={() => setHelpOpened(!helpOpened)}>
        {title}
      </h3>
      <div className={`${helpOpened ? style['js-open'] : ''} `}>{children}</div>
    </div>
  );
}

export function SearchTextBoxWithHelp({
  compact,
  children,
}: {
  /**
   * Compact variant of SearchBox with help
   */
  compact?: boolean;
  /**
   * List of options that can be used for help
   */
  children: ReactNode;
}) {
  return (
    <div className={`${style['searchBox-withHelp']} ${compact ? style['searchBox-compact'] : ''}`}>{children}</div>
  );
}
