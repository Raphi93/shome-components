import React, { useId, useLayoutEffect, useRef } from "react";
import "./TextArea.css";

export type TextAreaProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  maxLength?: number;
  noBorder?: boolean;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  autoGrow?: boolean;
  minRows?: number;
  maxRows?: number;
  className?: string;
} & Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "value" | "onChange" | "rows" | "maxLength" | "placeholder" | "disabled"
>;

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  value,
  onChange,
  rows = 4,
  maxLength,
  noBorder = false,
  disabled = false,
  required = false,
  placeholder,
  autoGrow = false,
  minRows,
  maxRows,
  className,
  ...rest
}) => {
  const id = useId();
  const ref = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    if (!autoGrow || !ref.current) return;
    const el = ref.current;
    const resize = () => {
      const s = window.getComputedStyle(el);
      const lh = parseFloat(s.lineHeight || "20") || 20;
      const pad = el.offsetHeight - el.clientHeight;
      const minPx = (minRows ?? rows) * lh + pad;
      const maxPx = typeof maxRows === "number" ? maxRows * lh + pad : Infinity;
      el.style.height = "auto";
      const next = Math.min(Math.max(el.scrollHeight, minPx), maxPx);
      el.style.height = `${next}px`;
    };
    resize();
    const h = () => resize();
    el.addEventListener("input", h);
    return () => el.removeEventListener("input", h);
  }, [autoGrow, rows, minRows, maxRows, value]);

  const style = {
    ["--ta-rows" as any]: String(rows),
  } as React.CSSProperties & Record<string, string>;

  return (
    <div
      className={[
        "string-input-container",
        "string-textarea-container",
        noBorder ? "no-border" : "",
        disabled ? "is-disabled" : "",
        className ?? "",
      ].join(" ")}
      style={style}
    >
      <textarea
        ref={ref}
        id={id}
        className={[
          "string-input",
          "string-textarea",
          autoGrow ? "string-textarea--autogrow" : "",
        ].join(" ")}
        placeholder={" "}
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        maxLength={maxLength}
        disabled={disabled}
        required={required}
        {...rest}
        title={placeholder}
      />

      <label className="string-input-label" htmlFor={id}>
        {label}
      </label>

      {typeof maxLength === "number" && (
        <span className="string-textarea-counter" aria-live="polite">
          {value.length}/{maxLength}
        </span>
      )}
    </div>
  );
};

export default TextArea;
