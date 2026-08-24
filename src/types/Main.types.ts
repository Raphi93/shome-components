import type { ReactNode } from 'react';

export interface MainProps {
  children?: ReactNode;
  upperComponent?: ReactNode;
  hideTitle?: boolean;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}
