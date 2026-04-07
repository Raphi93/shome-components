import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { AppToggleActive } from '../Components/AppToggleActive/AppToggleActive';

const meta: Meta<typeof AppToggleActive> = {
  title: 'Inputs/Toggle',
  component: AppToggleActive,
  tags: ['autodocs'],
  args: {
    label:        'Enable feature',
    value:        false,
    disabled:     false,
    small:        false,
    brandedColor: false,
    secondary:    false,
    textOnLeft:   false,
    isRequired:   false,
  },
  argTypes: {
    label:        { control: 'text' },
    activeText:   { control: 'text',    description: 'Label shown when ON.'  },
    disabledText: { control: 'text',    description: 'Label shown when OFF.' },
    value:        { control: 'boolean', description: 'Controlled on/off state.' },
    disabled:     { control: 'boolean' },
    small:        { control: 'boolean', description: 'Compact size.' },
    brandedColor: { control: 'boolean', description: 'Use brand accent colour.' },
    secondary:    { control: 'boolean' },
    textOnLeft:   { control: 'boolean', description: 'Move text label to the left.' },
    isRequired:   { control: 'boolean' },
    errorText:    { control: 'text' },
    onChange:     { action: 'changed' },
  },
};
export default meta;

type Story = StoryObj<typeof AppToggleActive>;

export const Default: Story = {
  render: (args) => {
    const [val, setVal] = useState(args.value ?? false);
    return <AppToggleActive {...args} value={val} onChange={(e) => setVal(e.target.checked)} />;
  },
};

export const On: Story = {
  args: { label: 'Notifications', value: true },
};

export const WithStatusLabels: Story = {
  name: 'Active / inactive labels',
  render: () => {
    const [val, setVal] = useState(true);
    return (
      <AppToggleActive
        label="Status"
        value={val}
        activeText="Active"
        disabledText="Inactive"
        onChange={(e) => setVal(e.target.checked)}
      />
    );
  },
};

export const Disabled: Story = {
  args: { label: 'Read-only toggle', value: true, disabled: true },
};

export const Small: Story = {
  args: { label: 'Compact toggle', small: true, value: false },
};

export const Branded: Story = {
  args: { label: 'Brand colour', brandedColor: true, value: true },
};

export const AllVariants: Story = {
  name: 'All variants',
  render: () => {
    const [vals, setVals] = useState([true, false, true, false, true]);
    const toggle = (i: number) => setVals((v) => v.map((x, j) => j === i ? !x : x));
    const rows: [string, object][] = [
      ['Default',          {}],
      ['Branded colour',   { brandedColor: true }],
      ['Small',            { small: true }],
      ['Disabled (on)',    { disabled: true }],
      ['With status text', { activeText: 'Active', disabledText: 'Inactive' }],
    ];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {rows.map(([label, props], i) => (
          <AppToggleActive
            key={label}
            label={label}
            value={vals[i]}
            onChange={() => toggle(i)}
            {...props}
          />
        ))}
      </div>
    );
  },
};
