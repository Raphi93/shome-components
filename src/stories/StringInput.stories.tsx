import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { StringInput } from '../Components/FieldWrapper/FieldWrapper';

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof StringInput> = {
  title: 'Inputs/StringInput',
  component: StringInput,
  tags: ['autodocs'],
  args: {
    label:          'Text input',
    description:    '',
    placeholder:    'Enter text…',
    disabled:       false,
    isWrapped:      true,
    isRequired:     false,
    hasBorderLabel: false,
    value:          'Example',
  },
  argTypes: {
    label:          { control: 'text',    description: 'Label above the input.' },
    description:    { control: 'text',    description: 'Helper text below the label.' },
    placeholder:    { control: 'text' },
    type:           { control: 'select',  options: ['text', 'email', 'tel', 'search', 'url'] },
    value:          { control: 'text',    description: 'Controlled value.' },
    disabled:       { control: 'boolean' },
    isWrapped:      { control: 'boolean', description: 'Wrap in FieldWrapper with label/description.' },
    isRequired:     { control: 'boolean' },
    hasBorderLabel: { control: 'boolean', description: 'Floating border-label style.' },
    errorText:      { control: 'text',    description: 'Validation error shown below the input.' },
    onChange:       { action: 'changed' },
    onBlur:         { action: 'blurred' },
  },
};
export default meta;

type Story = StoryObj<typeof StringInput>;

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: args => {
    const [value, setValue] = useState(args.value ?? '');
    return (
      <div style={{ padding: '1rem', maxWidth: '40rem' }}>
        <StringInput {...args} value={value} onChange={e => { setValue(e.target.value); args.onChange?.(e); }} />
      </div>
    );
  },
};

export const Email: Story = {
  args: { type: 'email', label: 'Email address', placeholder: 'user@example.com', value: '' },
};

export const WithBorderLabel: Story = {
  name: 'Border label variant',
  args: { hasBorderLabel: true, label: 'First name', placeholder: 'Enter your first name', value: '' },
};

export const Required: Story = {
  args: { isRequired: true, label: 'Required field', value: '' },
};

export const WithError: Story = {
  name: 'Validation error',
  args: { isRequired: true, errorText: 'This field is required.', label: 'Field with error', value: '' },
};

export const Disabled: Story = {
  args: { disabled: true, value: 'Cannot edit this', label: 'Disabled field' },
};

export const WithDescription: Story = {
  name: 'With description',
  args: { label: 'Username', description: 'Must be between 3 and 20 characters.', value: '' },
};

export const AllVariants: Story = {
  name: 'All variants',
  render: () => (
    <div style={{ display: 'grid', gap: '1rem', padding: '1rem', maxWidth: '40rem' }}>
      <StringInput id="sv-1" label="Default"       value="Example value"  isWrapped onChange={() => undefined} />
      <StringInput id="sv-2" label="Email"          type="email" placeholder="user@example.com" isWrapped onChange={() => undefined} />
      <StringInput id="sv-3" label="Border label"   hasBorderLabel placeholder="Enter text" isWrapped onChange={() => undefined} />
      <StringInput id="sv-4" label="Required"       isRequired value="" isWrapped onChange={() => undefined} />
      <StringInput id="sv-5" label="With error"     errorText="This field is required." isWrapped onChange={() => undefined} />
      <StringInput id="sv-6" label="Disabled"       value="Cannot edit" disabled isWrapped onChange={() => undefined} />
    </div>
  ),
};
