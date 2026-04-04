import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Cards } from '../Components/Cards/Cards';

const meta: Meta<typeof Cards> = {
  title: 'Layout/Cards',
  component: Cards,
  tags: ['autodocs'],
  argTypes: {
    title:       { control: 'text' },
    description: { control: 'text' },
  },
};
export default meta;

type Story = StoryObj<typeof Cards>;

export const Default: Story = {
  args: { title: 'Card Title', description: 'A short description of the card content.' },
};

export const WithChildren: Story = {
  render: () => (
    <Cards title="Stats">
      <div style={{ fontSize: '2rem', fontWeight: 700 }}>1,234</div>
      <div style={{ color: 'var(--color-gray-500)', fontSize: '0.85rem' }}>Total records</div>
    </Cards>
  ),
};

export const Grid3Columns: Story = {
  name: '3-column card grid',
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
      {['Users', 'Orders', 'Revenue'].map((title, i) => (
        <Cards key={title} title={title}>
          <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{(i + 1) * 123}</div>
        </Cards>
      ))}
    </div>
  ),
};
