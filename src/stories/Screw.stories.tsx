import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Screw } from '../Components/Screw/Screw';

const meta: Meta<typeof Screw> = {
  title: 'Layout/Screw',
  component: Screw,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xlg'] },
  },
  args: { size: 'md' },
};
export default meta;

export const Default: StoryObj = {
  render: (args) => (
    <div style={{ background: 'var(--color-gray-100)', padding: '1rem' }}>
      <div style={{ background: 'var(--color-gray-300)', padding: '0.5rem' }}>Block above</div>
      <Screw {...args} />
      <div style={{ background: 'var(--color-gray-300)', padding: '0.5rem' }}>Block below</div>
    </div>
  ),
};

export const AllSizes: StoryObj = {
  render: () => (
    <div style={{ background: 'var(--color-gray-100)', padding: '1rem' }}>
      {(['xs', 'sm', 'md', 'lg', 'xlg'] as const).map((size) => (
        <div key={size}>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)' }}>{size}</span>
          <Screw size={size} />
          <div style={{ background: 'var(--color-gray-300)', padding: '0.25rem', fontSize: '0.75rem' }}>divider</div>
        </div>
      ))}
    </div>
  ),
};
