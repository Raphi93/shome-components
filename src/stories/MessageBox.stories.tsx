import type { Meta, StoryObj } from '@storybook/react-vite';
import { MessageBox } from '../Components/MessageBox/MessageBox';
import type { NotificationType } from '../Components/MessageBox/MessageBox.type';

const TYPES: NotificationType[] = ['success', 'message', 'warning', 'error'];

const meta: Meta<typeof MessageBox> = {
  title: 'Feedback/MessageBox',
  component: MessageBox,
  tags: ['autodocs'],
  args: {
    type:     'message',
    header:   'Info',
    text:     'This is an informational notification.',
    closable: true,
  },
  argTypes: {
    type: {
      control: 'select',
      options: TYPES,
      description: 'Controls the colour and icon.',
    },
    header:   { control: 'text' },
    text:     { control: 'text' },
    closable: { control: 'boolean', description: 'Show a close (×) button.' },
    onClose:  { action: 'closed' },
  },
};
export default meta;

type Story = StoryObj<typeof MessageBox>;

export const Default: Story = {};

export const Success: Story = {
  args: { type: 'success', header: 'Saved!', text: 'Your changes have been saved successfully.' },
};

export const Warning: Story = {
  args: { type: 'warning', header: 'Attention', text: 'This action cannot be undone.' },
};

export const Error: Story = {
  args: { type: 'error', header: 'Something went wrong', text: 'An unexpected error occurred. Please try again later.' },
};

export const NotClosable: Story = {
  args: { type: 'error', header: 'Session expired', text: 'Please log in again.', closable: false },
};

export const WithLink: Story = {
  args: {
    type:       'message',
    header:     'New version available',
    text:       'A new version is ready to install.',
    headerLink: 'https://example.com/changelog',
    closable:   true,
  },
};

export const AllTypes: Story = {
  name: 'All notification types',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <MessageBox type="success" header="Success"     text="Record saved."                   closable />
      <MessageBox type="message" header="Info"        text="New features are available."     closable />
      <MessageBox type="warning" header="Warning"     text="Storage is almost full."         closable />
      <MessageBox type="error"   header="Error"       text="Connection to server failed."    closable />
    </div>
  ),
};
