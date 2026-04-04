import type { Meta, StoryObj } from '@storybook/react';
import { ErrorText } from '../Components/ErrorText/ErrorText';

const meta: Meta<typeof ErrorText> = {
  title: 'Inputs/ErrorText',
  component: ErrorText,
  tags: ['autodocs'],
  argTypes: {
    errorMessage: { control: 'text' },
  },
};
export default meta;

export const Default: StoryObj = {
  args: { errorMessage: 'This field is required.' },
};

export const LongMessage: StoryObj = {
  args: { errorMessage: 'The value you entered is not a valid email address. Please check and try again.' },
};

export const NoError: StoryObj = {
  args: { errorMessage: undefined },
  name: 'No error (renders nothing)',
};
