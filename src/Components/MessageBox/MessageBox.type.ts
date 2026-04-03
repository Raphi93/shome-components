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
