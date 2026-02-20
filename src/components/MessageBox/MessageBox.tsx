import React, { ReactNode, useEffect, useRef, useState } from 'react';
import clx from 'classnames';

import styles from './MessageBox.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';

export type NotificationType = 'error' | 'warning' | 'message' | 'success';

export type Message = {
  type: NotificationType;
  header?: string;
  text?: string;
  headerLink?: string;
  closable?: boolean;
  onClose?: (e: React.MouseEvent) => void;
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
          <FontAwesomeIcon icon={faX} />
        </button>
      )}
      {text}
      {children}
    </div>
  );
}
