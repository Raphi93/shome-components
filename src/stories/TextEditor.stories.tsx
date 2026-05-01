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
    wordCount:   false,
    minHeight:   120,
  },
  argTypes: {
    value:       { control: 'text',    description: 'Initial HTML or Markdown content.' },
    format:      { control: 'select',  options: ['html', 'markdown'] as TextEditorFormat[], description: 'Output format.' },
    onlyFormat:  { control: 'select',  options: ['html', 'markdown', undefined], description: 'Lock to a single format (hides the format picker).' },
    placeholder: { control: 'text',   description: 'Placeholder shown when the editor is empty.' },
    readOnly:    { control: 'boolean', description: 'Disable editing — hides the toolbar.' },
    wordCount:   { control: 'boolean', description: 'Show live word and character count.' },
    minHeight:   { control: 'number',  description: 'Minimum editor height in px.' },
    maxHeight:   { control: 'number',  description: 'Maximum editor height in px (enables scrolling).' },
    brand:       { control: 'select',  options: ['', 'audi', 'renault', 'kgm', 'honda', 'hyundai'], description: 'Brand key that adds a brand font to the font picker.' },
    hide:        { control: 'object',  description: 'Array of toolbar item names to hide.' },
    id:          { control: 'text',    description: 'HTML id for the editor container.' },
    className:   { control: 'text',    description: 'Additional CSS class on the wrapper.' },
    fonts:       { control: false,     description: 'Array of { label, value } font options.' },
    onChange:         { action: 'changed' },
    onFormatChange:   { action: 'formatChanged' },
    onMagicWandClick: { action: 'magicWandClicked', description: 'Callback for the magic wand button.' },
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
  args: { format: 'markdown', onlyFormat: 'markdown' },
  render: (args) => {
    const [output, setOutput] = useState('## Hello World\n\nThis is **bold** and *italic* text.');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <TextEditor {...args} value={output} onChange={setOutput} placeholder="Write Markdown…" />
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
            { label: 'Arial',       value: "'Arial', sans-serif" },
            { label: 'Georgia',     value: "'Georgia', serif" },
            { label: 'Courier New', value: "'Courier New', monospace" },
            { label: 'Trebuchet',   value: "'Trebuchet MS', sans-serif" },
          ]}
        />
        <OutputPanel value={output} />
      </div>
    );
  },
};

export const WithWordCount: Story = {
  name: 'With word count',
  args: { wordCount: true },
  render: (args) => {
    const [output, setOutput] = useState(args.value ?? '');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <TextEditor {...args} onChange={setOutput} />
        <OutputPanel value={output} />
      </div>
    );
  },
};

export const WithMagicWand: Story = {
  name: 'With magic wand',
  render: (args) => {
    const [output, setOutput] = useState('<p>Click the magic wand button in the toolbar.</p>');
    const [triggered, setTriggered] = useState(false);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <TextEditor
          {...args}
          value={output}
          onChange={setOutput}
          onMagicWandClick={() => { setTriggered(true); args.onMagicWandClick?.(); }}
        />
        {triggered && (
          <p style={{ fontSize: '0.875rem', color: '#666' }}>Magic wand triggered!</p>
        )}
      </div>
    );
  },
};

export const FullFeatured: Story = {
  name: 'All features enabled',
  args: { wordCount: true },
  render: (args) => {
    const [output, setOutput] = useState('<p>Try <strong>all</strong> toolbar features here.</p>');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <TextEditor
          {...args}
          value={output}
          onChange={setOutput}
          fonts={[
            { label: 'Arial',       value: "'Arial', sans-serif" },
            { label: 'Georgia',     value: "'Georgia', serif" },
            { label: 'Courier New', value: "'Courier New', monospace" },
          ]}
          placeholder="Type something…"
        />
        <OutputPanel value={output} />
      </div>
    );
  },
};
