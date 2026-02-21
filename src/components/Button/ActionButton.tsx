import React, { ForwardedRef, forwardRef, KeyboardEventHandler, ReactNode } from 'react';
import { ClipLoader } from 'react-spinners';
import clx from 'classnames';

import { ActionAttributes, ActionWrapper } from '../Actions/ActionElement';
import { Icon, Icons } from '../Icon/Icon';

import style from './Button.module.scss';

export type ButtonAttributes = {
  /**
   *  Text that is shown on the button
   */
  text?: string;
  /**
   *  From enum found in Icon component
   */
  icon?: Icons;
  /**
   *  For including SVG icon
   */
  imgSrc?: ReactNode;
  /**
   *  Selection of button type and it's behaviour
   */
  type?: 'button' | 'submit';
  /**
   * Unnecessary in most cases
   */
  title?: string;
  /**
   * Other semantic visual variants
   */
  variant?: 'positive' | 'negative' | 'warning' | 'neutral';
  /**
   *  Attribute for secondary button
   */
  secondary?: boolean;
  /**
   *  Attribute for small button
   */
  small?: boolean;
  /**
   *  Attribute for disabled button
   */
  disabled?: boolean;
  /**
   * Move icon to the right side of the text
   */
  iconOnRight?: boolean;
  /**
   * For passing additional css class from parent component
   */
  className?: string;
  isLoading?: boolean;
  onKeyDown?: KeyboardEventHandler<HTMLButtonElement>;
} & ActionAttributes;

function getButtonClass(attrs: ButtonAttributes) {
  const classes = [style.button];

  if (attrs.icon) {
    classes.push(style['with-icon']);
  }
  if (attrs.imgSrc) {
    classes.push(style['with-svg']);
  }
  if (attrs.variant) {
    classes.push(style[attrs.variant]);
  }
  if (attrs.secondary) {
    classes.push(style.secondary);
  }
  if (attrs.small) {
    classes.push(style.small);
  }
  if (attrs.iconOnRight) {
    classes.push(style['icon-right']);
  }

  if (attrs.isLoading) {
    classes.push(style.loading);
  }

  if (attrs.className) {
    classes.push(attrs.className);
  }

  return classes.join(' ');
}

/**
 * Button with icon (from `Icons` set)
 */
export const ActionButton = forwardRef((args: ButtonAttributes, ref: ForwardedRef<any>) => {
  const { text, icon, type, title, disabled, onClick, link, isExternalLink, imgSrc, onKeyDown, isLoading } = args;

  return (
    <ActionWrapper
      ref={ref}
      className={getButtonClass(args)}
      disabled={disabled}
      title={title}
      onClick={onClick}
      link={link}
      isExternalLink={isExternalLink}
      type={type}
      defaultsTo="button"
      onKeyDown={onKeyDown}
    >
      {imgSrc ? <svg>{React.Children.only(imgSrc)}</svg> : null}

      {icon && !imgSrc ? <Icon icon={icon} /> : null}

      {(icon || imgSrc) && text ? <span>{text}</span> : text}

      {isLoading && (
        <div className={clx(style.buttonLoaderWrapper, { [style.buttonLoaderWrapperWithIcons]: !icon && !imgSrc })}>
          <ClipLoader size={15} color={'var(--button-color)'} />
        </div>
      )}
    </ActionWrapper>
  );
});

type MockButtonAttributes = Omit<
  ButtonAttributes,
  'type' | 'disabled' | 'title' | 'link' | 'isExternalLink' | 'onClick'
>;

/**
 * Component with all the visual options of the Button component, without the functionality, to be used in places where `<Button>` can't be used due to the parrent component already being an Action element (link / button)
 */
export function MockButton(args: MockButtonAttributes) {
  const { text, icon, imgSrc } = args;
  return (
    <span className={getButtonClass(args)}>
      {imgSrc}
      {icon && !imgSrc ? <Icon icon={icon} /> : null}

      {(icon || imgSrc) && text ? <span>{text}</span> : text}
    </span>
  );
}

/**
 * Preferred container for any number of buttons when outside of another component
 */
export function ButtonContainer({
  children,
  alignRight = false,
  className,
}: {
  /**
   *  Buttons that should be in the ButtonContainer
   */
  children?: ReactNode;
  /**
   *  Keeps the order, just moves buttons to the right
   */
  alignRight?: boolean;
  /**
   * For passing additional css class from parent component
   */
  className?: string;
}) {
  const classes = [style['button-container']];

  if (alignRight) {
    classes.push(style['align-right']);
  }
  if (className) {
    classes.push(className);
  }

  return <div className={classes.join(' ')}>{children}</div>;
}
