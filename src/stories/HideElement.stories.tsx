import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { HideElement } from '../Components/HideElement/HideElement';
import { Button } from '../Components/Button/Button';

const meta: Meta<typeof HideElement> = {
  title: 'Layout/HideElement',
  component: HideElement,
  tags: ['autodocs'],
  argTypes: {
    isHidden: { control: 'boolean' },
  },
};
export default meta;

export const Default: StoryObj = {
  render: () => {
    const [hidden, setHidden] = useState(false);
    return (
      <div>
        <Button text={hidden ? 'Show' : 'Hide'} onClick={() => setHidden((v) => !v)} color="primary" />
        <div style={{ marginTop: '1rem' }}>
          <HideElement isHidden={hidden}>
            <div style={{ padding: '1rem', background: 'var(--color-gray-100)', borderRadius: 4 }}>
              This content can be hidden
            </div>
          </HideElement>
        </div>
      </div>
    );
  },
};
