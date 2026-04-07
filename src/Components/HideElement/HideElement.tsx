'use client';

import { FC } from 'react';
import { useMediaQuery } from 'react-responsive';

import type { HideElementProps } from './HideElement.type';

export const HideElement: FC<HideElementProps> = ({ children, hideElement = 'mobile' }) => {
  const isMobile = useMediaQuery({ maxWidth: '767px' });
  const isTablet = useMediaQuery({ maxWidth: '991px' });

  if (hideElement === 'mobile' && isMobile) return null;
  if (hideElement === 'tablet' && isTablet) return null;

  return <>{children}</>;
};
