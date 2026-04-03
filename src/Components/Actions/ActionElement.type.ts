import type { KeyboardEventHandler, MouseEventHandler, ReactNode } from 'react';

export type ActionAttributes = {
  link?: string;
  isExternalLink?: boolean;
  type?: 'button' | 'submit';
  onClick?: MouseEventHandler;
  testId?: string;
};

export interface ActionWrapperProps extends ActionAttributes {
  className?: string;
  children?: ReactNode;
  disabled?: boolean;
  title?: string;
  defaultsTo?: 'div' | 'span' | 'button' | 'empty';
  onKeyDown?: KeyboardEventHandler<HTMLButtonElement>;
}
