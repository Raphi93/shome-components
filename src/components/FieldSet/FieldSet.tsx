"use client";

import React, { useMemo } from "react";
import { ReactNode, useLayoutEffect, useRef } from "react";

import style from "./FieldSet.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";


export type FieldSetProps = {
  border?: boolean;
  heading?: string;
  children?: ReactNode;
  headerChildren?: ReactNode;
  headerColor?: "default" | "primary" | "secondary";
  className?: string;
  isExpandable?: boolean;
  isClosedByDefault?: boolean;
};

export function FieldSet({
  border,
  heading,
  children,
  headerChildren,
  headerColor = "default",
  className,
  isExpandable,
  isClosedByDefault = false,
}: FieldSetProps) {
  const [expanded, setExpanded] = React.useState(isClosedByDefault);
  const stateClass = expanded && isExpandable ? style.expandedField : isExpandable && !expanded ? style.collapsedField : "";
  const classes = [style.fieldset, stateClass];
  if (border && heading) classes.push(style.border);
  if (border && !heading) classes.push(style.borderNoHeader);
  if (className) classes.push(className);

  return (
    <fieldset className={classes.join(" ")}>
      {(heading) && (
        <header
          className={`${style.header} ${headerColor ? style[`header-${headerColor}`] : ""}`}
          onClick={(e) => {
            isExpandable && 
            e.stopPropagation();
            setExpanded(!expanded);
          }}
        >
          {heading && <div className={style.heading}>{heading}</div>}
          {headerChildren}
          {isExpandable && (
            <FontAwesomeIcon
              icon={faChevronDown}
              className={`${style.expandIcon} ${expanded ? style.expanded : style.collapsed}`}
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
            />
          )}
        </header>
      )}
      {isExpandable ? (
        <div className={`${style.expandableContent} ${expanded ? style.expanded : style.collapsed}`}>
          {children}
        </div>
      ) : (
        <>
          {children}
        </>
      )}
    </fieldset>
  );
}

/**
 * PdcFieldSetReadonly
 *
 * React functional component that renders a read-only fieldset with an optional
 * heading and header children. It measures the widths of label elements inside
 * the read-only fieldset and normalizes their widths for medium/large viewports
 * to keep labels aligned.
 *
 * Behavior/side effects:
 * - Uses a useRef<HTMLFieldSetElement> to reference the rendered <fieldset>.
 * - In a useLayoutEffect (runs after render on every commit), it queries the
 *   fieldset for all label elements matching the selector ".read-only .field-label".
 * - If the viewport width is greater than 575px and there is more than one label,
 *   it computes the maximum label offsetWidth and sets every label's inline
 *   style.width to (maxWidth + 4)px to align labels. Otherwise it removes the
 *   inline style attribute from each label.
 * - Builds the fieldset's className from internal styles (style.fieldset,
 *   style.readonly), optionally style.border when `border` is true, and any
 *   provided `className`.
 *
 * @param border - When true, include the border style on the fieldset.
 * @param heading - Optional heading content. When provided, a <header> element
 *                  is rendered containing the heading and any headerChildren.
 * @param children - Content rendered inside the fieldset (read-only content).
 * @param headerChildren - Additional nodes to render inside the header alongside
 *                         the heading.
 * @param headerColor - Variant key for header color styling. Defaults to "default".
 * @param className - Optional additional class name(s) to append to the fieldset.
 *
 * @returns A JSX.Element representing the read-only fieldset.
 *
 * @public
 */
export function FieldSetReadonly({
  border,
  heading,
  children,
  headerChildren,
  headerColor = "default",
  className,
}: FieldSetProps) {
  const fieldSetRef = useRef<HTMLFieldSetElement>(null);

  useLayoutEffect(() => {
    const fieldSetElm = fieldSetRef.current;
    if (!fieldSetElm) return;

    const labels = fieldSetElm.querySelectorAll(
      ".read-only .field-label"
    ) as NodeListOf<HTMLElement>;

    if (window.innerWidth > 575 && labels.length > 1) {
      const maxWidth = Math.max(...Array.from(labels).map((el) => el.offsetWidth));
      labels.forEach((el) => (el.style.width = `${maxWidth + 4}px`));
    } else {
      labels.forEach((el) => el.removeAttribute("style"));
    }
  });

  const classes = [style.fieldset, style.readonly];
  if (border && heading) classes.push(style.border);
  if (border && !heading) classes.push(style.borderNoHeader);
  if (className) classes.push(className);

  return (
    <fieldset className={classes.join(" ")}>
      {(heading) && (
        <header
          className={`${style.header} ${headerColor ? style[`header-${headerColor}`] : ""
            }`}
        >
          {heading && <div className={style.heading}>{heading}</div>}
          {headerChildren}
        </header>
      )}
      {children}
    </fieldset>
  );
}

// wiso geht das nicht es macht nicht row
export function FieldSetColumn({
  children,
  size = "50",
}: {
  children?: ReactNode;
  size?: "50" | "70" | "30" | "25" | "75" | "100" | '16' | '20' | '12.5';
}) {
  return (
    <div
      className={`${style.column} ${size === "70"
        ? style["column-70"]
        : size === "30"
          ? style["column-30"]
          : size === "25"
            ? style["column-25"]
            : size === "75"
              ? style["column-75"]
              : size === "100"
                ? style["column-100"]
                : size === "16"
                  ? style["column-16"]
                  : size === "20"
                    ? style["column-20"]
                    : size === "12.5"
                      ? style["column-12-5"]
                      : ""
        }`}
    >
      {children}
    </div>
  );
}