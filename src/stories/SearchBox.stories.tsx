import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { SearchTextBox } from '../Components/Search/SearchBox';

const meta: Meta<typeof SearchTextBox> = {
  title: 'Inputs/SearchBox',
  component: SearchTextBox,
  tags: ['autodocs'],
  argTypes: {
    placeholder:       { control: 'text' },
    hasBorderLabel:    { control: 'boolean' },
    minLengthToSearch: { control: 'number' },
    searchDelay:       { control: 'number' },
  },
  args: {
    placeholder: 'Search...',
    hasBorderLabel: false,
    minLengthToSearch: 0,
    searchDelay: 300,
  },
};
export default meta;

export const Default: StoryObj = {
  render: (args) => {
    const [q, setQ] = useState('');
    return (
      <div>
        <SearchTextBox {...args} value={q} valueChanged={setQ} />
        {q && <p style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>Query: <strong>{q}</strong></p>}
      </div>
    );
  },
};

export const BorderLabel: StoryObj = {
  args: { hasBorderLabel: true, placeholder: 'Search records...' },
  render: (args) => {
    const [q, setQ] = useState('');
    return <SearchTextBox {...args} value={q} valueChanged={setQ} />;
  },
};

export const WithMinLength: StoryObj = {
  args: { minLengthToSearch: 3, placeholder: 'Min 3 chars...' },
  render: (args) => {
    const [q, setQ] = useState('');
    return (
      <div>
        <SearchTextBox {...args} value={q} valueChanged={setQ} />
        <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--color-gray-500)' }}>
          Search fires after {args.minLengthToSearch} characters
        </p>
      </div>
    );
  },
};
