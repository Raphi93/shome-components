import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { AppMessageBox } from '../Components/AppMessageBox/AppMessageBox';
import { Button } from '../Components/Button/Button';
import type { NotificationType } from '../Components/MessageBox/MessageBox.type';

const TYPES: NotificationType[] = ['success', 'message', 'warning', 'error'];

const meta: Meta = {
  title: 'Feedback/AppMessageBox',
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj;

export const Interactive: Story = {
  name: 'Interactive (auto-dismiss)',
  render: () => {
    const [type,    setType]    = useState<NotificationType>('success');
    const [visible, setVisible] = useState(false);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {TYPES.map((t) => (
            <Button
              key={t}
              text={t}
              color={t === 'error' ? 'danger' : t === 'warning' ? 'warning' : t === 'success' ? 'success' : 'info'}
              onClick={() => { setType(t); setVisible(true); }}
            />
          ))}
        </div>
        {visible && (
          <AppMessageBox
            type={type}
            header={`${type.charAt(0).toUpperCase() + type.slice(1)} notification`}
            text="This is an application-level notification that auto-dismisses after 5 seconds."
            closable
            hideTimeout={5000}
            setMessage={() => setVisible(false)}
          />
        )}
      </div>
    );
  },
};

export const Success: Story = {
  render: () => (
    <AppMessageBox
      type="success"
      header="Saved!"
      text="Your changes have been saved successfully."
      closable
      hideTimeout={0}
    />
  ),
};

export const Error: Story = {
  render: () => (
    <AppMessageBox
      type="error"
      header="Request failed"
      text="Could not connect to the server. Please check your connection and try again."
      closable={false}
      hideTimeout={0}
    />
  ),
};

export const Warning: Story = {
  render: () => (
    <AppMessageBox
      type="warning"
      header="Session expiring"
      text="Your session will expire in 5 minutes. Please save your work."
      closable
      hideTimeout={0}
    />
  ),
};
