import type { Meta, StoryObj } from '@storybook/react-vite';
import { Spinner } from '../Components/Spinner/Spinner';

const meta: Meta<typeof Spinner> = {
  title: 'Feedback/Spinner',
  component: Spinner,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Spinner>;

export const Default: Story = {};

export const InContext: Story = {
  name: 'Inside a loading container',
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200, background: 'var(--color-surface)', borderRadius: 'var(--border-radius)', border: '1px solid var(--color-border)' }}>
      <Spinner />
    </div>
  ),
};

export const MultipleSpinners: Story = {
  name: 'Multiple sizes (via scale)',
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
      {[0.5, 0.75, 1, 1.5, 2].map((scale) => (
        <div key={scale} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}>
            <Spinner />
          </div>
          <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>×{scale}</span>
        </div>
      ))}
    </div>
  ),
};
