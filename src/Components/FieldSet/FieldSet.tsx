'use client';

import React, { useState } from 'react';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';

import s from './FieldSet.module.scss';
import type { ColumnSize, FieldSetProps, FieldSetColumnProps } from './FieldSet.types';

// Re-export all public types and the sizeMapper from the types file.
export type {
  ColumnSize,
  FieldSetHeaderColor,
  FieldSetTitleTag,
  sizeType,
  FieldSetProps,
  FieldSetColumnProps,
} from './FieldSet.types';
export { sizeMapper } from './FieldSet.types';

// ─── Column size → CSS class map ─────────────────────────────────────────────
// Explicit map avoids runtime string manipulation and makes all valid
// sizes visible to tree-shaking and CSS module analysis.

const sizeClassMap: Record<ColumnSize, string> = {
  '10':    s['size-10'],
  '12':    s['size-12'],
  '12.5':  s['size-12-5'],
  '15':    s['size-15'],
  '16':    s['size-16'],
  '20':    s['size-20'],
  '25':    s['size-25'],
  '30':    s['size-30'],
  '33':    s['size-33'],
  '40':    s['size-40'],
  '50':    s['size-50'],
  '60':    s['size-60'],
  '66':    s['size-66'],
  '70':    s['size-70'],
  '75':    s['size-75'],
  '80':    s['size-80'],
  '90':    s['size-90'],
  '100':   s['size-100'],
};

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
 *   <FieldSetColumn size="50">...</FieldSetColumn>
 *   <FieldSetColumn size="50">...</FieldSetColumn>
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
  defaultOpen = true,
  colorBackground = false,
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
        border           && s.border,
        shadow           && s.shadow,
        colorBackground  && s['color-background'],
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
 * <FieldSetColumn size="33">left third</FieldSetColumn>
 * <FieldSetColumn size="66">right two-thirds</FieldSetColumn>
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
      className={clsx(s.column, sizeClassMap[size], className)}
      // --fsc-min-width prevents the column from collapsing below this threshold
      style={mw ? ({ '--fsc-min-width': mw } as React.CSSProperties) : undefined}
    >
      {children}
    </div>
  );
}
