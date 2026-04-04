import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Header } from '../Components/Header/Header';
import { Button } from '../Components/Button/Button';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const meta: Meta<typeof Header> = {
  title: 'Layout/Header',
  component: Header,
  tags: ['autodocs'],
  argTypes: {
    title:     { control: 'text' },
    subtitle:  { control: 'text' },
    envTitle:  { control: 'text' },
    noSidebar: { control: 'boolean' },
    isMobile:  { control: 'boolean' },
  },
  args: {
    title: 'Page Title',
    subtitle: '',
    noSidebar: true,
    isMobile: false,
  },
};
export default meta;

type Story = StoryObj<typeof Header>;

export const Default: Story = {};

export const WithSubtitle: Story = {
  args: { title: 'Customers', subtitle: '1,234 records' },
};

export const WithButtons: Story = {
  args: { title: 'Products' },
  render: (args) => (
    <Header {...args} buttons={<Button text="New Product" icon={faPlus} color="primary" />} />
  ),
};

export const WithEnvBadge: Story = {
  args: { title: 'Dashboard', envTitle: 'DEV' },
};
