import { useMediaQuery } from 'react-responsive';

export const usePhonePortraitAndBelowMediaQuery = () => useMediaQuery({ query: '(max-width: 575px)' });
export const useTabletAndBelowMediaQuery = () => useMediaQuery({ maxWidth: '991px' });

export const useAppMediaQueryMaxWidth = (mediaQuery: number) => useMediaQuery({ maxWidth: `${mediaQuery}px` })
export const useAppMediaQueryMinWidth = (mediaQuery: number) => useMediaQuery({ minWidth: `${mediaQuery}px` })
