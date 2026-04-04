import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { AppLayout } from '../Components/AppLayout/AppLayout';
import type { NavigationItem } from '../types';

const MENU: NavigationItem[] = [
  { id: 1, label: 'Dashboard', path: '/',          icon: 'house'    },
  { id: 2, label: 'Customers', path: '/customers', icon: 'users'    },
  { id: 3, label: 'Products',  path: '/products',  icon: 'box'      },
  { id: 4, label: 'Settings',  path: '/settings',  icon: 'gear'     },
];

const meta: Meta<typeof AppLayout> = {
  title: 'Layout/AppLayout',
  component: AppLayout,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};
export default meta;

export const Default: StoryObj = {
  render: () => {
    const [expanded, setExpanded] = useState(true);
    return (
      <AppLayout
        title="My CRM"
        menu={MENU}
        showSidebar
        showHeader
        isMobile={false}
        expanded={expanded}
        setExpanded={setExpanded}
        image=""
        imageLong=""
        handleImageClick={() => {}}
        upperComponent={null}
      >
        <div style={{ padding: '2rem' }}>
          <h1>Page content goes here</h1>
          <p>The sidebar and header are rendered by AppLayout.</p>
        </div>
      </AppLayout>
    );
  },
};

export const Mobile: StoryObj = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => {
    const [expanded, setExpanded] = useState(false);
    return (
      <AppLayout
        title="My CRM"
        menu={MENU}
        showSidebar
        showHeader
        isMobile={true}
        expanded={expanded}
        setExpanded={setExpanded}
        image=""
        imageLong=""
        handleImageClick={() => {}}
        upperComponent={null}
      >
        <div style={{ padding: '1rem' }}>
          <p>Mobile layout</p>
        </div>
      </AppLayout>
    );
  },
};
