import React, { useMemo, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faChevronDown, faChevronUp, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import '../StringInput/StringInput.css';

type NullableNumber = number | null;

export interface NumberInputProps {
    label?: string;
    value: NullableNumber;
    onChange: (value: NullableNumber) => void;
    noBorder?: boolean;
    defaultValue?: number;
    iconLeft?: IconProp;
    step?: number;
    min?: number;
    max?: number;
    decimals?: number;
    showStepper?: boolean;
    preventWheel?: boolean;
    disabled?: boolean;
}

function clamp(n: number, min?: number, max?: number) {
    if (typeof min === 'number' && n < min) return min;
    if (typeof max === 'number' && n > max) return max;
    return n;
}

function roundTo(n: number, decimals?: number) {
    if (typeof decimals !== 'number') return n;
    const f = Math.pow(10, decimals);
    return Math.round(n * f) / f;
}

export const NumberInput: React.FC<NumberInputProps> = ({
    label,
    value,
    onChange,
    noBorder = false,
    defaultValue,
    iconLeft,
    step = 1,
    min,
    max,
    decimals,
    showStepper = true,
    preventWheel = true,
    disabled = false,
}) => {
    const initialString = useMemo(() => {
        if (value == null) return defaultValue?.toString() ?? '';
        return value.toString();
    }, [value, defaultValue]);

    const [text, setText] = useState<string>(initialString);
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        const next = value == null ? '' : value.toString();
        setText(next);
    }, [value]);

    const parse = (raw: string): NullableNumber => {
        if (raw.trim() === '' || raw === '-' || raw === ',' || raw === '.') return null;
        const norm = raw.replace(',', '.');
        const n = Number(norm);
        if (!isFinite(n)) return null;
        return n;
    };

    const commit = (raw: string) => {
        if (disabled) return;
        const parsed = parse(raw);
        if (parsed == null) {
            onChange(null);
            return;
        }
        let n = parsed;
        if (typeof decimals === 'number') n = roundTo(n, decimals);
        n = clamp(n, min, max);
        onChange(n);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (disabled) return;
        const raw = e.target.value;
        if (!/^-?\d*[.,]?\d*$/.test(raw)) return;
        setText(raw);
    };

    const handleBlur = () => {
        setIsFocused(false);
        commit(text);
    };

    const inc = (dir: 1 | -1) => {
        if (disabled) return;
        const base = value ?? 0;
        let next = base + dir * (step || 1);
        if (typeof decimals === 'number') next = roundTo(next, decimals);
        next = clamp(next, min, max);
        onChange(next);
        setText(next.toString());
    };

    const paddingLeft = iconLeft ? '2.5rem' : 'var(--spacing-md)';
    const paddingRight = showStepper ? '2.5rem' : 'var(--spacing-md)';
    const marginLeft = iconLeft ? '2rem' : '';

    return (
        <div className={`string-input-container ${noBorder ? 'no-border' : ''} ${disabled ? 'is-disabled' : ''}`}>
            {iconLeft && (
                <span className="icon-left">
                    <FontAwesomeIcon icon={iconLeft} />
                </span>
            )}
            <input
                type="text"
                inputMode="decimal"
                value={text}
                onChange={handleChange}
                placeholder=" "
                onFocus={() => !disabled && setIsFocused(true)}
                onBlur={handleBlur}
                onWheel={preventWheel && !disabled ? (e) => (e.currentTarget as HTMLInputElement).blur() : undefined}
                className="string-input"
                style={{ paddingLeft, paddingRight }}
                aria-label={label}
                disabled={disabled}
                aria-disabled={disabled || undefined}
            />
            <label
                className={`${iconLeft ? 'string-input-label-icon-left' : 'string-input-label'} ${isFocused || text ? 'active' : ''}`}
                style={{ marginLeft }}
            >
                {label}
            </label>
            {showStepper && (
                <span className="icon-right">
                    <div className="number-stepper">
                        <button type="button" aria-label="Increase" onClick={() => inc(1)} disabled={disabled}>
                            <FontAwesomeIcon icon={faChevronUp} />
                        </button>
                        <button type="button" aria-label="Decrease" onClick={() => inc(-1)} disabled={disabled}>
                            <FontAwesomeIcon icon={faChevronDown} />
                        </button>
                    </div>
                </span>
            )}
        </div>
    );
};
