import { useEffect, useId, useRef } from "react";

import './Choice.css'

export type CheckboxProps = {
  label: React.ReactNode;
  checked: boolean;
  onChange: (v: boolean) => void;
  indeterminate?: boolean;
  disabled?: boolean;
  name?: string;
  value?: string;
  required?: boolean;
  secondary?: boolean;
  description?: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
};

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  onChange,
  indeterminate = false,
  disabled = false,
  name,
  value,
  required,
  secondary = false,
  description,
  className,
  size = "md", 
}) => {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <label
      className={[
        "choice",
        "choice--checkbox",
        `choice--${size}`, 
        secondary ? "choice--secondary" : "",
        disabled ? "is-disabled" : "",
        className ?? "",
      ].join(" ")}
      data-indeterminate={indeterminate ? "true" : undefined}
      htmlFor={id}
    >
      <input
        ref={inputRef}
        id={id}
        className="choice__input"
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        name={name}
        value={value}
        required={required}
      />
      <span className="choice__text">
        <span className="choice__label">{label}</span>
        {description && <span className="choice__desc">{description}</span>}
      </span>
    </label>
  );
};
