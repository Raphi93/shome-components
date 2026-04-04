import { ChangeEventHandler, useCallback, useEffect, useState } from 'react';
import { debounce } from 'lodash';

interface UseDebouncedInputProps {
  onChange?: ChangeEventHandler<HTMLInputElement>;
  withDebounce?: boolean;
  debounceDelay?: number;
  value?: string | number;
  defaultValue?: string | number;
}

export function useDebouncedInput({
  onChange,
  withDebounce,
  debounceDelay,
  value,
  defaultValue,
}: UseDebouncedInputProps) {
  const [internalValue, setInternalValue] = useState(value ?? defaultValue ?? '');

  const debouncedOnChange = useCallback(
    debounce((newValue: string) => {
      if (onChange) {
        onChange({ target: { value: newValue } } as any);
      }
    }, debounceDelay),
    [onChange, debounceDelay]
  );

  const handleChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      const newValue = e.target.value;
      setInternalValue(newValue);
      if (withDebounce) {
        debouncedOnChange(newValue);
      } else if (onChange) {
        onChange(e);
      }
    },
    [debouncedOnChange, onChange, withDebounce]
  );

  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  useEffect(() => {
    return () => {
      debouncedOnChange.cancel();
    };
  }, [debouncedOnChange]);

  return {
    internalValue,
    handleChange,
  };
}
