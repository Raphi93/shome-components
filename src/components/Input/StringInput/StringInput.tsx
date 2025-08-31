// StringInput.tsx
import React, { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import './StringInput.css';

export interface StringInputProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    noBorder?: boolean;
    defaultValue?: string;
    type?: string;
    iconLeft?: IconProp;
    password?: boolean;
    email?: boolean;
    required?: boolean;
    disabled?: boolean;
}

export const StringInput: React.FC<StringInputProps> = ({
    label,
    value,
    onChange,
    noBorder = false,
    defaultValue = '',
    type = 'text',
    iconLeft,
    password = false,
    email = false,
    required = false,
    disabled = false,
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);

    const paddingLeft = iconLeft ? '2.5rem' : 'var(--spacing-md)';
    const paddingRight = password ? '2.5rem' : 'var(--spacing-md)';
    const marginLeft = iconLeft ? '2rem' : '';

    const inputType =
        password ? (passwordVisible ? 'text' : 'password') : email ? 'email' : type;

    const emailInvalid = useMemo(() => {
        if (disabled) return false;
        if (!email) return false;
        if (!isFocused) return false;
        const v = value.trim();
        if (v === '') return false;
        return !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(v);
    }, [disabled, email, isFocused, value]);

    return (
        <div className={`string-input-container ${noBorder ? 'no-border' : ''} ${disabled ? 'is-disabled' : ''}`}>
            {iconLeft && (
                <span className="icon-left">
                    <FontAwesomeIcon icon={iconLeft} />
                </span>
            )}
            <input
                type={inputType}
                inputMode={email ? 'email' : undefined}
                autoComplete={email ? 'email' : undefined}
                autoCorrect={email ? 'off' : undefined}
                autoCapitalize={email ? 'none' : undefined}
                spellCheck={email ? false : undefined}
                required={required}
                disabled={disabled}
                value={value}
                defaultValue={defaultValue}
                onChange={(e) => onChange(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(value !== '' || defaultValue !== '')}
                placeholder=" "
                className={`string-input${emailInvalid ? ' invalid' : ''}`}
                style={{ paddingLeft, paddingRight }}
                aria-label={label}
                aria-invalid={emailInvalid || undefined}
                aria-disabled={disabled || undefined}
            />
            <label
                className={`${iconLeft ? 'string-input-label-icon-left' : 'string-input-label'} ${isFocused || value ? 'active' : ''}`}
                style={{ marginLeft }}
            >
                {label}
            </label>
            {password && (
                <span
                    className="icon-right"
                    onClick={() => !disabled && setPasswordVisible(!passwordVisible)}
                >
                    <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} />
                </span>
            )}
        </div>
    );
};
