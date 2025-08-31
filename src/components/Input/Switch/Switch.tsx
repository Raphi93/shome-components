import React from "react";
import "./Switch.css";

export type SwitchSize = "sm" | "md" | "lg";

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  size?: SwitchSize;
  disabled?: boolean;
  label?: React.ReactNode;
  labelPosition?: "left" | "right";
  id?: string;
  name?: string;
  className?: string;
}

export function Switch({
  checked,
  onChange,
  size = "md",
  disabled = false,
  label,
  labelPosition = "right",
  id,
  name,
  className,
}: SwitchProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    onChange(e.target.checked);
  };

  return (
    <label
      className={[
        "switch",
        `switch--${size}`,
        disabled ? "is-disabled" : "",
        className ?? "",
      ].join(" ")}
      data-size={size}
    >
      {label && labelPosition === "left" && (
        <span className="switch__text">{label}</span>
      )}

      <input
        id={id}
        name={name}
        type="checkbox"
        className="switch__input"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        role="switch"
        aria-checked={checked}
      />

      <span className="switch__track" aria-hidden="true">
        <span className="switch__thumb" />
      </span>

      {label && labelPosition === "right" && (
        <span className="switch__text">{label}</span>
      )}
    </label>
  );
}
