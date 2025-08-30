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

import styles from './Button.module.scss';

/** Color palette variants supported by the button. */
export type ButtonColor =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'light';

/**
 * Props for {@link ActionButton}.
 *
 * @remarks
 * - Renders a semantic `<button>` by default.
 * - If `link` is provided, renders an `<a>` with identical visuals.
 * - Loading mode (`isLoading`) temporarily disables the button and shows a spinner.
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Primary FontAwesome icon (free or pro). */
  icon?: IconProp | null;

  /** Click handler. Can be async; loading UX remains active until it resolves. */
  onClick?: (e: React.MouseEvent<Element, MouseEvent>) => void;

  /** Tooltip content. When present, the button is wrapped with a tooltip. */
  tooltip?: ReactNode | null;

  /** Optional secondary icon, rendered next to the primary one. */
  icon2?: IconProp | null;

  /**
   * Styles applied to the secondary icon.
   * Supports native CSSProperties and FA custom properties (e.g. `--fa-primary-color`).
   */
  icon2Styles?: CSSProperties & Record<`--fa-${string}`, string>;

  /** @deprecated Typo alias for {@link ActionButtonProps.icon2Styles}. Will be removed in a future version. */
  icon2Sytles?: CSSProperties & Record<`--fa-${string}`, string>;

  /** Text label shown after the icon(s). If `children` is provided, children take precedence. */
  text?: string | null;

  /** Button width (any valid CSS length). Falls back to `px` if unitless. @defaultValue "auto" */
  width?: string;

  /** Button height (any valid CSS length). Falls back to `px` if unitless. @defaultValue "40px" */
  height?: string;

  /** Font size applied to the icons (e.g. "1rem", "14px"). @defaultValue "1rem" */
  fontSize?: string;

  /** Disabled state. @defaultValue false */
  disabled?: boolean;

  /** Visual color theme. @defaultValue "primary" */
  color?: ButtonColor;

  /** Use the “Light” variants of the color theme. @defaultValue false */
  isLightColor?: boolean;

  /** Extra class for the primary icon element. */
  IconClassName?: string | null;

  /**
   * Shows a disclosure/expander chevron on the right.
   * Pair with {@link ActionButtonProps.value} to control its rotation.
   * @defaultValue false
   */
  expander?: boolean;

  /**
   * Controlled state for the expander chevron (true = rotated “open”).
   * Only used when `expander` is true.
   * @defaultValue false
   */
  expanderValue?: boolean;

  /**
   * When set, the button renders an anchor `<a>` with this href.
   * Visuals and behavior remain the same (except native link behavior).
   */
  link?: string | null;

  /** Target for anchor mode. Ignored for `<button>`. @defaultValue "_self" */
  target?: '_self' | '_blank';

  /** Reserved for custom behavior in higher-level components. @defaultValue false */
  isSelect?: boolean;

  /**
   * Enables loading UX and disables the button while the click handler runs.
   * If true, the spinner appears immediately on click.
   * @defaultValue null (off)
   */
  isLoading?: boolean | null;

  /**
   * If `isLoading` is true, defines how long after click the loading state
   * is kept before restoring `disabled` back to its original value.
   * @defaultValue 1500
   */
  loadingTimeoutMs?: number;

  /**
   * Custom content. If provided, replaces the default icon/text/expander layout.
   * Use this to fully control the button interior while keeping styles/behavior.
   */
  children?: React.ReactNode | null;
}

/** Accept common CSS units; append `px` if the value is unitless. */
const ensureCssLength = (value: string) => {
  const units = ['px', 'em', 'rem', '%', 'vh', 'vw', 'auto'];
  return units.some((u) => value.endsWith(u)) ? value : `${value}px`;
};

