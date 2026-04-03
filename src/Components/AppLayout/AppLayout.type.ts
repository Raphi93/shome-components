import type { ReactNode } from 'react';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import type { NavigationItem } from '../../types';
import type { useLocationSidebar } from '../Sidebar/useLocationSidebar';

export interface AppLayoutProps {
  children: ReactNode;
  upperComponent: ReactNode;
  image: string;
  imageLong: string;
  handleGenerateImage?: (svg: string) => string | null;
  handleImageClick: () => void;
  title: string;
  buttons?: ReactNode;
  menu: NavigationItem[];
  showSidebar: boolean;
  subtitle?: string;
  envTitle?: string;
  showHeader: boolean;
  isMobile: boolean;
  closeText?: string;
  expanded: boolean;
  handleContentClick?: () => void;
  setExpanded: (expanded: boolean) => void;
  handleSpecialMenuClick?: (menuId: number) => void;
  hasSpecialMenu?: boolean;
  menuTypes?: { key: number; label: string; icon: IconProp | string }[];
  isMenuId?: number;
  useLocationSidebarSelf?: ReturnType<typeof useLocationSidebar>;
  brandName?: string;
}
