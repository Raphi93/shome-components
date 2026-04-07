import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tooltip, TooltipTrigger, TooltipContent } from '../Components/Tooltip/Tooltip';

const PLACEMENTS = [
  'top', 'top-start', 'top-end',
  'bottom', 'bottom-start', 'bottom-end',
  'left', 'left-start', 'left-end',
  'right', 'right-start', 'right-end',
] as const;

const meta: Meta = {
  title: 'Feedback/Tooltip',
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj;

const TriggerButton = ({ label = 'Hover me' }: { label?: string }) => (
  <button style={{ padding: '0.5rem 1rem', borderRadius: 'var(--border-radius-small)', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text)', cursor: 'pointer' }}>
    {label}
  </button>
);

export const Default: Story = {
  render: () => (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
      <Tooltip>
        <TooltipTrigger asChild>
          <TriggerButton />
        </TooltipTrigger>
        <TooltipContent>This is a tooltip</TooltipContent>
      </Tooltip>
    </div>
  ),
};

export const AllPlacements: Story = {
  name: 'All placements',
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', padding: '3rem', justifyContent: 'center' }}>
      {PLACEMENTS.map((placement) => (
        <Tooltip key={placement} placement={placement}>
          <TooltipTrigger asChild>
            <TriggerButton label={placement} />
          </TooltipTrigger>
          <TooltipContent>{placement}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  ),
};

export const LongContent: Story = {
  name: 'Long tooltip content',
  render: () => (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
      <Tooltip placement="bottom">
        <TooltipTrigger asChild>
          <TriggerButton label="More info" />
        </TooltipTrigger>
        <TooltipContent>
          This is a longer tooltip that provides detailed context about the action. Use tooltips sparingly.
        </TooltipContent>
      </Tooltip>
    </div>
  ),
};

export const InitiallyOpen: Story = {
  name: 'Initially open',
  render: () => (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
      <Tooltip initialOpen>
        <TooltipTrigger asChild>
          <TriggerButton label="Open on mount" />
        </TooltipTrigger>
        <TooltipContent>Visible by default</TooltipContent>
      </Tooltip>
    </div>
  ),
};
