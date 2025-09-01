import { useId } from "react";

import './Choice.css'

export type RadioProps = {
  label: React.ReactNode;
  checked: boolean;
  onChange: () => void;
  name: string;
  value: string;
  disabled?: boolean;
  required?: boolean;
  secondary?: boolean;
  description?: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";      
};

export const Radio: React.FC<RadioProps> = ({
  label,
  checked,
  onChange,
  name,
  value,
  disabled = false,
  required,
  secondary = false,
  description,
  className,
  size = "md", 
}) => {
  const id = useId();

  return (
    <label
      className={[
        "choice",
        "choice--radio",
        `choice--${size}`,   
        secondary ? "choice--secondary" : "",
        disabled ? "is-disabled" : "",
        className ?? "",
      ].join(" ")}
      htmlFor={id}
    >
      <input
        id={id}
        className="choice__input"
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        required={required}
      />
      <span className="choice__text">
        <span className="choice__label">{label}</span>
        {description && <span className="choice__desc">{description}</span>}
      </span>
    </label>
  );
};
