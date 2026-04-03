import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import type { NavigationItem } from '../../types';
import type { useLocationSidebar } from './useLocationSidebar';

export interface SidebarProps {
  className?: string;
  menu: NavigationItem[];
  setExpanded: (expanded: boolean) => void;
  expanded: boolean;
  image?: string;
  imageLong?: string;
  handleImageClick?: () => void;
  handleGenerateImage?: (svg: string) => string | null;
  isMobile: boolean;
  closeText?: string;
  reset: boolean;
  envTitle?: string;
  handleSpecialMenuClick?: (menuId: number) => void;
  hasSpecialMenu?: boolean;
  menuTypes?: { key: number; label: string; icon: IconProp | string }[];
  isMenuId?: number;
  useLocationSidebarSelf?: ReturnType<typeof useLocationSidebar>;
  brandName?: string;
}
