import type { Meta, StoryObj } from '@storybook/react-vite';
import { Cards } from '../Components/Cards/Cards';
import { faArrowTrendUp, faUsers, faBoxes, faDollarSign } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const meta: Meta<typeof Cards> = {
  title: 'Layout/Cards',
  component: Cards,
  tags: ['autodocs'],
  args: {
    title:       'Card title',
    description: 'A short description of this card.',
  },
  argTypes: {
    title:       { control: 'text' },
    description: { control: 'text' },
  },
};
export default meta;

type Story = StoryObj<typeof Cards>;

export const Default: Story = {};

export const NoDescription: Story = {
  args: { title: 'Total orders', description: undefined },
  render: (args) => (
    <Cards {...args}>
      <div style={{ fontSize: '2.5rem', fontWeight: 700, lineHeight: 1 }}>1,284</div>
    </Cards>
  ),
};

export const StatCard: Story = {
  name: 'Stat / KPI card',
  render: () => (
    <Cards title="Monthly revenue">
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem' }}>
        <span style={{ fontSize: '2rem', fontWeight: 700 }}>CHF 48,320</span>
        <span style={{ fontSize: '0.85rem', color: 'var(--color-success, #22c55e)', marginBottom: '0.3rem' }}>
          <FontAwesomeIcon icon={faArrowTrendUp} /> +12.4%
        </span>
      </div>
      <p style={{ margin: '0.5rem 0 0', fontSize: '0.8rem', opacity: 0.6 }}>vs. last month</p>
    </Cards>
  ),
};

export const DashboardGrid: Story = {
  name: '4-column KPI dashboard',
  render: () => {
    const kpis = [
      { title: 'Users',    value: '3,842',  change: '+5.2%',  icon: faUsers,       positive: true  },
      { title: 'Orders',   value: '12,483', change: '+18.1%', icon: faBoxes,       positive: true  },
      { title: 'Revenue',  value: '€94k',   change: '+8.7%',  icon: faDollarSign,  positive: true  },
      { title: 'Returned', value: '142',    change: '-2.1%',  icon: faArrowTrendUp, positive: false },
    ];
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        {kpis.map(({ title, value, change, icon, positive }) => (
          <Cards key={title} title={title}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '1.75rem', fontWeight: 700 }}>{value}</span>
              <FontAwesomeIcon icon={icon} style={{ fontSize: '1.25rem', opacity: 0.4 }} />
            </div>
            <span style={{ fontSize: '0.8rem', color: positive ? 'var(--color-success, #22c55e)' : 'var(--color-danger, #ef4444)' }}>
              {change} this month
            </span>
          </Cards>
        ))}
      </div>
    );
  },
};

export const WithChildren: Story = {
  name: 'With custom content',
  render: () => (
    <Cards title="Activity">
      <ul style={{ margin: 0, padding: '0 0 0 1.2rem', fontSize: '0.875rem', lineHeight: '1.8' }}>
        <li>User John Doe registered</li>
        <li>Invoice #4892 paid</li>
        <li>New order placed (#9021)</li>
        <li>Report exported</li>
      </ul>
    </Cards>
  ),
};
