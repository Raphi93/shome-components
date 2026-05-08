import type { ElementType, KeyboardEventHandler, MouseEventHandler, ReactNode } from 'react';

export type ActionAttributes = {
  link?: string;
  isExternalLink?: boolean;
  /** Override the element used to render `link`. Defaults to the globally configured component or 'a'. */
  linkComponent?: ElementType;
  /** Passed through to linkComponent (e.g. Next.js Link prefetch={false}) */
  prefetch?: boolean;
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
