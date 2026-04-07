import type { Meta, StoryObj } from '@storybook/react-vite';
import { Header } from '../Components/Header/Header';
import { Button } from '../Components/Button/Button';
import { faBell, faGear } from '@fortawesome/free-solid-svg-icons';

const meta: Meta<typeof Header> = {
  title: 'Navigation/Header',
  component: Header,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: {
    title:     'Application Title',
    subtitle:  '',
    envTitle:  '',
    isMobile:  false,
    noSidebar: false,
    brandName: '',
  },
  argTypes: {
    title:     { control: 'text' },
    subtitle:  { control: 'text',    description: 'Secondary line below the title.' },
    envTitle:  { control: 'text',    description: 'Environment badge, e.g. "DEV", "STAGING".' },
    isMobile:  { control: 'boolean', description: 'Compact mobile layout.' },
    noSidebar: { control: 'boolean', description: 'Hide the sidebar toggle button.' },
    brandName: { control: 'text',    description: 'Brand/company name shown in the header.' },
  },
};
export default meta;

type Story = StoryObj<typeof Header>;

export const Default: Story = {};

export const WithSubtitle: Story = {
  args: { title: 'Customer Management', subtitle: 'Manage all registered customers' },
};

export const WithEnvironment: Story = {
  args: { title: 'CRM System', envTitle: 'STAGING', subtitle: 'Customer Relationship Management' },
};

export const WithActions: Story = {
  name: 'With action buttons',
  args: {
    title: 'Dashboard',
    buttons: (
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <Button icon={faBell} color="primary" isLightColor tooltip="Notifications" />
        <Button icon={faGear}  color="primary" isLightColor tooltip="Settings" />
      </div>
    ),
  },
};

export const Mobile: Story = {
  args: { title: 'Mobile View', isMobile: true },
};

export const NoSidebar: Story = {
  args: { title: 'Standalone page', noSidebar: true },
};
