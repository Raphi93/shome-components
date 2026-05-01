import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import {
  faTriangleExclamation, faTrash, faCircleInfo, faCircleCheck,
} from '@fortawesome/free-solid-svg-icons';
import { Alert } from '../Components/Alert/Alert';
import { Button } from '../Components/Button/Button';

const meta: Meta<typeof Alert> = {
  title: 'Feedback/Alert',
  component: Alert,
  tags: ['autodocs'],
  args: {
    title:         'Confirm action',
    text:          'Are you sure you want to proceed? This cannot be undone.',
    confirmTitlle: 'Confirm',
    cancelTitle:   'Cancel',
    isOkDisabled:  false,
  },
  argTypes: {
    title:         { control: 'text' },
    text:          { control: 'text' },
    confirmTitlle: { control: 'text', description: 'Confirm button label (note: double-l is the prop name).' },
    cancelTitle:   { control: 'text' },
    color:         { control: 'text', description: 'CSS colour applied to the icon / accent.' },
    isOkDisabled:  { control: 'boolean', description: 'Disable the confirm button.' },
    confirmButtonHandler: { action: 'confirmed' },
  },
};
export default meta;

type Story = StoryObj<typeof Alert>;

const Trigger = ({ label, color, onClick }: { label: string; color?: string; onClick: () => void }) => (
  <Button text={label} color={color as any ?? 'primary'} onClick={onClick} />
);

export const Default: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Trigger label="Open dialog" onClick={() => setOpen(true)} />
        <Alert {...args} isOpened={open} setIsOpened={setOpen} />
      </>
    );
  },
};

export const DeleteConfirmation: Story = {
  name: 'Delete confirmation',
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Trigger label="Delete record" color="danger" onClick={() => setOpen(true)} />
        <Alert
          isOpened={open}
          setIsOpened={setOpen}
          title="Delete record?"
          text="Record #42 will be permanently deleted. This action cannot be reversed."
          icon={faTrash}
          color="danger"
          confirmTitlle="Yes, delete"
          cancelTitle="Cancel"
          confirmButtonHandler={() => console.log('deleted')}
        />
      </>
    );
  },
};

export const Warning: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Trigger label="Leave page?" color="warning" onClick={() => setOpen(true)} />
        <Alert
          isOpened={open}
          setIsOpened={setOpen}
          title="Unsaved changes"
          text="You have unsaved changes that will be lost if you leave this page."
          icon={faTriangleExclamation}
          color="warning"
          confirmTitlle="Leave anyway"
          cancelTitle="Stay"
        />
      </>
    );
  },
};

export const Success: Story = {
  name: 'Success / info dialog',
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Trigger label="Show info" color="success" onClick={() => setOpen(true)} />
        <Alert
          isOpened={open}
          setIsOpened={setOpen}
          title="Export complete"
          text="Your data has been exported to Excel. Check your downloads folder."
          icon={faCircleCheck}
          color="success"
          confirmTitlle="Done"
          cancelTitle=""
        />
      </>
    );
  },
};

export const DisabledConfirm: Story = {
  name: 'Confirm button disabled',
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Trigger label="Open (confirm disabled)" onClick={() => setOpen(true)} />
        <Alert
          isOpened={open}
          setIsOpened={setOpen}
          title="Processing…"
          text="Please wait while the operation completes."
          icon={faCircleInfo}
          confirmTitlle="OK"
          isOkDisabled
        />
      </>
    );
  },
};

export const Interactive: Story = {
  name: 'Interactive (tracks result)',
  render: () => {
    const [open, setOpen] = useState(false);
    const [result, setResult] = useState<string>('–');
    return (
      <div style={{ padding: '1rem' }}>
        <Trigger label="Open dialog" onClick={() => setOpen(true)} />
        <p style={{ marginTop: '0.75rem', fontSize: '0.875rem' }}>
          Last action: <strong>{result}</strong>
        </p>
        <Alert
          isOpened={open}
          setIsOpened={setOpen}
          title="Confirm action"
          text="Do you want to proceed with this operation?"
          icon={faTriangleExclamation}
          confirmTitlle="Yes, proceed"
          cancelTitle="No, cancel"
          confirmButtonHandler={() => { setResult('Confirmed'); setOpen(false); }}
          cancelButtonHandler={() => { setResult('Cancelled'); setOpen(false); }}
        />
      </div>
    );
  },
};

export const Closed: Story = {
  render: args => (
    <div style={{ padding: '1rem', maxWidth: '420px' }}>
      <p style={{ fontSize: '0.875rem', color: '#666' }}>
        Alert is currently closed. Set <code>isOpened</code> to true in the Controls panel.
      </p>
      <Alert {...args} isOpened={false} setIsOpened={() => undefined} />
    </div>
  ),
};
