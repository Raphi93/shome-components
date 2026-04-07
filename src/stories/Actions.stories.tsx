import type { Meta, StoryObj } from '@storybook/react-vite';
import { ActionWrapper } from '../Components/Actions/ActionElement';

const meta: Meta<typeof ActionWrapper> = {
  title: 'Utility/ActionWrapper',
  component: ActionWrapper,
  tags: ['autodocs'],
  args: {
    disabled:   false,
    defaultsTo: 'button',
  },
  argTypes: {
    link:           { control: 'text',    description: 'Renders as <Link> (internal) or <a> (external).' },
    isExternalLink: { control: 'boolean', description: 'Use plain <a href> instead of Next/Link.' },
    type:           { control: 'select',  options: ['button', 'submit'] },
    disabled:       { control: 'boolean' },
    defaultsTo:     { control: 'select',  options: ['div', 'span', 'button', 'empty'], description: 'Fallback element when no link/onClick.' },
    onClick:        { action: 'clicked' },
  },
};
export default meta;

type Story = StoryObj<typeof ActionWrapper>;

const boxStyle: React.CSSProperties = {
  display:       'inline-flex',
  alignItems:    'center',
  padding:       '0.5rem 1rem',
  borderRadius:  'var(--border-radius-small)',
  border:        '1px solid var(--color-border)',
  background:    'var(--color-surface)',
  color:         'var(--color-text)',
  cursor:        'pointer',
  userSelect:    'none',
};

export const AsButton: Story = {
  args: { defaultsTo: 'button' },
  render: (args) => (
    <ActionWrapper {...args} onClick={() => alert('Clicked!')}>
      <span style={boxStyle}>Click me (button)</span>
    </ActionWrapper>
  ),
};

export const AsExternalLink: Story = {
  name: 'As external link',
  args: { link: 'https://example.com', isExternalLink: true },
  render: (args) => (
    <ActionWrapper {...args}>
      <span style={boxStyle}>Open external link</span>
    </ActionWrapper>
  ),
};

export const AsDiv: Story = {
  args: { defaultsTo: 'div' },
  render: (args) => (
    <ActionWrapper {...args}>
      <span style={boxStyle}>Renders as &lt;div&gt;</span>
    </ActionWrapper>
  ),
};

export const AsSpan: Story = {
  args: { defaultsTo: 'span' },
  render: (args) => (
    <ActionWrapper {...args}>
      <span style={boxStyle}>Renders as &lt;span&gt;</span>
    </ActionWrapper>
  ),
};

export const AllVariants: Story = {
  name: 'All element types',
  render: () => (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
      <ActionWrapper defaultsTo="button" onClick={() => alert('button')}>
        <span style={boxStyle}>button</span>
      </ActionWrapper>
      <ActionWrapper defaultsTo="div">
        <span style={boxStyle}>div</span>
      </ActionWrapper>
      <ActionWrapper defaultsTo="span">
        <span style={boxStyle}>span</span>
      </ActionWrapper>
      <ActionWrapper link="https://example.com" isExternalLink>
        <span style={boxStyle}>external link</span>
      </ActionWrapper>
    </div>
  ),
};
