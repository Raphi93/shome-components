'use client';

import React from 'react';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { AlertProps } from './Alert.type';

import './Alert.scss';

/**
 * Alert — a simple modal-style confirmation/notification component.
 *
 * Renders an overlay containing an icon, a title, optional body text, and
 * Cancel/Confirm action buttons. When closed (isOpened is false) the component
 * returns null.
 *
 * Behavior:
 * - The cancel button calls `cancelButtonHandler` if provided; otherwise it
 *   invokes `setIsOpened(false)` when a setter is supplied.
 * - The confirm button calls `confirmButtonHandler` if provided and then
 *   invokes `setIsOpened(false)` when a setter is supplied.
 * - Both buttons are disabled when `isOkDisabled` is true.
 *
 * @param isOpened - Whether the alert is visible. If false, the component returns null.
 * @param setIsOpened - Optional state setter used to close/open the alert: (open: boolean) => void.
 * @param title - Primary title text displayed in the alert header.
 * @param text - Optional body content (string or ReactNode) displayed under the title.
 * @param confirmButtonHandler - Optional callback executed when the confirm button is clicked.
 * @param cancelButtonHandler - Optional callback executed when the cancel button is clicked.
 * @param isOkDisabled - When true, disables both action buttons. Default: false.
 * @param confirmTitlle - Label for the confirm button. Default: "Ok". (Name preserved from implementation.)
 * @param cancelTitle - Label for the cancel button. Default: "Cancel".
 * @param icon - FontAwesome icon used in the alert header. Default: faCircleXmark.
 * @param color - Theme/color class applied to the icon and confirm button. Default: "brand".
 *
 * @returns A React element representing the alert overlay and contents, or null when not open.
 */
const Alert: React.FC<AlertProps> = ({
  isOpened,
  setIsOpened,
  title,
  text,
  confirmButtonHandler,
  cancelButtonHandler,
  isOkDisabled = false,
  confirmTitlle = 'Ok',
  cancelTitle = 'Cancel',
  icon = faCircleXmark,
  color = 'brand',
}) => {
  if (!isOpened) return null;

  return (
    <div className="alert-overlay">
      <div className="alert-container">
        <FontAwesomeIcon icon={icon} className={`alert-icon ${color}`} />
        <h2 className="alert-title">{title}</h2>
        {text && <div className="alert-content">
          {text}
        </div>}
        <div className="alert-buttons">
          <button
            className="alert-button cancel"
            onClick={cancelButtonHandler || (() => setIsOpened?.(false))}
            disabled={isOkDisabled}
          >
            {cancelTitle}
          </button>
          <button
            className={`alert-button ${color}-confirm `}
            onClick={() => {
              if (confirmButtonHandler) {
                confirmButtonHandler();
              }
              setIsOpened?.(false);
            }}
            disabled={isOkDisabled}
          >
            {confirmTitlle}
          </button>
        </div>
      </div>
    </div>
  );
};

export { Alert };
