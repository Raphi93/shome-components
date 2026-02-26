import React, { ReactNode, useEffect, useRef, useState } from 'react';
import clx from 'classnames';

import { Icon, Icons } from '../Icon/Icon';

import styles from './MessageBox.module.scss';

export type NotificationType = 'error' | 'warning' | 'message' | 'success';

export type Message = {
  /**
   * Type of message
   */
  type: NotificationType;
  /**
   * Header of the message
   */
  header?: string;
  /**
   * Text of the message
   */
  text?: string;
  /**
   * Link for the header if applicable
   */
  headerLink?: string;
  /**
   * User can close the message
   */
  closable?: boolean;
  /**
   * Callback function when the message is closed
   */
  onClose?: (e: React.MouseEvent) => void;
  /**
   * Auto-scroll viewport to the message
   */
  autoScroll?: boolean;
};

export function MessageBox({
  type,
  header,
  children,
  text,
  headerLink,
  closable,
  onClose,
  autoScroll,
}: Message & {
  /**
   * Children of the message - e.g. paragraph or list
   */
  children?: ReactNode;
}) {
  const [display, setDisplay] = useState<'show' | 'hide' | 'hiding'>('show');
  const divRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (autoScroll && divRef.current) {
      divRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [type, header, text, headerLink, autoScroll]);

  if ((!header && !text && !children) || display === 'hide') {
    return null;
  }

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
      {headerNode}
      {closable && (
        <button onClick={handleClose} className={styles.close} type="button">
          <Icon icon={Icons.Close} />
        </button>
      )}
      {text}
      {children}
    </div>
  );
}
