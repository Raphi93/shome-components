import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { faTriangleExclamation, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Alert } from '../Components/Alert/Alert';
import { Button } from '../Components/Button/Button';

const meta: Meta<typeof Alert> = {
  title: 'Feedback/Alert',
  component: Alert,
  tags: ['autodocs'],
  argTypes: {
    title:          { control: 'text' },
    text:           { control: 'text' },
    confirmTitlle:  { control: 'text' },
    cancelTitle:    { control: 'text' },
    color:          { control: 'text' },
    isOkDisabled:   { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<typeof Alert>;

/** Interactive demo — click the button to open the alert */
export const Default: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button text="Open Alert" color="primary" onClick={() => setOpen(true)} />
        <Alert
          {...args}
          isOpened={open}
          setIsOpened={setOpen}
          title="Are you sure?"
          text="This action cannot be undone."
        />
      </>
    );
  },
};

/** Warning style with triangle icon */
export const Warning: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button text="Open Warning" color="warning" onClick={() => setOpen(true)} />
        <Alert
          isOpened={open}
          setIsOpened={setOpen}
          title="Warning"
          text="You are about to leave unsaved changes."
          icon={faTriangleExclamation}
          color="warning"
          confirmTitlle="Leave anyway"
          cancelTitle="Stay"
        />
      </>
    );
  },
};

/** Delete confirmation */
export const DeleteConfirm: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button text="Delete" color="danger" icon={faTrash} onClick={() => setOpen(true)} />
        <Alert
          isOpened={open}
          setIsOpened={setOpen}
          title="Delete record?"
          text="Record ID #42 will be permanently removed."
          icon={faTrash}
          color="danger"
          confirmTitlle="Delete"
          confirmButtonHandler={() => console.log('deleted')}
        />
      </>
    );
  },
};
