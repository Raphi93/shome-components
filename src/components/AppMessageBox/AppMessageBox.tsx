import { useEffect, useRef } from "react";
import React from "react";

import { Message, MessageBox } from "../MessageBox/MessageBox";

/**
 * AppMessageBox
 *
 * Renders a MessageBox and automatically clears the current message after a configurable timeout.
 *
 * @param props - Component props.
 * @param props.hideTimeout - Time in milliseconds to wait before automatically clearing the message by calling `setMessage(undefined)`. Defaults to 8000.
 * @param props.setMessage - Optional setter function that will be invoked with `undefined` when the timeout elapses (used to clear the message).
 * @param props.autoScroll - Whether the underlying MessageBox should auto-scroll. Defaults to true.
 * @param props.* - All other props are forwarded to the underlying MessageBox and should conform to the `Message` type.
 *
 * @remarks
 * The component stores the timeout ID in a ref and schedules a `setTimeout` whenever `hideTimeout` or `setMessage` changes.
 * The timeout is cleared on unmount or when dependencies change to prevent timer leaks and unexpected state updates.
 *
 * @example
 * <AppMessageBox title="Saved" body="Your changes were saved." level="info" setMessage={setMessage} />
 */
type TAppMessageBoxProps = { hideTimeout?: number; setMessage?: (msg?: Message) => void } & Message;
export const AppMessageBox = (props: TAppMessageBoxProps) => {
  const { hideTimeout = 8000, setMessage, autoScroll = true, ...rest } = props;
  const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    intervalRef.current = setTimeout(() => {
      setMessage?.(undefined);
    }, hideTimeout);

    return () => {
      clearTimeout(intervalRef.current);
    };
  }, [hideTimeout, setMessage]);

  return <MessageBox autoScroll={autoScroll} {...rest} />;
};
