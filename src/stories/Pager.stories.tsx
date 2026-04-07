import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Pager, SUPPORTED_PAGE_SIZES } from '../Components/Pager/Pager';

const meta: Meta<typeof Pager> = {
  title: 'Navigation/Pager',
  component: Pager,
  tags: ['autodocs'],
  args: {
    entryCount:           120,
    pageNumber:           1,
    pageSize:             25,
    maximumButtonCount:   10,
    paginationInfoFormat: 'both',
    isCompactPagination:  false,
  },
  argTypes: {
    entryCount: {
      control: 'number',
      description: 'Total number of records (used to compute page count).',
    },
    pageNumber: { control: 'number', min: 1 },
    pageSize: {
      control: 'select',
      options: SUPPORTED_PAGE_SIZES,
    },
    maximumButtonCount:   { control: 'number', min: 3, max: 20 },
    paginationInfoFormat: {
      control: 'select',
      options: ['both', 'pages', 'items', 'none'],
      description: 'Which counts to display alongside the buttons.',
    },
    isCompactPagination: { control: 'boolean', description: 'Reduce button padding.' },
    onPagination:        { action: 'pageChanged' },
    onPageSizeChange:    { action: 'pageSizeChanged' },
  },
};
export default meta;

type Story = StoryObj<typeof Pager>;

export const Default: Story = {};

export const Controlled: Story = {
  name: 'Controlled (interactive)',
  render: () => {
    const [page, setPage]       = useState(1);
    const [size, setSize]       = useState(25);
    const total                 = 348;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ padding: '1rem', background: 'var(--color-surface)', borderRadius: 'var(--border-radius)', fontSize: '0.85rem' }}>
          Page <strong>{page}</strong> of <strong>{Math.ceil(total / size)}</strong> — showing {size} per page
        </div>
        <Pager
          entryCount={total}
          pageNumber={page}
          pageSize={size}
          onPagination={setPage}
          onPageSizeChange={(s) => { setSize(s); setPage(1); }}
        />
      </div>
    );
  },
};

export const FewPages: Story = {
  args: { entryCount: 15, pageSize: 10, paginationInfoFormat: 'items' },
};

export const ManyPages: Story = {
  args: { entryCount: 2500, pageNumber: 12, paginationInfoFormat: 'both' },
};

export const Compact: Story = {
  args: { entryCount: 200, isCompactPagination: true, paginationInfoFormat: 'pages' },
};

export const InfoOnly: Story = {
  args: { entryCount: 87, pageNumber: 3, paginationInfoFormat: 'items' },
};

export const NoInfo: Story = {
  args: { entryCount: 300, paginationInfoFormat: 'none' },
};
