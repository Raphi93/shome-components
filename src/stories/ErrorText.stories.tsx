import type { Meta, StoryObj } from '@storybook/react-vite';
import { ErrorText } from '../Components/ErrorText/ErrorText';

const meta: Meta<typeof ErrorText> = {
  title: 'Feedback/ErrorText',
  component: ErrorText,
  tags: ['autodocs'],
  args: {
    errorMessage: 'This field is required.',
  },
  argTypes: {
    errorMessage: { control: 'text', description: 'Validation error message to display.' },
  },
};
export default meta;

type Story = StoryObj<typeof ErrorText>;

export const Default: Story = {};

export const LongMessage: Story = {
  args: { errorMessage: 'The value you entered does not match the expected format. Please use DD.MM.YYYY.' },
};

export const Empty: Story = {
  name: 'No message (hidden)',
  args: { errorMessage: undefined },
};

export const AllExamples: Story = {
  name: 'Common error messages',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <ErrorText errorMessage="This field is required." />
      <ErrorText errorMessage="Invalid email address." />
      <ErrorText errorMessage="Password must be at least 8 characters." />
      <ErrorText errorMessage="Value must be between 1 and 100." />
    </div>
  ),
};
