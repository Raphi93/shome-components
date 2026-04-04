import React from 'react';

// ─── Enumerations ────────────────────────────────────────────────────────────

/**
 * Background color variant for the FieldSet header.
 * - `'default'`          — subtle gray surface with border
 * - `'primary'`          — brand dark background, white text
 * - `'secondary'`        — brand accent background, white text
 * - `'color-background'` — themed dashboard gradient, adapts to active CSS theme + dark mode
 */
export type FieldSetHeaderColor = 'default' | 'primary' | 'secondary' | 'color-background';

/** HTML heading tag used to render the FieldSet title. */
export type FieldSetTitleTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

// ─── Column sizes ─────────────────────────────────────────────────────────────

/**
 * Valid percentage widths for a FieldSetColumn — passed as a string.
 *
 * @example
 * <FieldSetColumn size="50">half width</FieldSetColumn>
 * <FieldSetColumn size="12.5">one eighth</FieldSetColumn>
 */
export type ColumnSize =
  | '10' | '12' | '12.5' | '15' | '16'
  | '20' | '25' | '30'   | '33' | '40'
  | '50' | '60' | '66'   | '70' | '75'
  | '80' | '90' | '100';

/** @deprecated Use ColumnSize. Kept for backward compatibility. */
export type sizeType = ColumnSize;

/**
 * Named aliases for the most common column sizes.
 *
 * @example
 * import { sizeMapper } from '@raphi93/shome-components';
 * <FieldSetColumn size={sizeMapper.l} />   // → "50"
 * <FieldSetColumn size={sizeMapper.xl} />  // → "66"
 */
export const sizeMapper: Record<string, ColumnSize> = {
  xxs:    '10',
  '12':   '12',
  '12.5': '12.5',
  '15':   '15',
  '16':   '16',
  xs:     '20',
  s:      '25',
  '30':   '30',
  m:      '33',
  '40':   '40',
  l:      '50',
  '60':   '60',
  xl:     '66',
  '70':   '70',
  xxl:    '75',
  '80':   '80',
  '90':   '90',
  xxxl:  '100',
};

// ─── Component prop types ─────────────────────────────────────────────────────

export type FieldSetProps = {
  /** Text displayed in the header bar. Omit to render no header. */
  title?: string;

  /**
   * HTML tag used to render the title. Controls semantic heading level.
   * Visual size is controlled separately via `titleSize`.
   * @default 'h2'
   */
  titleAs?: FieldSetTitleTag;

  /**
   * Font size of the title. Accepts a CSS string or a number (→ px).
   * @example titleSize="1.25rem"  titleSize={18}
   * @default '1rem'
   */
  titleSize?: number | string;

  /**
   * Font weight of the title. Accepts a CSS string or a number.
   * @example titleWeight={400}  titleWeight="bold"
   * @default 700
   */
  titleWeight?: number | string;

  children: React.ReactNode;

  /** Extra content rendered on the right side of the header (e.g. action buttons). */
  headerChildren?: React.ReactNode;

  /** Additional class applied to the `<header>` element. */
  headerClassName?: string;

  /** Additional class applied to the root `<fieldset>` element. */
  className?: string;

  /** Additional class applied to the inner content wrapper. */
  contentClassName?: string;

  /** Disables all form elements inside the fieldset via the native `disabled` attribute. */
  disabled?: boolean;

  /**
   * Wraps the fieldset in a card with an inset border.
   * When combined with `shadow`, both styles are applied.
   */
  border?: boolean;

  /**
   * Wraps the fieldset in a card with a drop shadow (no border).
   * Can be combined with `border`.
   */
  shadow?: boolean;

  /**
   * Header background color variant.
   * @default 'default'
   */
  headerColor?: FieldSetHeaderColor;

  /** Adds a chevron toggle to the header, making the content collapsible. */
  isExpandable?: boolean;

  /**
   * Whether the content is open on first render. Only relevant when `isExpandable` is true.
   * @default true
   */
  defaultOpen?: boolean;
  /**
   * Apply the themed surface/dashboard background colour without adding a border or shadow.
   * Useful for transparent layout wrappers that still need a subtle background tint.
   * @default false
   */
  colorBackground?: boolean;
};

export type FieldSetColumnProps = {
  /**
   * Column width as a percentage of the parent row.
   * Pass as a string: `size="50"`, `size="33"`, `size="12.5"`.
   * Stacks to 100% on viewports ≤ 767px.
   */
  size: ColumnSize;

  /**
   * Minimum width before the column is forced to full-width.
   * Accepts a number (→ px) or any valid CSS width string.
   */
  minWidth?: number | string;

  children: React.ReactNode;

  /** Additional class applied to the column wrapper. */
  className?: string;
};
