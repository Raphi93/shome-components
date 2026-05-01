import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { PasswordInput } from '../Components/FieldWrapper/FieldWrapper';

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof PasswordInput> = {
  title: 'Inputs/PasswordInput',
  component: PasswordInput,
  tags: ['autodocs'],
  args: {
    label:       'Password',
    placeholder: 'Min. 8 characters',
    isRequired:  false,
    disabled:    false,
    isWrapped:   true,
  },
  argTypes: {
    label:       { control: 'text' },
    description: { control: 'text',    description: 'Helper text below the label.' },
    placeholder: { control: 'text' },
    isRequired:  { control: 'boolean' },
    disabled:    { control: 'boolean' },
    isWrapped:   { control: 'boolean', description: 'Wrap in FieldWrapper.' },
    errorText:   { control: 'text',    description: 'Validation error shown below.' },
    onChange:    { action: 'changed' },
  },
};
export default meta;

type Story = StoryObj<typeof PasswordInput>;

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: args => {
    const [value, setValue] = useState('');
    return (
      <div style={{ padding: '1rem', maxWidth: '40rem' }}>
        <PasswordInput {...args} value={value} onChange={e => { setValue(e.target.value); args.onChange?.(e); }} />
      </div>
    );
  },
};

export const Required: Story = {
  args: { isRequired: true },
  render: args => {
    const [value, setValue] = useState('');
    return (
      <div style={{ padding: '1rem', maxWidth: '40rem' }}>
        <PasswordInput {...args} value={value} onChange={e => setValue(e.target.value)} />
      </div>
    );
  },
};

export const WithError: Story = {
  name: 'Validation error',
  args: { errorText: 'Password must be at least 8 characters.' },
  render: args => {
    const [value, setValue] = useState('abc');
    return (
      <div style={{ padding: '1rem', maxWidth: '40rem' }}>
        <PasswordInput {...args} value={value} onChange={e => setValue(e.target.value)} />
      </div>
    );
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  render: args => (
    <div style={{ padding: '1rem', maxWidth: '40rem' }}>
      <PasswordInput {...args} value="••••••••" onChange={() => undefined} />
    </div>
  ),
};

export const WithDescription: Story = {
  name: 'With description',
  args: { description: 'Use at least 8 characters including a number and a symbol.' },
  render: args => {
    const [value, setValue] = useState('');
    return (
      <div style={{ padding: '1rem', maxWidth: '40rem' }}>
        <PasswordInput {...args} value={value} onChange={e => setValue(e.target.value)} />
      </div>
    );
  },
};
