'use client';

import React, { ForwardedRef, forwardRef } from 'react';

import { getConfiguredLinkComponent } from '../../linkConfig';
import type { ActionWrapperProps } from './ActionElement.type';
export type { ActionAttributes, ActionWrapperProps } from './ActionElement.type';

export const ActionWrapper = forwardRef(
  (props: ActionWrapperProps, ref: ForwardedRef<any>) => {
    const { link, isExternalLink, linkComponent, prefetch, onClick, type, children, defaultsTo, testId, onKeyDown, ...rest } = props;
    const restWithTestId = { ...rest, ...(testId ? { 'data-testid': testId } : {}) };

    if (link) {
      if (isExternalLink) {
        return (
          <a href={link} ref={ref} onClick={onClick} {...restWithTestId}>
            {children}
          </a>
        );
      }
      const LinkEl = linkComponent ?? getConfiguredLinkComponent();
      return (
        <LinkEl
          href={link}
          ref={ref}
          onClick={onClick}
          {...(prefetch !== undefined ? { prefetch } : {})}
          {...restWithTestId}
        >
          {children}
        </LinkEl>
      );
    }

    if (onClick || type || defaultsTo === 'button') {
      return (
        <button onKeyDown={onKeyDown} onClick={onClick} type={type} ref={ref} {...restWithTestId}>
          {children}
        </button>
      );
    }

    if (defaultsTo === 'div') {
      return <div ref={ref} {...restWithTestId}>{children}</div>;
    }

    if (defaultsTo === 'span') {
      return <span ref={ref} {...restWithTestId}>{children}</span>;
    }

    return <>{children}</>;
  }
);
