import type { Meta, StoryObj } from '@storybook/react-vite';
import { Grid, GridBody, PagedGrid, EmptyGrid } from '../Components/Grid/Grid';
import { GridHead } from '../Components/Grid/GridHead';
import { GridColumn } from '../Components/Grid/GridColumn';
import { Button } from '../Components/Button/Button';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';

// ─── Sample data ──────────────────────────────────────────────────────────────

type Customer = { id: string; name: string; email: string; role: string; active: string };

const CUSTOMERS: Customer[] = [
  { id: '1', name: 'Anna Müller',    email: 'anna@example.com',   role: 'Admin',  active: 'Yes' },
  { id: '2', name: 'Peter Meier',    email: 'peter@example.com',  role: 'User',   active: 'Yes' },
  { id: '3', name: 'Sarah Schmidt',  email: 'sarah@example.com',  role: 'User',   active: 'No'  },
  { id: '4', name: 'Tom Keller',     email: 'tom@example.com',    role: 'Admin',  active: 'Yes' },
  { id: '5', name: 'Lisa Weber',     email: 'lisa@example.com',   role: 'Editor', active: 'Yes' },
];

const COLUMNS = [
  { key: 'id',     label: 'ID',     sortKey: 'id'     },
  { key: 'name',   label: 'Name',   sortKey: 'name'   },
  { key: 'email',  label: 'Email',  sortKey: 'email'  },
  { key: 'role',   label: 'Role',   sortKey: 'role'   },
  { key: 'active', label: 'Active', sortKey: 'active' },
];

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta = {
  title: 'Data/Grid',
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj;

// ─── Shared row renderer ──────────────────────────────────────────────────────

const DataRows = ({ data = CUSTOMERS }: { data?: Customer[] }) => (
  <GridBody>
    {data.map((row) => (
      <tr key={row.id}>
        {COLUMNS.map((col) => (
          <GridColumn key={col.key} field={col.key} />
        ))}
      </tr>
    ))}
  </GridBody>
);

// ─── Stories ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => (
    <Grid data={CUSTOMERS}>
      <GridHead columns={COLUMNS} />
      <DataRows />
    </Grid>
  ),
};

export const Compact: Story = {
  name: 'Compact rows',
  render: () => (
    <Grid data={CUSTOMERS} compact>
      <GridHead columns={COLUMNS} />
      <DataRows />
    </Grid>
  ),
};

export const Empty: Story = {
  name: 'Empty state',
  render: () => (
    <EmptyGrid>
      <GridHead columns={COLUMNS} />
    </EmptyGrid>
  ),
};

export const WithPagination: Story = {
  name: 'With pagination (PagedGrid)',
  render: () => (
    <PagedGrid
      totalCount={248}
      pagination={{ pageNumber: 3, pageSize: 25 }}
      culture="de-CH"
    >
      <GridHead columns={COLUMNS} />
      <DataRows />
    </PagedGrid>
  ),
};

export const WithActions: Story = {
  name: 'With row actions',
  render: () => {
    const cols = [...COLUMNS, { key: 'actions', label: '' }];
    return (
      <Grid data={CUSTOMERS.map((c) => ({ ...c, actions: undefined }))}>
        <GridHead columns={cols} />
        <GridBody>
          {CUSTOMERS.map((row) => (
            <tr key={row.id}>
              <GridColumn field="id" />
              <GridColumn field="name" />
              <GridColumn field="email" />
              <GridColumn field="role" />
              <GridColumn field="active" />
              <td>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  <Button icon={faEdit}  color="info"   small tooltip="Edit"   onClick={() => alert(`Edit ${row.name}`)} />
                  <Button icon={faTrash} color="danger" small tooltip="Delete" onClick={() => alert(`Delete ${row.name}`)} />
                </div>
              </td>
            </tr>
          ))}
        </GridBody>
      </Grid>
    );
  },
};

export const Sortable: Story = {
  name: 'Sortable columns',
  render: () => (
    <Grid data={[...CUSTOMERS].sort((a, b) => a.name.localeCompare(b.name))}>
      <GridHead columns={COLUMNS} sort="name asc" onSort={(s) => console.log('sort:', s)} />
      <DataRows data={[...CUSTOMERS].sort((a, b) => a.name.localeCompare(b.name))} />
    </Grid>
  ),
};
