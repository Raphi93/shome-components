import type { Meta, StoryObj } from '@storybook/react-vite';
import { HideElement } from '../Components/HideElement/HideElement';

const meta: Meta<typeof HideElement> = {
  title: 'Utility/HideElement',
  component: HideElement,
  tags: ['autodocs'],
  args: {
    hideElement: 'mobile',
  },
  argTypes: {
    hideElement: {
      control: 'select',
      options: ['mobile', 'tablet'],
      description: 'Break-point below which the children are hidden. Resize the browser to test.',
    },
  },
};
export default meta;

type Story = StoryObj<typeof HideElement>;

const DemoBox = ({ label }: { label: string }) => (
  <div style={{ padding: '1.5rem', background: 'var(--color-surface)', border: '1px dashed var(--color-border)', borderRadius: 'var(--border-radius)', textAlign: 'center' }}>
    {label}
  </div>
);

export const HideOnMobile: Story = {
  name: 'Hide on mobile',
  args: { hideElement: 'mobile' },
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.7 }}>↑ Always visible ↑</p>
      <DemoBox label="Always visible" />
      <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.7 }}>↓ Hidden on mobile (&lt;768 px) ↓</p>
      <HideElement {...args}>
        <DemoBox label="Hidden on mobile screens" />
      </HideElement>
    </div>
  ),
};

export const HideOnTablet: Story = {
  name: 'Hide on tablet',
  args: { hideElement: 'tablet' },
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <DemoBox label="Always visible" />
      <HideElement {...args}>
        <DemoBox label="Hidden on tablet &amp; mobile screens" />
      </HideElement>
    </div>
  ),
};
