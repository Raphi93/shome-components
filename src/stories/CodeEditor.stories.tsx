import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { CodeEditor } from '../Components/CodeEditor';
import type { CodeEditorTab } from '../Components/CodeEditor';

const meta: Meta<typeof CodeEditor> = {
  title: 'Components/CodeEditor',
  component: CodeEditor,
  tags: ['autodocs'],
  args: {
    language:    'typescript',
    theme:       'vs-dark',
    height:      '400px',
    lineNumbers: true,
    minimap:     true,
    wordWrap:    false,
    readOnly:    false,
    statusBar:   true,
  },
  argTypes: {
    theme:       { control: 'select', options: ['vs-dark', 'light', 'hc-black'] },
    language:    { control: 'select', options: ['typescript','javascript','json','html','css','scss','python','rust','go','markdown','yaml','sql','bash'] },
    lineNumbers: { control: 'boolean' },
    minimap:     { control: 'boolean' },
    wordWrap:    { control: 'boolean' },
    readOnly:    { control: 'boolean' },
    statusBar:   { control: 'boolean' },
    height:      { control: 'text' },
  },
};
export default meta;
type Story = StoryObj<typeof CodeEditor>;

const TS_SAMPLE = `interface User {
  id:    number;
  name:  string;
  email: string;
  role:  'admin' | 'user' | 'guest';
}

async function fetchUser(id: number): Promise<User> {
  const res = await fetch(\`/api/users/\${id}\`);
  if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
  return res.json() as Promise<User>;
}

// Usage
const user = await fetchUser(42);
console.log(user.name);
`;

const JSON_SAMPLE = `{
  "name": "@raphi93/shome-components",
  "version": "1.5.0",
  "description": "React + TypeScript component library",
  "scripts": {
    "build": "rollup -c",
    "storybook": "storybook dev -p 6006"
  },
  "keywords": ["react", "typescript", "components"]
}
`;

const CSS_SAMPLE = `:root {
  --color-brand:      #0072c6;
  --color-brand-rgb:  0, 114, 198;
  --border-radius:    8px;
  --spacing:          1rem;
}

.card {
  background:    var(--color-card-dashboard-background, #fff);
  border-radius: var(--border-radius);
  box-shadow:    var(--shadow-02);
  padding:       var(--spacing);
}
`;

export const Default: Story = {
  args: { value: TS_SAMPLE },
};

export const LightTheme: Story = {
  name: 'Light theme',
  args: { value: TS_SAMPLE, theme: 'light' },
};

export const HighContrast: Story = {
  name: 'High contrast',
  args: { value: TS_SAMPLE, theme: 'hc-black' },
};

export const JSONFile: Story = {
  name: 'JSON language',
  args: { value: JSON_SAMPLE, language: 'json' },
};

export const CSSFile: Story = {
  name: 'CSS language',
  args: { value: CSS_SAMPLE, language: 'css' },
};

export const ReadOnly: Story = {
  name: 'Read-only',
  args: { value: TS_SAMPLE, readOnly: true },
};

export const NoMinimap: Story = {
  name: 'No minimap',
  args: { value: TS_SAMPLE, minimap: false },
};

export const WithTabs: Story = {
  name: 'Multi-tab (file explorer)',
  render: () => {
    const [tabs, setTabs] = useState<CodeEditorTab[]>([
      { id: '1', filename: 'App.tsx',        language: 'typescript', value: TS_SAMPLE },
      { id: '2', filename: 'styles.css',     language: 'css',        value: CSS_SAMPLE },
      { id: '3', filename: 'package.json',   language: 'json',       value: JSON_SAMPLE },
    ]);
    const [activeTab, setActiveTab] = useState('1');

    return (
      <CodeEditor
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onTabClose={(id) => setTabs((prev) => prev.filter((t) => t.id !== id))}
        height="450px"
      />
    );
  },
};

export const Controlled: Story = {
  name: 'Controlled (live output)',
  render: () => {
    const [code, setCode] = useState(TS_SAMPLE);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <CodeEditor value={code} onChange={setCode} language="typescript" height="300px" />
        <details>
          <summary style={{ cursor: 'pointer', fontSize: '0.8rem', opacity: 0.6 }}>Raw output</summary>
          <pre style={{ padding: '0.75rem', background: '#1e1e1e', color: '#cdd6f4', borderRadius: 4, fontSize: '0.75rem', overflow: 'auto' }}>{code}</pre>
        </details>
      </div>
    );
  },
};
