'use client';

import { useMemo, useRef, useState } from 'react';
import { faLightbulb, faSun } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import { Button } from '../Button';

export type { LightColorPickerMode, LightColorPickerProps } from '../../types/LightColorPicker.types';
import type { LightColorPickerMode, LightColorPickerProps } from '../../types/LightColorPicker.types';

import styles from './LightColorPicker.module.scss';

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

/**
 * LightColorPicker — a full-screen Hue-app-style light editor: a draggable
 * color wheel / color-temperature wheel and a vertical brightness slider.
 */
export function LightColorPicker({
  isOpen,
  onClose,
  icon = faLightbulb,
  brightness,
  onBrightnessChange,
  hue,
  saturation,
  onColorChange,
  colorTemperature,
  onColorTemperatureChange,
  defaultMode = 'color',
}: LightColorPickerProps) {
  const { t } = useTranslation();
  const [mode, setMode] = useState<LightColorPickerMode>(defaultMode);

  const wheelRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const draggingWheel = useRef(false);
  const draggingSlider = useRef(false);

  const updateFromWheelEvent = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = wheelRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const radius = rect.width / 2;
    const x = e.clientX - rect.left - radius;
    const y = e.clientY - rect.top - radius;

    if (mode === 'color') {
      const distance = Math.min(Math.sqrt(x * x + y * y), radius);
      const angleDeg = (Math.atan2(x, -y) * 180) / Math.PI;
      const nextHue = Math.round((angleDeg + 360) % 360);
      const nextSat = Math.round((distance / radius) * 100);
      onColorChange(nextHue, nextSat);
    } else {
      const nextValue = Math.round(clamp(((y + radius) / (2 * radius)) * 100, 0, 100));
      onColorTemperatureChange(nextValue);
    }
  };

  const handleWheelPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    draggingWheel.current = true;
    wheelRef.current?.setPointerCapture(e.pointerId);
    updateFromWheelEvent(e);
  };

  const handleWheelPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingWheel.current) return;
    updateFromWheelEvent(e);
  };

  const stopWheelDrag = () => {
    draggingWheel.current = false;
  };

  const updateFromSliderEvent = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = sliderRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const relativeY = e.clientY - rect.top;
    const pct = Math.round(clamp(100 - (relativeY / rect.height) * 100, 0, 100));
    onBrightnessChange(pct);
  };

  const handleSliderPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    draggingSlider.current = true;
    sliderRef.current?.setPointerCapture(e.pointerId);
    updateFromSliderEvent(e);
  };

  const handleSliderPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingSlider.current) return;
    updateFromSliderEvent(e);
  };

  const stopSliderDrag = () => {
    draggingSlider.current = false;
  };

  const pinPosition = useMemo(() => {
    if (mode === 'color') {
      const angleRad = (hue * Math.PI) / 180;
      const radiusPct = clamp(saturation, 0, 100) / 2;
      return {
        left: 50 + radiusPct * Math.sin(angleRad),
        top: 50 - radiusPct * Math.cos(angleRad),
      };
    }
    return { left: 50, top: clamp(colorTemperature, 0, 100) };
  }, [mode, hue, saturation, colorTemperature]);

  // Color temperature: 0 (warm/orange, hue ~35) → 100 (cool/blue, hue ~210).
  const temperatureHue = 35 + clamp(colorTemperature, 0, 100) * 1.75;

  const pinColor = mode === 'color'
    ? `hsl(${hue}, ${clamp(saturation, 0, 100)}%, 88%)`
    : `hsl(${temperatureHue}, 55%, 90%)`;

  const glowColor = mode === 'color'
    ? `hsla(${hue}, ${Math.min(clamp(saturation, 0, 100), 65)}%, 60%, 0.35)`
    : `hsla(${temperatureHue}, 70%, 60%, 0.28)`;

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.popup}
        onClick={(e) => e.stopPropagation()}
        style={{ background: `radial-gradient(ellipse 26rem 14rem at 50% -4rem, ${glowColor}, transparent 70%), var(--color-card-dashboard-background)` }}
      >
        <div className={styles.topBar}>
          <Button text={t('Done')} color="primary" onClick={onClose} />
        </div>

        <div className={styles.body}>
          <div className={styles.stage}>
            <div
              ref={wheelRef}
              className={clsx(styles.wheel, styles[mode])}
              onPointerDown={handleWheelPointerDown}
              onPointerMove={handleWheelPointerMove}
              onPointerUp={stopWheelDrag}
              onPointerCancel={stopWheelDrag}
            >
              <div
                className={styles.pin}
                style={{
                  left: `${pinPosition.left}%`,
                  top: `${pinPosition.top}%`,
                  background: pinColor,
                }}
              >
                <FontAwesomeIcon icon={icon} className={styles.pinIcon} />
              </div>
            </div>

            <div className={styles.brightnessColumn}>
              <div className={styles.brightnessLabel}>{Math.round(brightness)}%</div>
              <div
                ref={sliderRef}
                className={styles.brightnessSlider}
                onPointerDown={handleSliderPointerDown}
                onPointerMove={handleSliderPointerMove}
                onPointerUp={stopSliderDrag}
                onPointerCancel={stopSliderDrag}
              >
                <div className={styles.brightnessFill} style={{ height: `${clamp(brightness, 0, 100)}%` }} />
                <FontAwesomeIcon icon={faSun} className={styles.brightnessIcon} />
              </div>
            </div>
          </div>

          <div className={styles.modeSwitch}>
            <button
              type="button"
              className={clsx(styles.modeButton, mode === 'color' && styles.active)}
              onClick={() => setMode('color')}
              aria-label={t('Color')}
            >
              <span className={clsx(styles.swatch, styles.swatchColor)} />
            </button>
            <button
              type="button"
              className={clsx(styles.modeButton, mode === 'temperature' && styles.active)}
              onClick={() => setMode('temperature')}
              aria-label={t('Color temperature')}
            >
              <span className={clsx(styles.swatch, styles.swatchTemperature)} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
