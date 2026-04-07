import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Sidebar } from '../Components/Sidebar/Sidebar';
import type { NavigationItem } from '../types';

const NAV: NavigationItem[] = [
  { name: 'Dashboard',     link: '/',                 isFontAwesome: false, icon: 'grid-outline'        },
  { name: 'Customers',     link: '/customers',        isFontAwesome: false, icon: 'people-outline',
    children: [
      { name: 'All customers', link: '/customers/all' },
      { name: 'New customer',  link: '/customers/new' },
    ],
  },
  { name: 'Orders',        link: '/orders',           isFontAwesome: false, icon: 'list-outline'        },
  { name: 'Products',      link: '/products',         isFontAwesome: false, icon: 'cube-outline'        },
  { name: 'Reports',       link: '/reports',          isFontAwesome: false, icon: 'stats-chart-outline' },
  { name: 'Settings',      link: '/settings',         isFontAwesome: false, icon: 'settings-outline'   },
];

const meta: Meta = {
  title: 'Navigation/Sidebar',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj;

const Wrapper = ({ expanded: init = true, isMobile = false }: { expanded?: boolean; isMobile?: boolean }) => {
  const [expanded, setExpanded] = useState(init);
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar
        menu={NAV}
        expanded={expanded}
        setExpanded={setExpanded}
        isMobile={isMobile}
        reset={false}
        image=""
        imageLong=""
        handleImageClick={() => undefined}
        envTitle=""
      />
      <div style={{ flex: 1, padding: '2rem', background: 'var(--color-background)', overflow: 'auto' }}>
        <h2 style={{ margin: 0 }}>Content area</h2>
        <p style={{ opacity: 0.6, marginTop: '0.5rem' }}>Sidebar is <strong>{expanded ? 'expanded' : 'collapsed'}</strong>.</p>
        <button
          onClick={() => setExpanded((e) => !e)}
          style={{ marginTop: '1rem', padding: '0.5rem 1rem', borderRadius: 4, border: '1px solid var(--color-border)', cursor: 'pointer', background: 'var(--color-surface)', color: 'var(--color-text)' }}
        >
          Toggle sidebar
        </button>
      </div>
    </div>
  );
};

export const Expanded: Story = {
  name: 'Expanded (desktop)',
  render: () => <Wrapper expanded isMobile={false} />,
};

export const Collapsed: Story = {
  name: 'Collapsed (desktop)',
  render: () => <Wrapper expanded={false} isMobile={false} />,
};

export const MobileView: Story = {
  name: 'Mobile overlay',
  render: () => <Wrapper expanded isMobile />,
};
