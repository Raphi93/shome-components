import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useId,
  HTMLAttributes,
} from "react";
import "./Select.css";

export type SelectOption = {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
};

export type SelectValue = string | string[] | null;

export interface SelectProps {
  options: SelectOption[];
  value: SelectValue;
  onChange: (val: SelectValue) => void;

  multiple?: boolean;
  placeholder?: string;
  disabled?: boolean;
  clearable?: boolean;
  searchable?: boolean;
  maxDropdownHeight?: number;

  name?: string;
  className?: string;
  secondary?: boolean;

  searchInputProps?: Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "value" | "onChange"
  >;

  hiddenInputProps?: Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "type" | "value"
  >;

  rootProps?: HTMLAttributes<HTMLDivElement>;
  controlProps?: HTMLAttributes<HTMLDivElement>;
  menuProps?: HTMLAttributes<HTMLDivElement>;
}

function textOfNode(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOfNode).join(" ");
  if (node && typeof node === "object" && "props" in (node as any)) {
    return textOfNode((node as any).props?.children);
  }
  return "";
}

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,

  multiple = false,
  placeholder = "Auswählen…",
  disabled = false,
  clearable = true,
  searchable = true,
  maxDropdownHeight = 280,

  name,
  className,
  secondary = false,

  searchInputProps,
  hiddenInputProps,
  rootProps,
  controlProps,
  menuProps,
}) => {
  const id = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [focusIdx, setFocusIdx] = useState(0);

  const selectedValues: string[] = useMemo(() => {
    if (multiple) return Array.isArray(value) ? value : [];
    return typeof value === "string" ? [value] : [];
  }, [value, multiple]);

  const isSelected = (v: string) => selectedValues.includes(v);

  const hasQuery = searchable && query.trim().length > 0;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => {
      const label = textOfNode(o.label).toLowerCase();
      return label.includes(q) || o.value.toLowerCase().includes(q);
    });
  }, [options, query]);

  const visibleOptions = filtered.filter((o) => !o.disabled);

  const openMenu = () => {
    if (disabled) return;
    setOpen(true);
    if (searchable) setTimeout(() => inputRef.current?.focus(), 0);
  };

  const closeMenu = () => {
    setOpen(false);
    setQuery("");
    setFocusIdx(0);
  };

  const toggleMenu = () => (open ? closeMenu() : openMenu());

  const setSelected = (vals: string[]) => {
    onChange(multiple ? vals : vals[0] ?? null);
  };

  const toggleOption = (opt: SelectOption) => {
    if (opt.disabled) return;

    if (multiple) {
      const set = new Set(selectedValues);
      set.has(opt.value) ? set.delete(opt.value) : set.add(opt.value);
      setSelected(Array.from(set));
      setQuery("");
      requestAnimationFrame(() => inputRef.current?.focus());
    } else {
      setSelected([opt.value]);
      setQuery("");
      closeMenu();
    }
  };

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (rootRef.current.contains(e.target as Node)) return;
      closeMenu();
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => {
    if (!open || !listRef.current) return;
    const item = listRef.current.querySelector<HTMLElement>(
      `[data-index="${focusIdx}"]`
    );
    item?.scrollIntoView({ block: "nearest" });
  }, [focusIdx, open]);

  const displayLabel = useMemo(() => {
    if (multiple) return "";
    const opt = options.find((o) => o.value === selectedValues[0]);
    return opt ? opt.label : "";
  }, [multiple, options, selectedValues]);

  const onControlMouseDown: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const t = e.target as HTMLElement;
    if (
      t.closest("input") ||
      t.closest(".select__clear") ||
      t.closest(".select__tag-remove")
    ) {
      return;
    }
    e.preventDefault(); // verhindert Blur
    toggleMenu();
  };

  const onInputKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (disabled) return;
    const max = visibleOptions.length - 1;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!open) openMenu();
        setFocusIdx((v) => Math.min(max, v + 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        if (!open) openMenu();
        setFocusIdx((v) => Math.max(0, v - 1));
        break;
      case "Home":
        if (open) {
          e.preventDefault();
          setFocusIdx(0);
        }
        break;
      case "End":
        if (open) {
          e.preventDefault();
          setFocusIdx(max);
        }
        break;
      case "Enter":
        if (open && visibleOptions[focusIdx]) {
          e.preventDefault();
          toggleOption(visibleOptions[focusIdx]);
        }
        break;
      case "Escape":
        if (open) {
          e.preventDefault();
          closeMenu();
        }
        break;
      case "Backspace":
        if (multiple && !query && selectedValues.length && !open) {
          const copy = selectedValues.slice(0, -1);
          setSelected(copy);
        }
        break;
      default:
        if (!open) openMenu(); // Tippen öffnet
    }
  };

  return (
    <div
      {...rootProps}
      ref={rootRef}
      className={[
        "select",
        searchable ? "is-searchable" : "no-search",
        multiple ? "is-multiple" : "",
        open ? "is-open" : "",
        hasQuery ? "has-query" : "",
        disabled ? "is-disabled" : "",
        secondary ? "select--secondary" : "",
        className ?? "",
        rootProps?.className ?? "",
        "notranslate",
      ].join(" ")}
      translate="no"
      data-no-translate=""
    >
      {/* Hidden Inputs fürs Form-Posting */}
      {name && !multiple && typeof selectedValues[0] === "string" && (
        <input
          type="hidden"
          name={name}
          value={selectedValues[0] ?? ""}
          translate="no"
          data-no-translate=""
          className={[
            "select__hidden notranslate",
            hiddenInputProps?.className ?? "",
          ].join(" ")}
          {...hiddenInputProps}
        />
      )}
      {name &&
        multiple &&
        selectedValues.map((v, i) => (
          <input
            key={`${name}-${v}-${i}`}
            type="hidden"
            name={name}
            value={v}
            translate="no"
            data-no-translate=""
            className={[
              "select__hidden notranslate",
              hiddenInputProps?.className ?? "",
            ].join(" ")}
            {...hiddenInputProps}
          />
        ))}

      <div
        {...controlProps}
        className={["select__control", controlProps?.className ?? ""].join(" ")}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-menu`}
        onMouseDown={(e) => {
          controlProps?.onMouseDown?.(e);
          onControlMouseDown(e);
        }}
      >
        <div className="select__value" onClick={() => !open && openMenu()}>
          {!open && selectedValues.length === 0 && (
            <span className="select__placeholder">{placeholder}</span>
          )}

          {!multiple &&
            selectedValues.length > 0 &&
            (!hasQuery || !open) && (
              <span className="select__single" translate="no" data-no-translate="">
                {displayLabel}
              </span>
            )}

          {multiple && selectedValues.length > 0 && (
            <div className="select__tags">
              {selectedValues.map((v) => {
                const opt = options.find((o) => o.value === v);
                return (
                  <span
                    key={v}
                    className="select__tag"
                    translate="no"
                    data-no-translate=""
                  >
                    <span className="select__tag-label">
                      {opt ? opt.label : v}
                    </span>
                    <button
                      type="button"
                      className="select__tag-remove"
                      aria-label="Entfernen"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelected(selectedValues.filter((x) => x !== v));
                        if (searchable) inputRef.current?.focus();
                      }}
                    >
                      ×
                    </button>
                  </span>
                );
              })}
            </div>
          )}

          {searchable && (
            <input
              ref={inputRef}
              className={[
                "select__input",
                "notranslate",
                searchInputProps?.className ?? "",
              ].join(" ")}
              translate="no"
              data-no-translate=""
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setFocusIdx(0);
              }}
              onKeyDown={onInputKeyDown}
              onFocus={() => openMenu()}
              onBlur={() => setQuery("")}
              placeholder={open ? searchInputProps?.placeholder ?? "Suchen…" : ""}
              readOnly={!searchable}
              autoComplete={searchInputProps?.autoComplete ?? "off"}
              autoCorrect={searchInputProps?.autoCorrect ?? "off"}
              autoCapitalize={searchInputProps?.autoCapitalize ?? "none"}
              spellCheck={searchInputProps?.spellCheck ?? false}
              inputMode={searchInputProps?.inputMode ?? "search"}
              {...searchInputProps}
            />
          )}
        </div>

        <div className="select__actions" onClick={(e) => e.stopPropagation()}>
          {clearable && !disabled && selectedValues.length > 0 && (
            <button
              type="button"
              className="select__clear"
              aria-label="Auswahl löschen"
              onClick={() => setSelected([])}
            >
              ×
            </button>
          )}
          <span className="select__arrow" aria-hidden="true" />
        </div>
      </div>

      {open && (
        <div
          {...menuProps}
          id={`${id}-menu`}
          role="listbox"
          aria-multiselectable={multiple || undefined}
          className={["select__menu", menuProps?.className ?? ""].join(" ")}
          translate="no"
          data-no-translate=""
        >
          <ul
            className="select__list"
            ref={listRef}
            style={{ maxHeight: maxDropdownHeight }}
          >
            {filtered.length === 0 && (
              <li className="select__empty">Keine Treffer</li>
            )}
            {filtered.map((opt) => {
              const visibleIndex = visibleOptions.findIndex(
                (o) => o.value === opt.value
              );
              const focused = visibleIndex === focusIdx && !opt.disabled;

              return (
                <li
                  key={opt.value}
                  role="option"
                  aria-selected={isSelected(opt.value)}
                  data-index={visibleIndex}
                  className={[
                    "select__option",
                    isSelected(opt.value) ? "is-selected" : "",
                    focused ? "is-focused" : "",
                    opt.disabled ? "is-disabled" : "",
                  ].join(" ")}
                  onClick={() => toggleOption(opt)}
                  onMouseEnter={() => {
                    if (!opt.disabled && visibleIndex >= 0)
                      setFocusIdx(visibleIndex);
                  }}
                >
                  <span className="select__check" aria-hidden="true">
                    {isSelected(opt.value) ? "✓" : ""}
                  </span>
                  <span className="select__label" translate="no" data-no-translate="">
                    {opt.label}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};
