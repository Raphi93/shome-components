import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { AppLayout } from '../Components/AppLayout/AppLayout';
import type { NavigationItem } from '../types';

const NAV: NavigationItem[] = [
  { name: 'Dashboard',  link: '/',          icon: 'grid-outline',   isFontAwesome: false },
  { name: 'Customers',  link: '/customers', icon: 'people-outline',  isFontAwesome: false, children: [
    { name: 'All customers', link: '/customers/all' },
    { name: 'New customer',  link: '/customers/new' },
  ]},
  { name: 'Orders',     link: '/orders',    icon: 'list-outline',    isFontAwesome: false },
  { name: 'Reports',    link: '/reports',   icon: 'stats-chart-outline', isFontAwesome: false },
  { name: 'Settings',   link: '/settings',  icon: 'settings-outline', isFontAwesome: false },
];

const meta: Meta = {
  title: 'Layout/AppLayout',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  name: 'Full app layout',
  render: () => {
    const [expanded, setExpanded] = useState(true);
    return (
      <div style={{ height: '100vh' }}>
        <AppLayout
          title="My Application"
          menu={NAV}
          showSidebar
          showHeader
          expanded={expanded}
          setExpanded={setExpanded}
          isMobile={false}
          image=""
          imageLong=""
          handleImageClick={() => undefined}
          upperComponent={null}
        >
          <div style={{ padding: '2rem' }}>
            <h1 style={{ margin: '0 0 1rem', fontSize: '1.5rem' }}>Dashboard</h1>
            <p style={{ opacity: 0.7 }}>Main content area. The sidebar is {expanded ? 'open' : 'collapsed'}.</p>
          </div>
        </AppLayout>
      </div>
    );
  },
};

export const Collapsed: Story = {
  name: 'Sidebar collapsed',
  render: () => {
    const [expanded, setExpanded] = useState(false);
    return (
      <div style={{ height: '100vh' }}>
        <AppLayout
          title="My Application"
          menu={NAV}
          showSidebar
          showHeader
          expanded={expanded}
          setExpanded={setExpanded}
          isMobile={false}
          image=""
          imageLong=""
          handleImageClick={() => undefined}
          upperComponent={null}
        >
          <div style={{ padding: '2rem' }}>
            <p style={{ opacity: 0.7 }}>Sidebar is collapsed. Click the toggle to expand.</p>
          </div>
        </AppLayout>
      </div>
    );
  },
};

export const NoSidebar: Story = {
  name: 'Without sidebar',
  render: () => (
    <div style={{ height: '100vh' }}>
      <AppLayout
        title="Standalone Page"
        menu={[]}
        showSidebar={false}
        showHeader
        expanded={false}
        setExpanded={() => undefined}
        isMobile={false}
        image=""
        imageLong=""
        handleImageClick={() => undefined}
        upperComponent={null}
      >
        <div style={{ padding: '2rem' }}>
          <p style={{ opacity: 0.7 }}>No sidebar on this page.</p>
        </div>
      </AppLayout>
    </div>
  ),
};
