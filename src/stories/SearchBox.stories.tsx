import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { SearchTextBox, SearchTextBoxWithHelp, Help } from '../Components/Search/SearchBox';

const meta: Meta<typeof SearchTextBox> = {
  title: 'Inputs/SearchBox',
  component: SearchTextBox,
  tags: ['autodocs'],
  args: {
    placeholder:       'Search…',
    searchDelay:       500,
    minLengthToSearch: 3,
    hasLeftIcon:       true,
  },
  argTypes: {
    placeholder:       { control: 'text' },
    searchDelay:       { control: 'number', description: 'Debounce delay in ms.' },
    minLengthToSearch: { control: 'number', description: 'Min characters before calling valueChanged.' },
    hasLeftIcon:       { control: 'boolean', description: 'Show magnifier icon on left.' },
    errorText:         { control: 'text' },
    hasBorderLabel:    { control: 'boolean' },
    valueChanged:      { action: 'searched' },
  },
};
export default meta;

type Story = StoryObj<typeof SearchTextBox>;

export const Default: Story = {};

export const Controlled: Story = {
  name: 'Controlled (live output)',
  render: () => {
    const [query, setQuery] = useState('');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <SearchTextBox
          placeholder="Search customers…"
          minLengthToSearch={2}
          valueChanged={setQuery}
        />
        {query && (
          <div style={{ padding: '0.75rem', background: 'var(--color-surface)', borderRadius: 'var(--border-radius-small)', fontSize: '0.85rem' }}>
            Searching for: <strong>{query}</strong>
          </div>
        )}
      </div>
    );
  },
};

export const WithError: Story = {
  args: { errorText: 'Minimum 3 characters required.', value: 'ab' },
};

export const BorderLabel: Story = {
  args: { hasBorderLabel: true, placeholder: 'Search products' },
};

export const WithHelp: Story = {
  name: 'SearchTextBoxWithHelp',
  render: () => (
    <SearchTextBoxWithHelp>
      <SearchTextBox placeholder="Search orders…" valueChanged={() => undefined} />
      <Help title="Search tips">
        <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.85rem' }}>
          <li>Use <code>*</code> as a wildcard</li>
          <li>Minimum 3 characters</li>
          <li>Case-insensitive</li>
        </ul>
      </Help>
    </SearchTextBoxWithHelp>
  ),
};
