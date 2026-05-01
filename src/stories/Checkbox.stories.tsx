import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Checkbox } from '../Components/FieldWrapper/Checkbox';

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof Checkbox> = {
  title: 'Inputs/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  args: {
    id:          'checkbox-story',
    label:       'Checkbox',
    text:        'Accept terms and conditions',
    description: 'Check this box to confirm you agree.',
    disabled:    false,
    isWrapped:   true,
    isRequired:  false,
    value:       false,
  },
  argTypes: {
    label:       { control: 'text',    description: 'Label in the FieldWrapper above the checkbox.' },
    text:        { control: 'text',    description: 'Text displayed next to the checkbox.' },
    description: { control: 'text',    description: 'Helper text below the label.' },
    id:          { control: 'text' },
    value:       { control: 'boolean', description: 'Controlled checked state.' },
    disabled:    { control: 'boolean' },
    isWrapped:   { control: 'boolean', description: 'Wrap in FieldWrapper with label/description.' },
    isRequired:  { control: 'boolean' },
    errorText:   { control: 'text',    description: 'Validation error shown below.' },
    onChange:    { action: 'changed' },
  },
};
export default meta;

type Story = StoryObj<typeof Checkbox>;

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: args => {
    const [checked, setChecked] = useState(Boolean(args.value));
    return (
      <div style={{ padding: '1rem', maxWidth: '40rem' }}>
        <Checkbox
          {...args}
          value={checked}
          onChange={e => { setChecked(e.target.checked); args.onChange?.(e); }}
        />
      </div>
    );
  },
};

export const Checked: Story = {
  args: { value: true, text: 'Already checked' },
};

export const Unchecked: Story = {
  args: { value: false, text: 'Not yet checked' },
};

export const Required: Story = {
  args: { isRequired: true, text: 'I agree to the terms *' },
};

export const WithError: Story = {
  name: 'Validation error',
  args: { errorText: 'You must accept the terms to continue.', text: 'Accept terms' },
};

export const Disabled: Story = {
  args: { disabled: true, value: false, text: 'Disabled checkbox' },
};

export const DisabledChecked: Story = {
  name: 'Disabled (checked)',
  args: { disabled: true, value: true, text: 'Disabled and checked' },
};

export const WithoutWrapper: Story = {
  name: 'Without wrapper',
  args: { isWrapped: false, text: 'Standalone checkbox (no wrapper)' },
  render: args => (
    <div style={{ padding: '1rem' }}>
      <Checkbox {...args} />
    </div>
  ),
};

export const AllVariants: Story = {
  name: 'All variants',
  render: () => (
    <div style={{ display: 'grid', gap: '0.5rem', padding: '1rem', maxWidth: '35rem' }}>
      <Checkbox id="cb-1" text="Default unchecked"  isWrapped={false} onChange={() => undefined} />
      <Checkbox id="cb-2" text="Default checked"    isWrapped={false} value={true} onChange={() => undefined} />
      <Checkbox id="cb-3" text="Disabled unchecked" isWrapped={false} disabled onChange={() => undefined} />
      <Checkbox id="cb-4" text="Disabled checked"   isWrapped={false} disabled value={true} onChange={() => undefined} />
    </div>
  ),
};
