import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Breadcrumbs } from '../Components/Breadcrumbs/Breadcrumbs';

const meta: Meta<typeof Breadcrumbs> = {
  title: 'Navigation/Breadcrumbs',
  component: Breadcrumbs,
  tags: ['autodocs'],
};
export default meta;

export const Default: StoryObj = {
  render: () => (
    <Breadcrumbs
      items={[
        { name: 'Home',      link: '/' },
        { name: 'Customers', link: '/customers' },
        { name: 'Detail' },
      ]}
    />
  ),
};

export const SingleLevel: StoryObj = {
  render: () => <Breadcrumbs items={[{ name: 'Dashboard' }]} />,
};

export const DeepPath: StoryObj = {
  render: () => (
    <Breadcrumbs
      items={[
        { name: 'Home',     link: '/' },
        { name: 'Settings', link: '/settings' },
        { name: 'Users',    link: '/settings/users' },
        { name: 'Roles',    link: '/settings/users/roles' },
        { name: 'Editor' },
      ]}
    />
  ),
};
