import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { NumberInput } from '../Components/FieldWrapper/FieldWrapper';

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof NumberInput> = {
  title: 'Inputs/NumberInput',
  component: NumberInput,
  tags: ['autodocs'],
  args: {
    label:          'Number input',
    placeholder:    'Enter a number',
    disabled:       false,
    isWrapped:      true,
    isRequired:     false,
    hasBorderLabel: false,
    showPercent:    false,
    value:          5,
    min:            0,
    max:            100,
    step:           1,
  },
  argTypes: {
    label:          { control: 'text',    description: 'Label above the input.' },
    description:    { control: 'text',    description: 'Helper text below the label.' },
    placeholder:    { control: 'text' },
    value:          { control: 'number',  description: 'Controlled numeric value.' },
    min:            { control: 'number',  description: 'Minimum allowed value.' },
    max:            { control: 'number',  description: 'Maximum allowed value.' },
    step:           { control: 'number',  description: 'Step increment.' },
    disabled:       { control: 'boolean' },
    isWrapped:      { control: 'boolean', description: 'Wrap in FieldWrapper.' },
    isRequired:     { control: 'boolean' },
    hasBorderLabel: { control: 'boolean', description: 'Floating border-label style.' },
    showPercent:    { control: 'boolean', description: 'Append a % symbol.' },
    errorText:      { control: 'text',    description: 'Validation error shown below.' },
    onChange:       { action: 'changed' },
  },
};
export default meta;

type Story = StoryObj<typeof NumberInput>;

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: args => {
    const [value, setValue] = useState<number | undefined>(args.value);
    return (
      <div style={{ padding: '1rem', maxWidth: '40rem' }}>
        <NumberInput
          {...args}
          value={value}
          onChange={e => { setValue(e.target.value === '' ? undefined : Number(e.target.value)); args.onChange?.(e); }}
        />
      </div>
    );
  },
};

export const WithPercent: Story = {
  name: 'With % symbol',
  args: { showPercent: true, label: 'Discount (%)', value: 15, min: 0, max: 100 },
};

export const WithBorderLabel: Story = {
  name: 'Border label variant',
  args: { hasBorderLabel: true, label: 'Amount', placeholder: '0', value: undefined },
};

export const Required: Story = {
  args: { isRequired: true, label: 'Required number', value: undefined },
};

export const WithError: Story = {
  name: 'Validation error',
  args: { errorText: 'Value must be between 0 and 100.', label: 'Invalid value', value: 150 },
};

export const Disabled: Story = {
  args: { disabled: true, value: 42, label: 'Read-only value' },
};

export const AllVariants: Story = {
  name: 'All variants',
  render: () => (
    <div style={{ display: 'grid', gap: '1rem', padding: '1rem', maxWidth: '40rem' }}>
      <NumberInput id="nv-1" label="Default"      value={5}   isWrapped onChange={() => undefined} />
      <NumberInput id="nv-2" label="With %"       value={25}  showPercent isWrapped onChange={() => undefined} />
      <NumberInput id="nv-3" label="Border label" hasBorderLabel placeholder="0" isWrapped onChange={() => undefined} />
      <NumberInput id="nv-4" label="Disabled"     value={42}  disabled isWrapped onChange={() => undefined} />
      <NumberInput id="nv-5" label="With error"   value={150} errorText="Max 100 allowed." isWrapped onChange={() => undefined} />
    </div>
  ),
};
