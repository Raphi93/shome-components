import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { TextEditor } from '../Components/TextEditor/TextEditor';
import type { TextEditorFormat } from '../Components/TextEditor/TextEditor';

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof TextEditor> = {
  title: 'Inputs/TextEditor',
  component: TextEditor,
  tags: ['autodocs'],
  args: {
    value:       '<p>Hello <strong>World</strong></p>',
    format:      'html',
    placeholder: 'Start typing…',
    readOnly:    false,
    emoji:       false,
  },
  argTypes: {
    value:       { control: 'text',    description: 'Initial HTML or Markdown content.' },
    format:      { control: 'select',  options: ['html', 'markdown'] as TextEditorFormat[], description: 'Output format.' },
    placeholder: { control: 'text',   description: 'Placeholder shown when the editor is empty.' },
    readOnly:    { control: 'boolean', description: 'Disable editing — hides the toolbar.' },
    emoji:       { control: 'boolean', description: 'Show emoji picker button in the toolbar.' },
    fonts:       { control: false,     description: 'Array of { label, value } font options rendered in the font-family dropdown.' },
    onChange:       { action: 'changed' },
    onFormatChange: { action: 'formatChanged' },
  },
};
export default meta;

type Story = StoryObj<typeof TextEditor>;

// ─── Helper: live output panel ────────────────────────────────────────────────

function OutputPanel({ value }: { value: string }) {
  return (
    <details>
      <summary style={{ cursor: 'pointer', fontSize: '0.8rem', opacity: 0.6 }}>Raw output</summary>
      <pre style={{ padding: '0.75rem', background: 'var(--color-surface)', borderRadius: 4, fontSize: '0.75rem', overflow: 'auto', marginTop: '0.5rem' }}>{value}</pre>
    </details>
  );
}

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => {
    const [output, setOutput] = useState(args.value ?? '');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* key forces a full remount when args.value changes via Storybook controls */}
        <TextEditor {...args} key={args.value} onChange={setOutput} />
        <OutputPanel value={output} />
      </div>
    );
  },
};

export const HtmlMode: Story = {
  name: 'HTML output mode',
  render: () => {
    const [output, setOutput] = useState('<p>Hello <strong>World</strong></p>');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <TextEditor format="html" value={output} onChange={setOutput} placeholder="Write HTML content…" />
        <OutputPanel value={output} />
      </div>
    );
  },
};

export const MarkdownMode: Story = {
  name: 'Markdown output mode',
  render: () => {
    const [output, setOutput] = useState('# Hello World\n\nThis is **bold** and *italic* text.');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <TextEditor format="markdown" value={output} onChange={setOutput} placeholder="Write Markdown…" />
        <OutputPanel value={output} />
      </div>
    );
  },
};

export const ReadOnly: Story = {
  name: 'Read-only',
  args: {
    value:    '<p>This content is <strong>read-only</strong> and cannot be edited.</p>',
    readOnly: true,
  },
};

export const WithPlaceholder: Story = {
  name: 'With placeholder',
  args: { value: '', placeholder: 'Write a detailed description of your project…' },
};

export const WithEmoji: Story = {
  name: 'With emoji picker',
  args: { emoji: true },
  render: (args) => {
    const [output, setOutput] = useState(args.value ?? '');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <TextEditor {...args} key={args.value} onChange={setOutput} />
        <OutputPanel value={output} />
      </div>
    );
  },
};

export const WithFonts: Story = {
  name: 'With font family picker',
  render: () => {
    const [output, setOutput] = useState('<p>Change the font family via the toolbar dropdown.</p>');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <TextEditor
          value={output}
          onChange={setOutput}
          fonts={[
            { label: 'Arial',      value: "'Arial', sans-serif" },
            { label: 'Georgia',    value: "'Georgia', serif" },
            { label: 'Courier New', value: "'Courier New', monospace" },
            { label: 'Trebuchet',  value: "'Trebuchet MS', sans-serif" },
          ]}
        />
        <OutputPanel value={output} />
      </div>
    );
  },
};

export const FullFeatured: Story = {
  name: 'All features enabled',
  render: () => {
    const [output, setOutput] = useState('<p>Try <strong>all</strong> toolbar features here.</p>');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <TextEditor
          value={output}
          onChange={setOutput}
          emoji
          fonts={[
            { label: 'Arial',      value: "'Arial', sans-serif" },
            { label: 'Georgia',    value: "'Georgia', serif" },
            { label: 'Courier New', value: "'Courier New', monospace" },
          ]}
          placeholder="Type something…"
        />
        <OutputPanel value={output} />
      </div>
    );
  },
};
