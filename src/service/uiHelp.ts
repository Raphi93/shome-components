/**
 * Converts a pixel value to a rem string (base font size: 16 px).
 *
 * @param value  Value in pixels.
 * @returns The rem equivalent as a string with 3 decimal places.
 *
 * @example
 * pxToRem(16)  // → "1.000"
 * pxToRem(24)  // → "1.500"
 * pxToRem(575) // → "35.938"  (used for breakpoint media queries)
 */
export function pxToRem(value: number): string {
  return (value / 16).toFixed(3);
}
