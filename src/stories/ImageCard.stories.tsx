import type { Meta, StoryObj } from '@storybook/react';
import { ImageCard } from '../Components/ImageCard/ImageCard';

const meta: Meta<typeof ImageCard> = {
  title: 'Layout/ImageCard',
  component: ImageCard,
  tags: ['autodocs'],
  argTypes: {
    title:    { control: 'text' },
    subtitle: { control: 'text' },
    src:      { control: 'text' },
    alt:      { control: 'text' },
  },
  args: {
    title:    'Image Card',
    subtitle: 'Optional subtitle',
    src:      'https://placehold.co/400x200',
    alt:      'Placeholder image',
  },
};
export default meta;

export const Default: StoryObj = {};
