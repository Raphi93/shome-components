import type { ReactNode } from 'react';

export interface HeaderProps {
  className?: string;
  title: string;
  buttons?: ReactNode;
  subtitle?: string;
  envTitle?: string;
  isMobile?: boolean;
  image?: string;
  noSidebar?: boolean;
  brandName?: string;
}
