import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ThreeStateCheckbox } from '../Components/FieldWrapper/ThreeStateCheckbox/ThreeStateCheckbox';
import type { CheckedState } from '../Components/FieldWrapper/ThreeStateCheckbox/ThreeStateCheckbox';

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof ThreeStateCheckbox> = {
  title: 'Inputs/ThreeStateCheckbox',
  component: ThreeStateCheckbox,
  tags: ['autodocs'],
  args: {
    id:        'three-state-story',
    text:      'Select all',
    value:     null,
    disabled:  false,
    isWrapped: false,
  },
  argTypes: {
    id:          { control: 'text' },
    text:        { control: 'text',   description: 'Label text next to the checkbox.' },
    value:       { control: 'select', options: [true, false, null], description: 'true = checked · false = unchecked · null = indeterminate.' },
    disabled:    { control: 'boolean' },
    isWrapped:   { control: 'boolean', description: 'Wrap in FieldWrapper.' },
    label:       { control: 'text',   description: 'FieldWrapper label (only when isWrapped = true).' },
    description: { control: 'text',   description: 'FieldWrapper helper text.' },
    errorText:   { control: 'text',   description: 'Validation error shown below.' },
    onChange:    { action: 'changed' },
  },
};
export default meta;

type Story = StoryObj<typeof ThreeStateCheckbox>;

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: args => {
    const [value, setValue] = useState<CheckedState>(args.value ?? null);
    const label = value === null ? 'Indeterminate' : value ? 'Checked' : 'Unchecked';
    return (
      <div style={{ padding: '1rem' }}>
        <ThreeStateCheckbox
          {...args}
          value={value}
          onChange={checked => { setValue(checked); args.onChange?.(checked); }}
        />
        <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#888' }}>
          State: <strong>{label}</strong>
        </p>
      </div>
    );
  },
};

export const Checked: Story = {
  args: { value: true, text: 'Checked state' },
};

export const Unchecked: Story = {
  args: { value: false, text: 'Unchecked state' },
};

export const Indeterminate: Story = {
  args: { value: null, text: 'Indeterminate state' },
};

export const Disabled: Story = {
  args: { disabled: true, value: false, text: 'Disabled checkbox' },
};

export const DisabledIndeterminate: Story = {
  name: 'Disabled (indeterminate)',
  args: { disabled: true, value: null, text: 'Disabled indeterminate' },
};

export const WithWrapper: Story = {
  name: 'With FieldWrapper',
  args: {
    isWrapped:   true,
    label:       'Select all items',
    description: 'Clicking cycles: checked → unchecked → indeterminate.',
    text:        'All items',
    value:       null,
  },
  render: args => {
    const [value, setValue] = useState<CheckedState>(args.value ?? null);
    return (
      <div style={{ padding: '1rem', maxWidth: '30rem' }}>
        <ThreeStateCheckbox {...args} value={value} onChange={setValue} />
      </div>
    );
  },
};

export const AllStates: Story = {
  name: 'All states',
  render: () => (
    <div style={{ display: 'flex', gap: '2rem', padding: '1rem', flexWrap: 'wrap' }}>
      <ThreeStateCheckbox id="s1" text="Checked (true)"         value={true}  onChange={() => undefined} />
      <ThreeStateCheckbox id="s2" text="Unchecked (false)"      value={false} onChange={() => undefined} />
      <ThreeStateCheckbox id="s3" text="Indeterminate (null)"   value={null}  onChange={() => undefined} />
      <ThreeStateCheckbox id="s4" text="Disabled"               value={false} disabled onChange={() => undefined} />
      <ThreeStateCheckbox id="s5" text="Disabled indeterminate" value={null}  disabled onChange={() => undefined} />
    </div>
  ),
};
