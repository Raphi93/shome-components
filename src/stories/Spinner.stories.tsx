import type { Meta, StoryObj } from '@storybook/react';
import { Spinner } from '../Components/Spinner/Spinner';

const meta: Meta<typeof Spinner> = {
  title: 'Feedback/Spinner',
  component: Spinner,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Spinner>;

export const Default: Story = {};
