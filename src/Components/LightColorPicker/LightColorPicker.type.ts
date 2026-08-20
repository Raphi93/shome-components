import type { IconProp } from '@fortawesome/fontawesome-svg-core';

export type LightColorPickerMode = 'color' | 'temperature';

export interface LightColorPickerProps {
  /** Whether the editor is visible. Renders null when false. */
  isOpen: boolean;
  /** Called when the user taps "Done" (Fertig). */
  onClose: () => void;

  /** Icon shown on the wheel pin. Defaults to a lightbulb. */
  icon?: IconProp;

  /** 0–100 */
  brightness: number;
  onBrightnessChange: (value: number) => void;

  /** Hue 0–360 / Saturation 0–100 — read while the color wheel is active. */
  hue: number;
  saturation: number;
  onColorChange: (hue: number, saturation: number) => void;

  /** 0 (warmest) – 100 (coolest) — read while the color-temperature wheel is active. */
  colorTemperature: number;
  onColorTemperatureChange: (value: number) => void;

  /** Which wheel is shown first. The switch between the two is internal UI state. Default: 'color'. */
  defaultMode?: LightColorPickerMode;
}
