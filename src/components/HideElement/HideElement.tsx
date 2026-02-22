import { FC, ReactNode } from 'react';
import { useMediaQuery } from 'react-responsive';

interface IProps {
  children: ReactNode;
  hideElement?: 'mobile' | 'tablet';
}

export const HideElement: FC<IProps> = ({ children, hideElement = 'mobile' }) => {
  const isMobile = useMediaQuery({ maxWidth: '767px' });
  const isTablet = useMediaQuery({ maxWidth: '991px' });
  if (hideElement === 'mobile' && isMobile) {
    return null;
  } else if (hideElement === 'tablet' && isTablet) {
    return null;
  }

  return <>{children}</>;
};
