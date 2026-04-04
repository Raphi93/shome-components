'use client';

import React, { useState } from 'react';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';

import s from './FieldSet.module.scss';
import type { FieldSetProps, FieldSetColumnProps } from './FieldSet.types';

// Re-export all public types and the sizeMapper from the types file.
export type {
  FieldSetHeaderColor,
  FieldSetTitleTag,
  sizeType,
  FieldSetProps,
  FieldSetColumnProps,
} from './FieldSet.types';
export { sizeMapper } from './FieldSet.types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Maps a sizeType number to a valid CSS module class name (12.5 → "size-12-5"). */
function sizeClass(size: number): string {
  return `size-${String(size).replace('.', '-')}`;
}

// ─── FieldSet ─────────────────────────────────────────────────────────────────

/**
 * Container component that groups related form fields or content.
 *
 * - Without `border` or `shadow`: transparent layout wrapper (no visual card).
 * - With `border`: card with inset outline.
 * - With `shadow`: card with drop shadow.
 * - With `isExpandable`: content is collapsible via a chevron in the header.
 *
 * @example
 * <FieldSet title="Contact" border>
 *   <FieldSetColumn size={50}>...</FieldSetColumn>
 *   <FieldSetColumn size={50}>...</FieldSetColumn>
 * </FieldSet>
 */
export function FieldSet({
  title,
  titleAs: Title = 'h2',
  titleSize,
  titleWeight,
  children,
  headerChildren,
  headerClassName,
  className,
  contentClassName,
  disabled,
  border       = false,
  shadow       = false,
  headerColor  = 'default',
  isExpandable = false,
  defaultOpen  = true,
}: FieldSetProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const hasHeader = !!title || !!headerChildren;
  const isCard    = border || shadow;
  const toggle    = () => setIsOpen((prev) => !prev);

  const content = (
    <div className={clsx(s.content, contentClassName)}>
      {children}
    </div>
  );

  return (
    <fieldset
      className={clsx(
        s.fieldset,
        border && s.border,
        shadow && s.shadow,
        // card without header: skip the top-padding gap normally reserved for header
        isCard && !hasHeader && s['no-header'],
        className,
      )}
      disabled={disabled}
    >
      {hasHeader && (
        <header
          className={clsx(
            s.header,
            s[`header-${headerColor}`],
            isExpandable && s.clickable,
            // hook class for app-level branding overrides
            'branding-fieldset-header',
            headerClassName,
          )}
          style={{
            // inject title style as CSS custom properties so SCSS can consume them
            ...(titleSize   && { '--fs-title-size':   typeof titleSize   === 'number' ? `${titleSize}px`   : titleSize   }),
            ...(titleWeight && { '--fs-title-weight':  typeof titleWeight === 'number' ? String(titleWeight) : titleWeight }),
          } as React.CSSProperties}
          onClick={isExpandable ? toggle : undefined}
        >
          {title && <Title className={s.title}>{title}</Title>}

          {headerChildren && (
            <div className={s['header-children']}>{headerChildren}</div>
          )}

          {isExpandable && (
            <FontAwesomeIcon
              icon={faChevronDown}
              className={clsx(s['expand-icon'], isOpen && s.open)}
              // stopPropagation so clicking the icon doesn't also fire the header onClick
              onClick={(e) => { e.stopPropagation(); toggle(); }}
            />
          )}
        </header>
      )}

      {isExpandable ? (
        <div className={clsx(s['expandable-content'], isOpen ? s.open : s.closed)}>
          {content}
        </div>
      ) : content}
    </fieldset>
  );
}

// ─── FieldSetColumn ───────────────────────────────────────────────────────────

/**
 * Flex column to be used as a direct child of `FieldSet`.
 * Stacks to full width on viewports ≤ 767px.
 *
 * @example
 * <FieldSetColumn size={33}>left third</FieldSetColumn>
 * <FieldSetColumn size={66}>right two-thirds</FieldSetColumn>
 */
export function FieldSetColumn({
  size,
  minWidth,
  children,
  className,
}: FieldSetColumnProps) {
  const mw = typeof minWidth === 'number' ? `${minWidth}px` : minWidth;

  return (
    <div
      className={clsx(s.column, s[sizeClass(size)], className)}
      // --fsc-min-width prevents the column from collapsing below this threshold
      style={mw ? ({ '--fsc-min-width': mw } as React.CSSProperties) : undefined}
    >
      {children}
    </div>
  );
}
