import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import {
  LangDatePicker,
  LangDateTimePicker,
  LangTimePicker,
} from '../Components/MultiDatePickers/DatePickers';

const meta: Meta = {
  title: 'Inputs/DatePicker',
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj;

const LANG_OPTIONS = ['E', 'DE', 'FR', 'IT', 'SK', 'CZ', 'RU', 'PL', 'ES'] as const;

export const DateOnly: Story = {
  name: 'Date picker',
  render: () => {
    const [value, setValue] = useState<string | null>('2025-06-15');
    return (
      <LangDatePicker
        label="Date"
        isRequired
        value={value ?? undefined}
        onChange={(v) => { setValue(v); console.log('date:', v); }}
      />
    );
  },
};

export const DateTime: Story = {
  name: 'Date + time picker',
  render: () => {
    const [value, setValue] = useState<string | null>('2025-06-15T14:30:00');
    return (
      <LangDateTimePicker
        label="Appointment"
        isRequired
        value={value ?? undefined}
        onChange={(v) => setValue(v)}
      />
    );
  },
};

export const TimeOnly: Story = {
  name: 'Time picker',
  render: () => {
    const [value, setValue] = useState<string | null>('14:30:00');
    return (
      <LangTimePicker
        label="Start time"
        value={value ?? undefined}
        onChange={(v) => setValue(v)}
      />
    );
  },
};

export const WithError: Story = {
  name: 'Date picker — validation error',
  render: () => (
    <LangDatePicker
      label="Birth date"
      isRequired
      errorText="Date is required."
      onChange={() => undefined}
    />
  ),
};

export const Disabled: Story = {
  name: 'Date picker — disabled',
  render: () => (
    <LangDatePicker
      label="Fixed date"
      value="2025-01-01"
      disabled
      onChange={() => undefined}
    />
  ),
};

export const WithMinMax: Story = {
  name: 'With min / max range',
  render: () => {
    const [value, setValue] = useState<string | null>(null);
    return (
      <LangDatePicker
        label="Booking date"
        description="Only future dates within 90 days."
        min={new Date().toISOString().split('T')[0]}
        max={new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
        value={value ?? undefined}
        onChange={(v) => setValue(v)}
      />
    );
  },
};

export const AllPickers: Story = {
  name: 'All picker types',
  render: () => {
    const [date,     setDate]     = useState<string | null>(null);
    const [dateTime, setDateTime] = useState<string | null>(null);
    const [time,     setTime]     = useState<string | null>(null);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 400 }}>
        <LangDatePicker     label="Date"      value={date     ?? undefined} onChange={setDate} />
        <LangDateTimePicker label="Date+Time" value={dateTime ?? undefined} onChange={setDateTime} />
        <LangTimePicker     label="Time"      value={time     ?? undefined} onChange={setTime} />
      </div>
    );
  },
};
