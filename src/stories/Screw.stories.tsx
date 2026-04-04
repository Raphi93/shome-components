import type { Meta, StoryObj } from '@storybook/react-vite';
import { Screw, ScrewCircle } from '../Components/Screw/Screw';
import type { ScrewSize } from '../Components/Screw/Screw';

const SIZES: ScrewSize[] = ['xs', 'sm', 'md', 'lg', 'xlg'];

const meta: Meta<typeof Screw> = {
  title: 'Utility/Screw',
  component: Screw,
  tags: ['autodocs'],
  args: {
    size: 'md',
  },
  argTypes: {
    size: {
      control: 'select',
      options: SIZES,
      description: 'Decorative screw head size.',
    },
  },
};
export default meta;

type Story = StoryObj<typeof Screw>;

export const Default: Story = {};

export const AllSizes: Story = {
  name: 'All sizes',
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
      {SIZES.map((size) => (
        <div key={size} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
          <Screw size={size} />
          <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>{size}</span>
        </div>
      ))}
    </div>
  ),
};

export const ScrewCircleVariant: Story = {
  name: 'ScrewCircle variant',
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
      {SIZES.map((size) => (
        <div key={size} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
          <ScrewCircle size={size} />
          <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>{size}</span>
        </div>
      ))}
    </div>
  ),
};

export const CornerDecoration: Story = {
  name: 'Panel corner decoration',
  render: () => (
    <div style={{ position: 'relative', padding: '2rem', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--border-radius)', maxWidth: 320 }}>
      <div style={{ position: 'absolute', top: 8,  left: 8  }}><Screw size="sm" /></div>
      <div style={{ position: 'absolute', top: 8,  right: 8 }}><Screw size="sm" /></div>
      <div style={{ position: 'absolute', bottom: 8, left: 8  }}><Screw size="sm" /></div>
      <div style={{ position: 'absolute', bottom: 8, right: 8 }}><Screw size="sm" /></div>
      <p style={{ margin: 0, textAlign: 'center' }}>Panel with screw corners</p>
    </div>
  ),
};
