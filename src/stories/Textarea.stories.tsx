import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Textarea } from '../Components/FieldWrapper/FieldWrapper';

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof Textarea> = {
  title: 'Inputs/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  args: {
    label:       'Notes',
    placeholder: 'Add any additional notes here…',
    isRequired:  false,
    disabled:    false,
    isWrapped:   true,
    rows:        4,
  },
  argTypes: {
    label:       { control: 'text' },
    description: { control: 'text',    description: 'Helper text below the label.' },
    placeholder: { control: 'text' },
    rows:        { control: 'number',  description: 'Visible row count.' },
    isRequired:  { control: 'boolean' },
    disabled:    { control: 'boolean' },
    isWrapped:   { control: 'boolean', description: 'Wrap in FieldWrapper.' },
    errorText:   { control: 'text',    description: 'Validation error shown below.' },
    onChange:    { action: 'changed' },
  },
};
export default meta;

type Story = StoryObj<typeof Textarea>;

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: args => {
    const [value, setValue] = useState('');
    return (
      <div style={{ padding: '1rem', maxWidth: '40rem' }}>
        <Textarea {...args} value={value} onChange={e => { setValue(e.target.value); args.onChange?.(e); }} />
      </div>
    );
  },
};

export const Required: Story = {
  args: { isRequired: true, label: 'Comment (required)' },
  render: args => {
    const [value, setValue] = useState('');
    return (
      <div style={{ padding: '1rem', maxWidth: '40rem' }}>
        <Textarea {...args} value={value} onChange={e => setValue(e.target.value)} />
      </div>
    );
  },
};

export const WithError: Story = {
  name: 'Validation error',
  args: { errorText: 'This field cannot be empty.', isRequired: true },
  render: args => {
    const [value, setValue] = useState('');
    return (
      <div style={{ padding: '1rem', maxWidth: '40rem' }}>
        <Textarea {...args} value={value} onChange={e => setValue(e.target.value)} />
      </div>
    );
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  render: args => (
    <div style={{ padding: '1rem', maxWidth: '40rem' }}>
      <Textarea {...args} value="This content cannot be edited." onChange={() => undefined} />
    </div>
  ),
};

export const TallTextarea: Story = {
  name: 'Tall (8 rows)',
  args: { rows: 8, label: 'Description', placeholder: 'Write a detailed description…' },
  render: args => {
    const [value, setValue] = useState('');
    return (
      <div style={{ padding: '1rem', maxWidth: '40rem' }}>
        <Textarea {...args} value={value} onChange={e => setValue(e.target.value)} />
      </div>
    );
  },
};

export const WithDescription: Story = {
  name: 'With description',
  args: { description: 'Maximum 500 characters. Markdown is supported.' },
  render: args => {
    const [value, setValue] = useState('');
    return (
      <div style={{ padding: '1rem', maxWidth: '40rem' }}>
        <Textarea {...args} value={value} onChange={e => setValue(e.target.value)} />
        <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#888' }}>
          {value.length} / 500 characters
        </p>
      </div>
    );
  },
};
