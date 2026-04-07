/**
 * Returns a locale-aware number formatter function.
 *
 * @param culture  BCP 47 language tag, e.g. `"de-CH"`, `"en-US"`. Default: `"en-US"`.
 * @returns A function `(number, options?) => string`.
 *          Returns an empty string when `number` is `undefined`.
 *
 * @example
 * const format = useNumberFormat('de-CH');
 * format(1234567.89)                              // → "1'234'567.89"
 * format(0.42, { style: 'percent' })              // → "42 %"
 * format(9.99,  { style: 'currency', currency: 'CHF' }) // → "CHF 9.99"
 */
export function useNumberFormat(culture: string = 'en-US') {
  return (number: number | undefined, options?: Intl.NumberFormatOptions): string => {
    if (number === undefined) return '';
    return new Intl.NumberFormat(culture, options).format(number);
  };
}
