import React, { type CSSProperties, type ReactNode, useEffect, useRef, useState } from 'react';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faChevronDown, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';

import { Tooltip, TooltipContent, TooltipTrigger } from '..';

import './PdcButton.scss';


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
  /*
   * Defines the visual color variant of the button.
   *
   * - primary   → Main action or most important button
   * - secondary → Alternative action
   * - success   → Positive actions (confirm, save, complete)
   * - danger    → Destructive actions (delete, remove)
   * - warning   → Risky or cautionary actions
   * - info      → Informational or neutral actions
   * - light     → Minimal / low-emphasis button style
   * - delete    → Destructive actions (delete, remove)
   *
   * If `isLightColor` is enabled, a softer "light" version of the selected
   * color variant will be used.
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
  children?: React.ReactNode | null;
  isSelected?: boolean;
}

const ensureCssLength = (value: string) => {
  const units = [
    'px',
    'em',
    'rem',
    '%',
    'vh',
    'vw',
    'auto',
    'fit-content',
    'min-content',
    'max-content',
  ];

  const v = String(value ?? '').trim();
  if (!v) return v;

  if (/(calc|clamp|min|max)\(/i.test(v)) return v;

  return units.some(u => v.endsWith(u)) ? v : `${v}px`;
};

/**
 * A versatile button component that supports multiple rendering modes (button, anchor, or div),
 * optional icons, loading states, tooltips, and expandable content.
 *
 * @component
 * @example
 * // Basic button
 * <Button text="Click me" onClick={() => console.log('clicked')} />
 *
 * @example
 * // Button with icon and tooltip
 * <Button icon={faHome} text="Home" tooltip="Go to home page" />
 *
 * @example
 * // Loading button
 * <Button text="Submit" isLoading={isSubmitting} onClick={handleSubmit} />
 *
 * @param {ButtonProps} props - The button component props
 * @param {IconDefinition} [props.icon=null] - Primary icon to display
 * @param {(e: React.MouseEvent<Element, MouseEvent>) => Promise<void>} [props.onClick] - Click handler
 * @param {string} [props.tooltip=null] - Tooltip text to display on hover
 * @param {IconDefinition} [props.icon2=null] - Secondary icon to display
 * @param {React.CSSProperties & Record<`--fa-${string}`, string>} [props.icon2Styles] - Styles for secondary icon
 * @param {string} [props.text=null] - Button text content
 * @param {string | number} [props.width='auto'] - Button width (scss value)
 * @param {string | number} [props.height] - Button height (scss value)
 * @param {string | number} [props.fontSize] - Button font size (scss value)
 * @param {boolean} [props.disabled=false] - Whether button is disabled
 * @param {string} [props.color='primary'] - Color variant class suffix
 * @param {string} [props.IconClassName=null] - Custom scss class for icon
 * @param {boolean} [props.isLightColor=false] - Whether to use light color variant
 * @param {boolean} [props.expander=false] - Whether to show expandable chevron icon
 * @param {boolean} [props.expanderValue=false] - Expanded state for expander animation
 * @param {string} [props.link=null] - URL to render as anchor tag instead of button
 * @param {string} [props.target='_self'] - Target attribute for anchor tag
 * @param {boolean} [props.border=false] - Whether to add border styling
 * @param {boolean | null} [props.isLoading=null] - Loading state; disables button and shows spinner
 * @param {ReactNode} [props.children=null] - Custom child content (overrides default rendering)
 * @param {boolean} [props.small=false] - Whether to apply small size styling
 *
 * @returns {ReactNode} Rendered button, anchor, or div element with optional tooltip wrapper
 */
