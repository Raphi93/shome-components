import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ToggleActive, ToggleOptions } from '../Components/FieldWrapper/Toggle';

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof ToggleActive> = {
  title: 'Inputs/Toggle',
  component: ToggleActive,
  tags: ['autodocs'],
  args: {
    id:           'toggle-story',
    label:        'Enable feature',
    description:  'Toggle switch for enabling or disabling a feature.',
    activeText:   'Active',
    disabledText: 'Inactive',
    disabled:     false,
    isWrapped:    true,
    secondary:    false,
    textOnLeft:   false,
    hasBorderLabel: false,
    value:        false,
  },
  argTypes: {
    label:        { control: 'text',    description: 'Label in the FieldWrapper.' },
    description:  { control: 'text',    description: 'Helper text below the label.' },
    activeText:   { control: 'text',    description: 'Text shown when active (on).' },
    disabledText: { control: 'text',    description: 'Text shown when inactive (off).' },
    value:        { control: 'boolean', description: 'Controlled checked state.' },
    disabled:     { control: 'boolean' },
    secondary:    { control: 'boolean', description: 'Secondary styling variant.' },
    textOnLeft:   { control: 'boolean', description: 'Move text labels to the left.' },
    isWrapped:    { control: 'boolean', description: 'Wrap in FieldWrapper.' },
    hasBorderLabel: { control: 'boolean', description: 'Floating border-label style.' },
    errorText:    { control: 'text',    description: 'Validation error shown below.' },
    onChange:     { action: 'changed' },
  },
};
export default meta;

type Story = StoryObj<typeof ToggleActive>;

// ─── ToggleActive stories ─────────────────────────────────────────────────────

export const Default: Story = {
  render: args => {
    const [value, setValue] = useState(args.value ?? false);
    return (
      <div style={{ padding: '1rem', maxWidth: '30rem' }}>
        <ToggleActive
          {...args}
          value={value}
          onChange={e => { setValue(e.target.checked); args.onChange?.(e); }}
        />
        <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#888' }}>
          State: <strong>{value ? 'on' : 'off'}</strong>
        </p>
      </div>
    );
  },
};

export const Active: Story = {
  args: { value: true, activeText: 'On', disabledText: 'Off' },
};

export const Inactive: Story = {
  args: { value: false, activeText: 'On', disabledText: 'Off' },
};

export const Disabled: Story = {
  args: { disabled: true, value: false, label: 'Disabled toggle' },
};

export const DisabledActive: Story = {
  name: 'Disabled (active)',
  args: { disabled: true, value: true, label: 'Disabled active toggle' },
};

export const NoText: Story = {
  name: 'No text labels',
  args: { activeText: undefined, disabledText: undefined, label: 'Simple toggle' },
};

export const Secondary: Story = {
  args: { secondary: true, activeText: 'Yes', disabledText: 'No', label: 'Secondary style' },
};

export const TextOnLeft: Story = {
  name: 'Text on left',
  args: { textOnLeft: true, activeText: 'Enabled', disabledText: 'Disabled', label: 'Text on left' },
};

export const WithBorderLabel: Story = {
  name: 'Border label',
  args: { hasBorderLabel: true, label: 'Border label toggle', activeText: 'On', disabledText: 'Off' },
};

export const WithError: Story = {
  name: 'Validation error',
  args: { errorText: 'This field is required.', label: 'Required toggle', isWrapped: true },
};

export const WithoutWrapper: Story = {
  name: 'Without wrapper',
  args: { isWrapped: false, activeText: 'Active', disabledText: 'Inactive' },
  render: args => (
    <div style={{ padding: '1rem' }}>
      <ToggleActive {...args} />
    </div>
  ),
};

// ─── ToggleOptions stories ────────────────────────────────────────────────────

export const ToggleOptionsDefault: Story = {
  name: 'ToggleOptions (left / right choice)',
  render: () => {
    const [value, setValue] = useState(false);
    return (
      <div style={{ padding: '1rem', maxWidth: '30rem' }}>
        <ToggleOptions
          id="toggle-options-story"
          label="View mode"
          leftChoice="List"
          rightChoice="Grid"
          value={value}
          onChange={e => setValue(e.target.checked)}
        />
        <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#888' }}>
          Current: <strong>{value ? 'Grid' : 'List'}</strong>
        </p>
      </div>
    );
  },
};

export const AllVariants: Story = {
  name: 'All variants',
  render: () => (
    <div style={{ display: 'grid', gap: '1rem', padding: '1rem', maxWidth: '35rem' }}>
      <ToggleActive id="v1" label="Default"       activeText="On" disabledText="Off" onChange={() => undefined} />
      <ToggleActive id="v2" label="Secondary"     activeText="On" disabledText="Off" secondary onChange={() => undefined} />
      <ToggleActive id="v3" label="Disabled off"  activeText="On" disabledText="Off" disabled onChange={() => undefined} />
      <ToggleActive id="v4" label="Disabled on"   activeText="On" disabledText="Off" disabled value={true} onChange={() => undefined} />
      <ToggleActive id="v5" label="No text labels" onChange={() => undefined} />
    </div>
  ),
};
