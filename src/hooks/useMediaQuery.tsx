import { useMediaQuery } from 'react-responsive';

/**
 * Returns `true` when the viewport is 575 px wide or narrower (phone portrait).
 *
 * @example
 * const isPhone = usePhonePortraitAndBelowMediaQuery();
 */
export const usePhonePortraitAndBelowMediaQuery = () =>
  useMediaQuery({ query: '(max-width: 575px)' });

/**
 * Returns `true` when the viewport is 991 px wide or narrower (tablet and below).
 *
 * @example
 * const isTablet = useTabletAndBelowMediaQuery();
 */
export const useTabletAndBelowMediaQuery = () =>
  useMediaQuery({ maxWidth: '991px' });

/**
 * Returns `true` when the viewport is at most `mediaQuery` pixels wide.
 *
 * @param mediaQuery  Maximum viewport width in pixels.
 *
 * @example
 * const isNarrow = useAppMediaQueryMaxWidth(768);
 */
export const useAppMediaQueryMaxWidth = (mediaQuery: number) =>
  useMediaQuery({ maxWidth: `${mediaQuery}px` });

/**
 * Returns `true` when the viewport is at least `mediaQuery` pixels wide.
 *
 * @param mediaQuery  Minimum viewport width in pixels.
 *
 * @example
 * const isWide = useAppMediaQueryMinWidth(1200);
 */
export const useAppMediaQueryMinWidth = (mediaQuery: number) =>
  useMediaQuery({ minWidth: `${mediaQuery}px` });
