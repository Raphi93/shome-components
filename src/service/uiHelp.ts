export function pxToRem(value: number): string {
  const rootFontSize = 16;
  value = value / rootFontSize;
  return value.toFixed(3);
}
