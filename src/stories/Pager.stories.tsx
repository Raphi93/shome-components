import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Pager } from '../Components/Pager/Pager';

const meta: Meta<typeof Pager> = {
  title: 'Navigation/Pager',
  component: Pager,
  tags: ['autodocs'],
  argTypes: {
    entryCount:           { control: 'number' },
    maximumButtonCount:   { control: 'number' },
    isCompactPagination:  { control: 'boolean' },
    paginationInfoFormat: { control: 'select', options: ['both', 'pages', 'items', 'none'] },
  },
  args: {
    entryCount: 250,
    maximumButtonCount: 10,
    isCompactPagination: false,
    paginationInfoFormat: 'both',
  },
};
export default meta;

type Story = StoryObj<typeof Pager>;

export const Default: Story = {
  render: (args) => {
    const [page, setPage] = useState(1);
    return (
      <Pager
        {...args}
        pageNumber={page}
        pageSize={25}
        onPagination={setPage}
        isConnected={false}
      />
    );
  },
};

export const Compact: Story = {
  args: { isCompactPagination: true },
  render: (args) => {
    const [page, setPage] = useState(1);
    return (
      <Pager
        {...args}
        pageNumber={page}
        pageSize={25}
        onPagination={setPage}
        isConnected={false}
      />
    );
  },
};

export const FewPages: Story = {
  args: { entryCount: 30 },
  render: (args) => {
    const [page, setPage] = useState(1);
    return (
      <Pager
        {...args}
        pageNumber={page}
        pageSize={25}
        onPagination={setPage}
        isConnected={false}
      />
    );
  },
};
