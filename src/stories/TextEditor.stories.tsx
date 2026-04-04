import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { TextEditor } from '../Components/TextEditor/TextEditor';
import type { TextEditorFormat } from '../Components/TextEditor/TextEditor';

const meta: Meta<typeof TextEditor> = {
  title: 'Inputs/TextEditor',
  component: TextEditor,
  tags: ['autodocs'],
  args: {
    value:       '',
    format:      'html',
    placeholder: 'Start typing…',
    readOnly:    false,
  },
  argTypes: {
    value:       { control: 'text' },
    format:      { control: 'select', options: ['html', 'markdown'] as TextEditorFormat[], description: 'Output format.' },
    placeholder: { control: 'text' },
    readOnly:    { control: 'boolean', description: 'Disable editing.' },
    onChange:       { action: 'changed' },
    onFormatChange: { action: 'formatChanged' },
  },
};
export default meta;

type Story = StoryObj<typeof TextEditor>;

export const Default: Story = {};

export const HtmlMode: Story = {
  name: 'HTML output mode',
  render: () => {
    const [value, setValue]   = useState('<p>Hello <strong>World</strong></p>');
    const [output, setOutput] = useState(value);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <TextEditor format="html" value={value} onChange={(v) => { setValue(v); setOutput(v); }} placeholder="Write HTML content…" />
        <details>
          <summary style={{ cursor: 'pointer', fontSize: '0.8rem', opacity: 0.6 }}>Raw output</summary>
          <pre style={{ padding: '0.75rem', background: 'var(--color-surface)', borderRadius: 4, fontSize: '0.75rem', overflow: 'auto' }}>{output}</pre>
        </details>
      </div>
    );
  },
};

export const MarkdownMode: Story = {
  name: 'Markdown output mode',
  render: () => {
    const [value, setValue]   = useState('# Hello World\n\nThis is **bold** and *italic* text.');
    const [output, setOutput] = useState(value);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <TextEditor format="markdown" value={value} onChange={(v) => { setValue(v); setOutput(v); }} placeholder="Write Markdown…" />
        <details>
          <summary style={{ cursor: 'pointer', fontSize: '0.8rem', opacity: 0.6 }}>Raw output</summary>
          <pre style={{ padding: '0.75rem', background: 'var(--color-surface)', borderRadius: 4, fontSize: '0.75rem', overflow: 'auto' }}>{output}</pre>
        </details>
      </div>
    );
  },
};

export const ReadOnly: Story = {
  args: {
    value:    '<p>This content is <strong>read-only</strong> and cannot be edited.</p>',
    format:   'html',
    readOnly: true,
  },
};

export const WithPlaceholder: Story = {
  args: { value: '', placeholder: 'Write a detailed description of your project…' },
};
