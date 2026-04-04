import type { Meta, StoryObj } from '@storybook/react-vite';
import { Breadcrumbs } from '../Components/Breadcrumbs/Breadcrumbs';
import type { BreadCrumb } from '../Components/Breadcrumbs/Breadcrumbs';

const meta: Meta<typeof Breadcrumbs> = {
  title: 'Navigation/Breadcrumbs',
  component: Breadcrumbs,
  tags: ['autodocs'],
  args: {
    crumbs: [
      { name: 'Home',     link: '/' },
      { name: 'Products', link: '/products' },
      { name: 'Details' },
    ],
  },
  argTypes: {
    crumbs: {
      control: 'object',
      description: 'Array of { name, link? }. The last item is the current page (no link needed).',
    },
  },
};
export default meta;

type Story = StoryObj<typeof Breadcrumbs>;

export const Default: Story = {};

export const TwoLevels: Story = {
  args: {
    crumbs: [
      { name: 'Dashboard', link: '/' },
      { name: 'Users' },
    ] as BreadCrumb[],
  },
};

export const FourLevels: Story = {
  name: 'Four levels deep',
  args: {
    crumbs: [
      { name: 'Home',           link: '/' },
      { name: 'Administration', link: '/admin' },
      { name: 'Users',          link: '/admin/users' },
      { name: 'Edit user' },
    ] as BreadCrumb[],
  },
};

export const RootOnly: Story = {
  name: 'Root page only',
  args: { crumbs: [{ name: 'Dashboard' }] as BreadCrumb[] },
};
