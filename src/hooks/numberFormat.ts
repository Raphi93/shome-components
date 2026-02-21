export function useNumberFormat(culture: string = 'en-US') {
  return (number: number | undefined, options?: Intl.NumberFormatOptions): string => {
    if (number === undefined) {
      return '';
    }
    return new Intl.NumberFormat(culture, options).format(number);
  };
}
