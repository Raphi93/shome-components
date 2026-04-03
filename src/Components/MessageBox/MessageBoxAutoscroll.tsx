'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faCircleCheck, faCircleInfo, faCircleXmark, faTriangleExclamation, faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clx from 'classnames';

import type { Message, NotificationType } from './MessageBox.type';

import styles from './MessageBox.module.scss';

const typeIcon: Record<NotificationType, IconProp> = {
  message: faCircleInfo,
  success: faCircleCheck,
  warning: faTriangleExclamation,
  error: faCircleXmark,
};

/**
 * TODO: replace with MessageBox
 * @deprecated Please use MessageBox instead
 * @see MessageBox
 */
export function MessageBoxAutoscroll({ type, header, text, headerLink, closable, onClose }: Message) {
  const [display, setDisplay] = useState<'show' | 'hide' | 'hiding'>('show');
  const divRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (divRef.current) {
      divRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [type, header, text, headerLink]);

  if ((!header && !text) || display === 'hide') return null;

  const headerLinkNode = headerLink ? <a href={headerLink}>{header}</a> : header;
  const headerNode = header ? <h2>{headerLinkNode}</h2> : undefined;

  const handleClose = (event: React.MouseEvent) => {
    setDisplay('hiding');
    setTimeout(() => {
      onClose?.(event);
      setDisplay('hide');
    }, 300);
  };

  return (
    <div className={clx(styles[type], display === 'hiding' && styles['message-hiding'])} ref={divRef}>
      <span className={styles.typeIcon}>
        <FontAwesomeIcon icon={typeIcon[type]} />
      </span>

      {headerNode}

      {closable && (
        <button onClick={handleClose} className={styles.close} type="button">
          <FontAwesomeIcon icon={faX} />
        </button>
      )}

      {text}
    </div>
  );
}