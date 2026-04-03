import type { Message } from '../MessageBox/MessageBox.type';

export type AppMessageBoxProps = {
  hideTimeout?: number;
  setMessage?: (msg?: Message) => void;
} & Message;
