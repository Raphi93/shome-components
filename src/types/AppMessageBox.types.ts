import type { Message } from './MessageBox.types';

export type AppMessageBoxProps = {
  hideTimeout?: number;
  setMessage?: (msg?: Message) => void;
} & Message;
