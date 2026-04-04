import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Tooltip, TooltipTrigger, TooltipContent } from '../Components/Tooltip/Tooltip';

const meta: Meta<typeof Tooltip> = {
  title: 'Overlay/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  argTypes: {
    placement: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right', 'top-start', 'top-end', 'bottom-start', 'bottom-end'],
    },
    initialOpen: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  args: { placement: 'top' },
  render: (args) => (
    <div style={{ padding: '4rem', display: 'flex', justifyContent: 'center' }}>
      <Tooltip {...args}>
        <TooltipTrigger>Hover me</TooltipTrigger>
        <TooltipContent>This is a tooltip</TooltipContent>
      </Tooltip>
    </div>
  ),
};

export const AllPlacements: Story = {
  render: () => (
    <div style={{ padding: '4rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
      {(['top', 'bottom', 'left', 'right'] as const).map((p) => (
        <Tooltip key={p} placement={p}>
          <TooltipTrigger>{p}</TooltipTrigger>
          <TooltipContent>Placement: {p}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  ),
};

export const LongContent: Story = {
  render: () => (
    <div style={{ padding: '4rem', display: 'flex', justifyContent: 'center' }}>
      <Tooltip>
        <TooltipTrigger>Info</TooltipTrigger>
        <TooltipContent>
          This tooltip contains a longer description that might wrap to multiple lines in certain scenarios.
        </TooltipContent>
      </Tooltip>
    </div>
  ),
};
