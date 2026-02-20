"use client";

import React from 'react';
import { ForwardedRef, forwardRef, KeyboardEventHandler, MouseEventHandler, ReactNode } from 'react';
import Link from "next/link";

export type ActionAttributes = {
  /**
   * URL for the link
   */
  link?: string;
  /**
   * Defines if the link is within application or external to it
   */
  isExternalLink?: boolean;
  /**
   *  Selection of button type and it's behaviour
   */
  type?: 'button' | 'submit';
  onClick?: MouseEventHandler;
  testId?: string;
};

export const ActionWrapper = forwardRef(
  (
    props: ActionAttributes & {
      className?: string;
      children?: ReactNode;
      disabled?: boolean;
      title?: string;
      defaultsTo?: 'div' | 'span' | 'button' | 'empty';
      testId?: string;
      onKeyDown?: KeyboardEventHandler<HTMLButtonElement>;
    },
    ref: ForwardedRef<any>
  ) => {
    const { link, isExternalLink, onClick, type, children, defaultsTo, testId, onKeyDown, ...rest } = props;
    const restWithTestId = { ...rest, ...(testId ? { 'data-testid': testId } : {}) };
    if (link) {
      if (isExternalLink) {
        return (
          <a href={link} ref={ref} onClick={onClick} {...restWithTestId}>
            {children}
          </a>
        );
      } else {
        return (
          <Link href={link} legacyBehavior>
            <a ref={ref as any} onClick={onClick as any} {...restWithTestId}>
            {children}
          </a>
          </Link>
        );
      }
    } else if (onClick || type || defaultsTo === 'button') {
      return (
        <button onKeyDown={onKeyDown} onClick={onClick} type={type} ref={ref} {...restWithTestId}>
          {children}
        </button>
      );
    } else if (defaultsTo === 'div') {
      return (
        <div ref={ref} {...restWithTestId}>
          {children}
        </div>
      );
    } else if (defaultsTo === 'span') {
      return (
        <span ref={ref} {...restWithTestId}>
          {children}
        </span>
      );
    } else {
      return <>{children}</>;
    }
  }
);