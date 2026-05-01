import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { TextAreaChat } from '../Components/FieldWrapper';

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof TextAreaChat> = {
  title: 'Inputs/TextAreaChat',
  component: TextAreaChat,
  tags: ['autodocs'],
  args: {
    label:           'Message',
    placeholder:     'Type a message…',
    disabled:        false,
    isRequired:      false,
    isWrapped:       true,
    sendButtonTitle: 'Send',
  },
  argTypes: {
    label:           { control: 'text',    description: 'Label shown above the textarea.' },
    description:     { control: 'text',    description: 'Optional helper text below the label.' },
    placeholder:     { control: 'text',    description: 'Placeholder text inside the textarea.' },
    disabled:        { control: 'boolean', description: 'Disables the input and send button.' },
    isRequired:      { control: 'boolean', description: 'Marks the field as required.' },
    isWrapped:       { control: 'boolean', description: 'Wraps the input in a FieldWrapper with label and error text.' },
    sendButtonTitle: { control: 'text',    description: 'Aria-label for the send button.' },
    errorText:       { control: 'text',    description: 'Validation error message shown below the field.' },
    onChange: { action: 'changed', description: 'Fired on every textarea change.' },
    onSend:   { action: 'sent',    description: 'Fired when Enter is pressed or the send button clicked.' },
  },
};
export default meta;

type Story = StoryObj<typeof TextAreaChat>;

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: args => {
    const [value, setValue] = useState('');
    return (
      <div style={{ maxWidth: '480px', padding: '1rem' }}>
        <TextAreaChat {...args} value={value} onChange={e => setValue(e.target.value)} />
      </div>
    );
  },
};

export const WithValue: Story = {
  name: 'With pre-filled value',
  render: args => {
    const [value, setValue] = useState('Hello, how can I help you?');
    return (
      <div style={{ maxWidth: '480px', padding: '1rem' }}>
        <TextAreaChat {...args} value={value} onChange={e => setValue(e.target.value)} />
      </div>
    );
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  render: args => (
    <div style={{ maxWidth: '480px', padding: '1rem' }}>
      <TextAreaChat {...args} value="This field is disabled" />
    </div>
  ),
};

export const WithError: Story = {
  name: 'With error',
  args: { errorText: 'Message cannot be empty.' },
  render: args => {
    const [value, setValue] = useState('');
    return (
      <div style={{ maxWidth: '480px', padding: '1rem' }}>
        <TextAreaChat {...args} value={value} onChange={e => setValue(e.target.value)} />
      </div>
    );
  },
};

export const WithDescription: Story = {
  name: 'With description',
  args: { description: 'Press Enter to send, Shift+Enter for a new line.' },
  render: args => {
    const [value, setValue] = useState('');
    return (
      <div style={{ maxWidth: '480px', padding: '1rem' }}>
        <TextAreaChat {...args} value={value} onChange={e => setValue(e.target.value)} />
      </div>
    );
  },
};

export const Unwrapped: Story = {
  name: 'Without wrapper',
  args: { isWrapped: false, label: undefined },
  render: args => {
    const [value, setValue] = useState('');
    return (
      <div style={{ maxWidth: '480px', padding: '1rem' }}>
        <TextAreaChat {...args} value={value} onChange={e => setValue(e.target.value)} />
      </div>
    );
  },
};

export const Interactive: Story = {
  name: 'Interactive (log sent messages)',
  render: args => {
    const [value, setValue] = useState('');
    const [log, setLog] = useState<string[]>([]);
    return (
      <div style={{ maxWidth: '480px', padding: '1rem' }}>
        <TextAreaChat
          {...args}
          value={value}
          onChange={e => setValue(e.target.value)}
          onSend={val => {
            setLog(prev => [...prev, val]);
            setValue('');
          }}
        />
        {log.length > 0 && (
          <ul style={{ marginTop: '1rem', fontSize: '0.875rem', listStyle: 'none', padding: 0 }}>
            {log.map((msg, i) => (
              <li key={i} style={{ padding: '0.25rem 0', borderBottom: '1px solid #eee' }}>{msg}</li>
            ))}
          </ul>
        )}
      </div>
    );
  },
};
