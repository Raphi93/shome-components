import React, { CSSProperties, ReactNode, useEffect, useRef, useState } from 'react';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faChevronDown, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import { Tooltip, TooltipContent, TooltipTrigger } from '../Tooltip';

import './Button.css';

export type ButtonColor =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'light';

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
  color?: ButtonColor;
  isLightColor?: boolean;
  IconClassName?: string | null;
  expander?: boolean;
  expanderValue?: boolean;
  link?: string | null;
  target?: '_self' | '_blank';
  isSelect?: boolean;
  isSelectColor?: ButtonColor;
  border?: boolean;
  isLoading?: boolean | null;
  loadingTimeoutMs?: number;
  children?: React.ReactNode | null;
}

const ensureCssLength = (value: string) => {
  const units = ['px', 'em', 'rem', '%', 'vh', 'vw', 'auto'];
  return units.some((u) => value.endsWith(u)) ? value : `${value}px`;
};

/**
 * A versatile button component that supports various configurations including icons, tooltips, loading states, and different rendering modes.
 * 
 * @param icon - Primary FontAwesome icon to display
 * @param onClick - Click handler function that can be async
 * @param tooltip - Tooltip text to display on hover
 * @param icon2 - Secondary FontAwesome icon to overlay on the primary icon
 * @param icon2Styles - Custom styles for the secondary icon
 * @param text - Text content to display in the button
 * @param width - Button width, defaults to 'auto'
 * @param height - Button height, defaults to '40px'
 * @param fontSize - Font size for icons and text, defaults to '1rem'
 * @param disabled - Whether the button is disabled, defaults to false
 * @param color - Color theme for the button, defaults to 'primary'
 * @param IconClassName - Additional CSS class for the primary icon
 * @param isLightColor - Whether to use the light variant of the color theme
 * @param expander - Whether to show an expandable chevron icon
 * @param expanderValue - Controls the animation state of the expander icon
 * @param link - URL to navigate to when clicked (renders as anchor element)
 * @param target - Link target attribute, defaults to '_self'
 * @param isSelect - Whether the button is in a selected state
 * @param isLoading - Whether to show loading spinner and disable interaction
 * @param loadingTimeoutMs - Duration in milliseconds for the loading state, defaults to 1500
 * @param children - Custom content to render instead of default button content
 * @param props - Additional HTML attributes passed to the underlying element
 * 
 * @returns A button element that can render as button, anchor, or div based on props
 */
export function Button({
  icon = null,
  onClick,
  tooltip = null,
  icon2 = null,
  icon2Styles,
  text = null,
  width = 'auto',
  height = '40px',
  fontSize = '1rem',
  disabled = false,
  color = 'primary',
  IconClassName = null,
  isLightColor = false,
  expander = false,
  expanderValue = false,
  link = null,
  target = '_self',
  isSelect = false,
  border = false,
  isLoading = null,
  loadingTimeoutMs = 1500,
  children = null,
  ...props
}: ButtonProps) {
  const firstIconStyle = { fontSize };
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
    if (isTrue){
      setIsLoadings(true);
      setDisabledButton(true);
    } else if (isLoading === false){
      setIsLoadings(false);
      setDisabledButton(disabled);
    }
  }, [isLoading]);

  const buttonStyle = {
    width: ensureCssLength(width),
    height: ensureCssLength(height),
    ...props.style,
  };

  const colorClass = isLightColor ? `${color}-light` : color;

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
        <FontAwesomeIcon icon={icon} style={firstIconStyle} className={IconClassName || ''} />
        {icon2 && (
          <FontAwesomeIcon
            icon={icon2}
            style={icon2StyleMerged}
            className={icon2StyleMerged === undefined ? 'icon-two' : ''}
          />
        )}
      </div>
    );

  const renderLoading = () => <FontAwesomeIcon icon={faSpinner} style={firstIconStyle} spin />;

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
    className: clsx('action-button', colorClass, props.className),
    style: { ...buttonStyle, ...props.style },
  };

  const innerRaw = children ?? renderContent();


  let inner = innerRaw;

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

