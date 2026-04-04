import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Grid, GridBody, GridFiltration, PagedGrid, EmptyGrid } from '../Components/Grid/Grid';
import { GridHead } from '../Components/Grid/GridHead';
import { GridColumn } from '../Components/Grid/GridColumn';

const meta: Meta = {
  title: 'Data/Grid',
  tags: ['autodocs'],
};
export default meta;

const COLUMNS = [
  { key: 'id',    label: 'ID'    },
  { key: 'name',  label: 'Name'  },
  { key: 'email', label: 'Email' },
  { key: 'role',  label: 'Role'  },
];

const DATA = [
  { id: '1', name: 'Anna Müller',   email: 'anna@example.com',  role: 'Admin' },
  { id: '2', name: 'Peter Meier',   email: 'peter@example.com', role: 'User'  },
  { id: '3', name: 'Sarah Schmidt', email: 'sarah@example.com', role: 'User'  },
  { id: '4', name: 'Tom Keller',    email: 'tom@example.com',   role: 'Admin' },
];

export const Default: StoryObj = {
  render: () => (
    <Grid data={DATA}>
      <GridHead columns={COLUMNS} />
      <GridBody>
        {DATA.map((row) => (
          <tr key={row.id}>
            {COLUMNS.map((col) => (
              <GridColumn key={col.key} field={col.key} />
            ))}
          </tr>
        ))}
      </GridBody>
    </Grid>
  ),
};

export const Compact: StoryObj = {
  render: () => (
    <Grid data={DATA} compact>
      <GridHead columns={COLUMNS} />
      <GridBody>
        {DATA.map((row) => (
          <tr key={row.id}>
            {COLUMNS.map((col) => (
              <GridColumn key={col.key} field={col.key} />
            ))}
          </tr>
        ))}
      </GridBody>
    </Grid>
  ),
};

export const Empty: StoryObj = {
  render: () => (
    <EmptyGrid>
      <GridHead columns={COLUMNS} />
    </EmptyGrid>
  ),
};

export const WithPagination: StoryObj = {
  render: () => (
    <PagedGrid
      totalCount={120}
      pagination={{ pageNumber: 1, pageSize: 25 }}
      culture="de-CH"
    >
      <GridHead columns={COLUMNS} />
      <GridBody>
        {DATA.map((row) => (
          <tr key={row.id}>
            {COLUMNS.map((col) => (
              <GridColumn key={col.key} field={col.key} />
            ))}
          </tr>
        ))}
      </GridBody>
    </PagedGrid>
  ),
};
