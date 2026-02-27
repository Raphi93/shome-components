// MessageBoxAutoscroll.tsx
import React, { useEffect, useRef, useState } from 'react';
import clx from 'classnames';

import { Icon, Icons } from '../Icon/Icon';

import { Message, NotificationType } from './MessageBox';

import styles from './MessageBox.module.scss';

const typeIcon: Record<NotificationType, (typeof Icons)[keyof typeof Icons]> = {
  message: Icons.InformationCircleOutline ?? Icons.InformationCircle ?? Icons.Information,
  success: Icons.CheckmarkCircleOutline ?? Icons.CheckmarkCircle ?? Icons.Checkmark,
  warning: Icons.Warning,
  error: Icons.Alert,
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
        <Icon icon={typeIcon[type]} />
      </span>

      {headerNode}

      {closable && (
        <button onClick={handleClose} className={styles.close} type="button">
          <Icon icon={Icons.Close} />
        </button>
      )}

      {text}
    </div>
  );
}