/**
 * ActionButton – a flexible, accessible button/link component with:
 * - optional FontAwesome icons (primary + secondary),
 * - light/dark color themes,
 * - tooltip wrapping,
 * - async-loading UX with spinner and temporary disable,
 * - optional expander chevron that rotates via `value`.
 *
 * @example Basic
 * ```tsx
 * <ActionButton text="Save" icon={faFloppyDisk} onClick={() => doSave()} />
 * ```
 *
 * @example Link mode
 * ```tsx
 * <ActionButton text="Docs" icon={faBook} link="https://example.com" target="_blank" />
 * ```
 *
 * @example Loading UX (spinner on click)
 * ```tsx
 * <ActionButton
 *   text="Submit"
 *   icon={faPaperPlane}
 *   isLoading
 *   onClick={async () => await submitForm()}
 * />
 * ```
 *
 * @example Expander (controlled)
 * ```tsx
 * <ActionButton
 *   text="Details"
 *   expander
 *   expanderValue={open}
 *   onClick={() => setOpen((v) => !v)}
 * />
 * ```
 */
function Button({
  icon = null,
  onClick,
  tooltip = null,
  icon2 = null,
  icon2Styles,
  icon2Sytles, // keep typo as alias for now
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
  console.debug('Button.module.scss ->', styles);

  // merge typo prop into the correct one (BC)
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

  const buttonClassNames = isLightColor
    ? {
        primary: styles.primaryLight,
        secondary: styles.secondaryLight,
        success: styles.successLight,
        danger: styles.dangerLight,
        warning: styles.warningLight,
        info: styles.infoLight,
        light: styles.lightLight,
      }
    : {
        primary: styles.primary,
        secondary: styles.secondary,
        success: styles.success,
        danger: styles.danger,
        warning: styles.warning,
        info: styles.info,
        light: styles.light,
      };

  /**
   * Handles click interactions.
   * - Blurs the button to remove focus ring after click.
   * - If `isLoading`, shows spinner + disables temporarily.
   * - Awaits the user-provided `onClick`.
   */
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

  // Rotate the expander chevron based on `expanderValue`
  useEffect(() => {
    const el = expanderRef.current;
    if (!el) return;
    el.classList.toggle(styles.animateIcon, !!expanderValue);
    el.classList.toggle(styles.animateIconBack, !expanderValue);
  }, [expanderValue]);

  /** Icons renderer (primary + optional secondary). */
  const renderIcons = () =>
    icon && (
      <div className={styles.IconContainer}>
        <FontAwesomeIcon icon={icon} style={firstIconStyle} className={IconClassName || ''} />
        {icon2 && (
          <FontAwesomeIcon
            icon={icon2}
            style={icon2StyleMerged}
            className={icon2StyleMerged === undefined ? styles.IconTwo : ''}
          />
        )}
      </div>
    );

  /** Loading spinner renderer. */
  const renderLoading = () => <FontAwesomeIcon icon={faSpinner} style={firstIconStyle} spin />;

  /** Default inner layout (icons → text → optional expander). */
  const renderContent = () => (
    <>
      {isLoadings ? renderLoading() : renderIcons()}
      {text && <div className={styles.buttonText}>{text}</div>}
      {expander && (
        <div ref={expanderRef} className={styles.expandetIcon}>
          <FontAwesomeIcon className={styles.Expander} icon={faChevronDown} />
        </div>
      )}
    </>
  );

  /** Produces either `<button>` or `<a>` with the same look & feel. */
  const renderButton = () => {
    const commonProps = {
      className: clsx(props.className, styles.actionButton, buttonClassNames[color]),
      style: buttonStyle,
    };

    return !link ? (
      <button
        {...commonProps}
        onClick={handleClick}
        disabled={disabledButton}
        id="actionButton"
        ref={refButton}
        {...props}
      >
        {children ?? renderContent()}
      </button>
    ) : (
      <a
        {...commonProps}
        id="actionButton"
        href={link}
        target={target}
        rel={target === '_blank' ? 'noopener noreferrer' : undefined}
      >
        {children ?? renderContent()}
      </a>
    );
  };

  // Tooltip wrapper (only when `tooltip` provided)
  return tooltip ? (
    <Tooltip>
      <TooltipTrigger className={styles.noPadding}>{renderButton()}</TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  ) : (
    renderButton()
  );
}

export default Button;