export function Button({
  icon = null,
  onClick,
  tooltip = null,
  icon2 = null,
  icon2Styles,
  text = null,

  width = 'auto',
  height,
  fontSize,

  disabled = false,
  color = 'primary',
  IconClassName = null,
  isLightColor = false,
  expander = false,
  expanderValue = false,
  link = null,
  target = '_self',
  border = false,
  isLoading = null,
  children = null,
  small = false,
  isSelected = false,
  ...props
}: ButtonProps) {
  const refButton = useRef<HTMLButtonElement | HTMLDivElement | HTMLAnchorElement>(null);
  const expanderRef = useRef<HTMLDivElement>(null);

  const [disabledButton, setDisabledButton] = useState(disabled);
  const [isLoadings, setIsLoadings] = useState(false);

  const icon2StyleMerged =
    (icon2Styles as React.CSSProperties & Record<`--fa-${string}`, string>) ?? undefined;

  useEffect(() => {
    setDisabledButton(disabled);
  }, [disabled]);

  useEffect(() => {
    const isTrue = isLoading === true;
    if (isTrue) {
      setIsLoadings(true);
      setDisabledButton(true);
    } else if (isLoading === false) {
      setIsLoadings(false);
      setDisabledButton(disabled);
    }
  }, [isLoading, disabled]);

  const buttonStyle: React.CSSProperties = {
    width: ensureCssLength(width),
    ...(height ? { height: ensureCssLength(height) } : null),
    ...(fontSize ? { fontSize: ensureCssLength(fontSize) } : null),
    ...props.style,
  };

  const colorClass = isLightColor ? `pdc-button-${color}-light` : `pdc-button-${color}`;

  const handleClick = async (e: React.MouseEvent<Element, MouseEvent>): Promise<void> => {
    (refButton.current as HTMLElement | null)?.blur();
    if (onClick) {
      await onClick(e);
    }
  };

  useEffect(() => {
    const el = expanderRef.current;
    if (!el) return;
    el.classList.toggle('animate-icon', !!expanderValue);
    el.classList.toggle('animate-icon-back', !expanderValue);
  }, [expanderValue]);

  const renderIcons = () =>
    icon && (
      <div className="icon-container">
        <FontAwesomeIcon icon={icon} className={IconClassName || ''} />
        {icon2 && (
          <FontAwesomeIcon
            icon={icon2}
            style={icon2StyleMerged}
            className={icon2StyleMerged === undefined ? 'icon-two' : ''}
          />
        )}
      </div>
    );

  const renderLoading = () => <FontAwesomeIcon icon={faSpinner} spin />;

  const renderContent = () => (
    <>
      {isLoadings ? renderLoading() : renderIcons()}
      {text && <span className="button-text">{text}</span>}
      {expander && (
        <div ref={expanderRef} className="expander-icon">
          <FontAwesomeIcon className="expander" icon={faChevronDown} />
        </div>
      )}
    </>
  );

  const commonProps = {
    className: clsx('action-button', colorClass, border && 'border', small && 'small', isSelected && 'selected', props.className),
    style: buttonStyle,
  };

  const innerRaw = children ?? renderContent();

  let inner: ReactNode = innerRaw;

  if (Array.isArray(innerRaw)) {
    inner = innerRaw.map((child, index) =>
      React.isValidElement(child)
        ? React.cloneElement(child, { key: child.key ?? `auto-key-${index}` })
        : child
    );
  }

  let buttonEl: ReactNode;

  if (link) {
    const anchorProps = props as React.AnchorHTMLAttributes<HTMLAnchorElement>;
    buttonEl = (
      <a
        {...anchorProps}
        {...commonProps}
        href={link}
        target={target}
        rel={target === '_blank' ? 'noopener noreferrer' : undefined}
      >
        {inner}
      </a>
    );
  } else if (tooltip) {
    const divProps = props as React.HTMLAttributes<HTMLDivElement>;
    buttonEl = (
      <div
        {...divProps}
        {...commonProps}
        onClick={handleClick}
        ref={refButton as React.Ref<HTMLDivElement>}
        role="button"
        tabIndex={0}
      >
        {inner}
      </div>
    );
  } else {
    const buttonProps = props as React.ButtonHTMLAttributes<HTMLButtonElement>;
    buttonEl = (
      <button
        {...buttonProps}
        {...commonProps}
        onClick={handleClick}
        disabled={disabledButton}
        ref={refButton as React.Ref<HTMLButtonElement>}
      >
        {inner}
      </button>
    );
  }

  return tooltip ? (
    <Tooltip>
      <TooltipTrigger className="no-padding">{buttonEl}</TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  ) : (
    buttonEl
  );
}