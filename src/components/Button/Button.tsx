import React, {
  CSSProperties,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faChevronDown, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip, TooltipContent, TooltipTrigger } from '../Tooltip/Tooltip';
import clsx from 'clsx';

import './Button.css';

/** Color palette variants supported by the button. */
export type ButtonColor =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'light';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: IconProp | null;
  onClick?: (e: React.MouseEvent<Element, MouseEvent>) => void;
  tooltip?: ReactNode | null;
  icon2?: IconProp | null;
  icon2Styles?: CSSProperties & Record<`--fa-${string}`, string>;
  /** @deprecated */
  icon2Sytles?: CSSProperties & Record<`--fa-${string}`, string>;
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
  isLoading?: boolean | null;
  loadingTimeoutMs?: number;
  children?: React.ReactNode | null;
}

/** Accept common CSS units; append `px` if unitless. */
const ensureCssLength = (value: string) => {
  const units = ['px', 'em', 'rem', '%', 'vh', 'vw', 'auto'];
  return units.some((u) => value.endsWith(u)) ? value : `${value}px`;
};

function Button({
  icon = null,
  onClick,
  tooltip = null,
  icon2 = null,
  icon2Styles,
  icon2Sytles,
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
  isLoading = null,
  loadingTimeoutMs = 1500,
  children = null,
  ...props
}: ButtonProps) {
  const firstIconStyle = { fontSize };
  const refButton = useRef<HTMLButtonElement>(null);
  const expanderRef = useRef<HTMLDivElement>(null);
  const [disabledButton, setDisabledButton] = useState(disabled);
  const [isLoadings, setIsLoadings] = useState(false);

  const icon2StyleMerged =
    (icon2Styles as React.CSSProperties & Record<`--fa-${string}`, string>) ??
    (icon2Sytles as React.CSSProperties & Record<`--fa-${string}`, string>) ??
    undefined;

  useEffect(() => {
    setDisabledButton(disabled);
  }, [disabled]);

  const buttonStyle = {
    width: ensureCssLength(width),
    height: ensureCssLength(height),
  };

  const colorClass = isLightColor ? `${color}-light` : color;

  const handleClick = async (e: React.MouseEvent<Element, MouseEvent>): Promise<void> => {
    refButton.current?.blur();

    if (isLoading) {
      setDisabledButton(true);
      setIsLoadings(true);
    }

    if (onClick) {
      await onClick(e);
    }

    if (isLoading) {
      setTimeout(() => {
        setDisabledButton(disabled);
        setIsLoadings(false);
      }, loadingTimeoutMs);
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
    className: clsx(props.className, 'action-button', colorClass),
    style: buttonStyle,
  };

  const inner = children ?? renderContent();

  const buttonEl = !link ? (
    <button
      {...commonProps}
      onClick={handleClick}
      disabled={disabledButton}
      id="actionButton"
      ref={refButton}
      {...props}
    >
      {inner}
    </button>
  ) : (
    <a
      {...commonProps}
      id="actionButton"
      href={link}
      target={target}
      rel={target === '_blank' ? 'noopener noreferrer' : undefined}
    >
      {inner}
    </a>
  );

  return tooltip ? (
    <Tooltip>
      <TooltipTrigger className="no-padding">{buttonEl}</TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  ) : (
    buttonEl
  );
}

export default Button;
