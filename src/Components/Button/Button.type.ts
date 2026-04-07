import type { CSSProperties, ReactNode } from 'react';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';

export const EnumButtonColor = {
  Primary: 'primary',
  Secondary: 'secondary',
  Success: 'success',
  Danger: 'danger',
  Warning: 'warning',
  Info: 'info',
  Light: 'light',
  Delete: 'delete',
} as const;

export type ButtonColor = typeof EnumButtonColor[keyof typeof EnumButtonColor];

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: IconProp | null;
  onClick?: (e: React.MouseEvent<Element, MouseEvent>) => void;
  tooltip?: ReactNode | null;
  icon2?: IconProp | null;
  icon2Styles?: CSSProperties & Record<`--fa-${string}`, string>;
  text?: string | null;
  width?: string;
  height?: string;
  fontSize?: string;
  disabled?: boolean;
  /**
   * - primary   → Main action / most important button
   * - secondary → Alternative action
   * - success   → Positive actions (confirm, save, complete)
   * - danger    → Destructive actions (delete, remove)
   * - warning   → Risky or cautionary actions
   * - info      → Informational or neutral actions
   * - light     → Minimal / low-emphasis button style
   * - delete    → Destructive actions with transparent background
   *
   * Use `isLightColor` for the softer alpha variant of a color.
   */
  color?: ButtonColor;
  isLightColor?: boolean;
  IconClassName?: string | null;
  expander?: boolean;
  expanderValue?: boolean;
  link?: string | null;
  target?: '_self' | '_blank';
  border?: boolean;
  isLoading?: boolean | null;
  small?: boolean;
  children?: ReactNode | null;
  isSelected?: boolean;
}
