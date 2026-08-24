'use client';

import { MessageBox } from './MessageBox';
import type { Message } from '../../types/MessageBox.types';

/**
 * @deprecated Use `MessageBox` with `autoScroll` instead.
 * @see MessageBox
 */
export function MessageBoxAutoscroll(props: Message) {
  return <MessageBox {...props} autoScroll />;
}
