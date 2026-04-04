import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { TextEditor } from '../Components/TextEditor/TextEditor';

const meta: Meta<typeof TextEditor> = {
  title: 'Inputs/TextEditor',
  component: TextEditor,
  tags: ['autodocs'],
  argTypes: {
    format:      { control: 'radio', options: ['html', 'markdown'] },
    readOnly:    { control: 'boolean' },
    placeholder: { control: 'text' },
  },
  args: {
    format: 'html',
    readOnly: false,
    placeholder: 'Start typing...',
  },
};
export default meta;

type Story = StoryObj<typeof TextEditor>;

export const HTML: Story = {
  args: { format: 'html' },
  render: (args) => {
    const [value, setValue] = useState('<p>Edit this <strong>HTML</strong> content.</p>');
    return (
      <div>
        <TextEditor {...args} value={value} onChange={setValue} />
        <details style={{ marginTop: '1rem' }}>
          <summary style={{ cursor: 'pointer', color: 'var(--color-gray-600)', fontSize: '0.85rem' }}>Output</summary>
          <pre style={{ fontSize: '0.8rem', padding: '0.5rem', background: 'var(--color-gray-100)', borderRadius: 4, overflow: 'auto' }}>{value}</pre>
        </details>
      </div>
    );
  },
};

export const Markdown: Story = {
  args: { format: 'markdown' },
  render: (args) => {
    const [value, setValue] = useState('# Hello\n\nEdit this **Markdown** content.');
    return (
      <div>
        <TextEditor {...args} value={value} onChange={setValue} />
        <details style={{ marginTop: '1rem' }}>
          <summary style={{ cursor: 'pointer', color: 'var(--color-gray-600)', fontSize: '0.85rem' }}>Output</summary>
          <pre style={{ fontSize: '0.8rem', padding: '0.5rem', background: 'var(--color-gray-100)', borderRadius: 4, overflow: 'auto' }}>{value}</pre>
        </details>
      </div>
    );
  },
};

export const ReadOnly: Story = {
  args: { readOnly: true },
  render: (args) => (
    <TextEditor
      {...args}
      value="<p>This editor is <strong>read-only</strong>. You cannot edit it.</p>"
    />
  ),
};

export const Empty: Story = {
  args: { placeholder: 'Start writing your content here...' },
  render: (args) => {
    const [value, setValue] = useState('');
    return <TextEditor {...args} value={value} onChange={setValue} />;
  },
};
