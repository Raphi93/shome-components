import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import {
  FieldWrapper,
  StringInput,
  PasswordInput,
  NumberInput,
  Textarea,
  Value,
} from '../Components/FieldWrapper/FieldWrapper';

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof FieldWrapper> = {
  title: 'Inputs/FieldWrapper',
  component: FieldWrapper,
  tags: ['autodocs'],
  args: {
    label:       'Label',
    isRequired:  false,
    description: '',
    readOnly:    false,
    errorText:   '',
  },
  argTypes: {
    label:       { control: 'text' },
    isRequired:  { control: 'boolean' },
    description: { control: 'text',    description: 'Helper text shown below the label.' },
    readOnly:    { control: 'boolean' },
    errorText:   { control: 'text',    description: 'Validation error — shown in red.' },
  },
};
export default meta;

type Story = StoryObj<typeof FieldWrapper>;

// ─── FieldWrapper ─────────────────────────────────────────────────────────────

export const CustomChild: Story = {
  name: 'FieldWrapper — custom child',
  args: { label: 'Custom field', isRequired: true, description: 'Any input can live inside.' },
  render: args => (
    <FieldWrapper {...args}>
      <input
        style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid var(--input-border)', borderRadius: 'var(--border-radius-small)', background: 'var(--input-background)', color: 'var(--input-color)' }}
        placeholder="Type something…"
      />
    </FieldWrapper>
  ),
};

export const WithError: Story = {
  name: 'FieldWrapper — validation error',
  args: { label: 'Username', isRequired: true, errorText: 'Username is already taken.' },
  render: args => (
    <FieldWrapper {...args}>
      <input
        style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid var(--color-danger, #ef4444)', borderRadius: 'var(--border-radius-small)', background: 'var(--input-background)', color: 'var(--input-color)' }}
        defaultValue="john_doe"
      />
    </FieldWrapper>
  ),
};

// ─── Value — read-only display ────────────────────────────────────────────────

export const ValueDisplay: Story = {
  name: 'Value — display field',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1rem', maxWidth: '30rem' }}>
      <Value label="Username"     value="raphi93" />
      <Value label="Score"        value={1337} />
      <Value label="Active"       value={true}                  valueType="boolean" />
      <Value label="Created"      value="2025-01-15T08:30:00Z" valueType="dateTime" />
      <Value label="Profile link" value="View profile"          link="https://example.com" />
      <Value label="Empty field"  value=""                      hideEmpty />
    </div>
  ),
};

// ─── Complete form example ────────────────────────────────────────────────────

export const FullFormExample: Story = {
  name: 'Complete form',
  render: () => {
    const [name,     setName]     = useState('');
    const [email,    setEmail]    = useState('');
    const [password, setPassword] = useState('');
    const [age,      setAge]      = useState<number | undefined>(undefined);
    const [notes,    setNotes]    = useState('');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem', maxWidth: 480 }}>
        <StringInput   label="Full name"  isRequired placeholder="Anna Müller"          value={name}     onChange={e => setName(e.target.value)} />
        <StringInput   label="Email"      isRequired type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
        <PasswordInput label="Password"   isRequired placeholder="Min. 8 characters"    value={password} onChange={e => setPassword(e.target.value)} />
        <NumberInput   label="Age"        min={18} max={120}                             value={age}      onChange={e => setAge(Number(e.target.value))} />
        <Textarea      label="Notes"      placeholder="Anything else?"                  value={notes}    onChange={e => setNotes(e.target.value)} />
        <div style={{ fontSize: '0.8rem', color: '#888', borderTop: '1px solid #eee', paddingTop: '0.5rem' }}>
          State: name="{name}" · email="{email}" · age={age ?? '–'}
        </div>
      </div>
    );
  },
};
