import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { FieldWrapper, StringInput, PasswordInput, NumberInput, Textarea, Value } from '../Components/FieldWrapper/FieldWrapper';

const meta: Meta = {
  title: 'Inputs/FieldWrapper',
  tags: ['autodocs'],
};
export default meta;

/** All standard input types in one form */
export const AllInputs: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: 480 }}>
      <StringInput label="Name" id="name" placeholder="John Doe" isWrapped />
      <StringInput label="Email" id="email" type="email" placeholder="john@example.com" isRequired isWrapped />
      <PasswordInput label="Password" id="password" isWrapped />
      <NumberInput label="Age" id="age" min={0} max={120} isWrapped />
      <Textarea label="Notes" id="notes" placeholder="Write something..." isWrapped />
    </div>
  ),
};

/** Border-label variant — floating label style */
export const BorderLabel: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: 480 }}>
      <StringInput label="Name" id="bl-name" hasBorderLabel />
      <StringInput label="Email" id="bl-email" type="email" hasBorderLabel isRequired />
      <PasswordInput label="Password" id="bl-pass" hasBorderLabel />
      <NumberInput label="Amount" id="bl-amount" hasBorderLabel />
    </div>
  ),
};

/** Read-only value display */
export const ReadOnly: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: 480 }}>
      <Value label="Name" value="John Doe" />
      <Value label="Email" value="john@example.com" />
      <Value label="Registered" value="2024-01-15T10:00:00" valueType="dateTime" />
      <Value label="Active" value={true} valueType="boolean" />
    </div>
  ),
};

/** With validation errors */
export const WithErrors: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: 480 }}>
      <StringInput label="Username" id="err-user" value="" isRequired errorText="Username is required" isWrapped />
      <StringInput label="Email" id="err-email" value="notanemail" errorText="Invalid email format" isWrapped />
    </div>
  ),
};

/** Dirty state — shows undo icon */
export const DirtyState: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: 480 }}>
      <StringInput
        label="Name"
        id="dirty-name"
        value="Changed Value"
        hasBorderLabel
        isDirty
        dirtyText="Click to reset to original value"
        onClearDirty={() => alert('reset!')}
      />
    </div>
  ),
};

/** Disabled inputs */
export const Disabled: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: 480 }}>
      <StringInput label="Locked field" id="dis-name" value="Read only" disabled isWrapped />
      <NumberInput label="Fixed amount" id="dis-num" value={42} disabled isWrapped />
    </div>
  ),
};
