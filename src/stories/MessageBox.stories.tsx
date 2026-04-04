import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { MessageBox } from '../Components/MessageBox/MessageBox';
import type { Message } from '../Components/MessageBox/MessageBox.type';

const meta: Meta<typeof MessageBox> = {
  title: 'Feedback/MessageBox',
  component: MessageBox,
  tags: ['autodocs'],
};
export default meta;

const allMessages: Message[] = [
  { type: 'success', header: 'Saved!',   text: 'Your changes have been saved successfully.', closable: true },
  { type: 'error',   header: 'Error',    text: 'Something went wrong. Please try again.',     closable: true },
  { type: 'warning', header: 'Warning',  text: 'This action may have side effects.',           closable: true },
  { type: 'message', header: 'Info',     text: 'A new version is available.',                  closable: true },
];

export const AllTypes: StoryObj = {
  render: () => <MessageBox messages={allMessages} />,
};

export const SingleSuccess: StoryObj = {
  render: () => (
    <MessageBox messages={[{ type: 'success', header: 'Done!', text: 'Record created.', closable: true }]} />
  ),
};

export const SingleError: StoryObj = {
  render: () => (
    <MessageBox messages={[{ type: 'error', header: 'Failed', text: 'Could not connect to server.', closable: true }]} />
  ),
};
