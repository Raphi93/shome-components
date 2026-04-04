import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { AppToggleActive } from '../Components/AppToggleActive/AppToggleActive';

const meta: Meta<typeof AppToggleActive> = {
  title: 'Inputs/Toggle',
  component: AppToggleActive,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    label:    { control: 'text' },
  },
  args: {
    disabled: false,
  },
};
export default meta;

type Story = StoryObj<typeof AppToggleActive>;

export const Default: Story = {
  render: (args) => {
    const [active, setActive] = useState(false);
    return (
      <AppToggleActive
        {...args}
        isActive={active}
        onChange={() => setActive((v) => !v)}
        label={active ? 'Active' : 'Inactive'}
      />
    );
  },
};

export const ActiveByDefault: Story = {
  render: (args) => {
    const [active, setActive] = useState(true);
    return (
      <AppToggleActive
        {...args}
        isActive={active}
        onChange={() => setActive((v) => !v)}
        label={active ? 'Active' : 'Inactive'}
      />
    );
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <AppToggleActive {...args} isActive={false} onChange={() => {}} label="Locked" />
  ),
};
