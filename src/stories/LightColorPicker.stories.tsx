import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { LightColorPicker } from '../Components/LightColorPicker/LightColorPicker';
import { Button } from '../Components/Button/Button';

const meta: Meta = {
  title: 'Media/LightColorPicker',
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj;

export const Interactive: Story = {
  name: 'Hue-style light editor',
  render: () => {
    const [open, setOpen] = useState(true);
    const [brightness, setBrightness] = useState(100);
    const [hue, setHue] = useState(40);
    const [saturation, setSaturation] = useState(8);
    const [colorTemperature, setColorTemperature] = useState(28);

    return (
      <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
        <div style={{ padding: '2rem' }}>
          <Button text="Open light editor" color="primary" onClick={() => setOpen(true)} />
        </div>

        {open && (
          <LightColorPicker
            isOpen={open}
            onClose={() => setOpen(false)}
            brightness={brightness}
            onBrightnessChange={setBrightness}
            hue={hue}
            saturation={saturation}
            onColorChange={(h, s) => { setHue(h); setSaturation(s); }}
            colorTemperature={colorTemperature}
            onColorTemperatureChange={setColorTemperature}
          />
        )}
      </div>
    );
  },
};

export const TemperatureDefault: Story = {
  name: 'Color temperature default',
  render: () => {
    const [open, setOpen] = useState(true);
    const [brightness, setBrightness] = useState(72);
    const [hue, setHue] = useState(210);
    const [saturation, setSaturation] = useState(60);
    const [colorTemperature, setColorTemperature] = useState(55);

    return (
      <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
        {open && (
          <LightColorPicker
            isOpen={open}
            onClose={() => setOpen(false)}
            brightness={brightness}
            onBrightnessChange={setBrightness}
            hue={hue}
            saturation={saturation}
            onColorChange={(h, s) => { setHue(h); setSaturation(s); }}
            colorTemperature={colorTemperature}
            onColorTemperatureChange={setColorTemperature}
            defaultMode="temperature"
          />
        )}
      </div>
    );
  },
};
