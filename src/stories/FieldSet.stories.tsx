import type { Meta, StoryObj } from '@storybook/react-vite';
import { FieldSet, FieldSetColumn, sizeMapper } from '../Components/FieldSet/FieldSet';
import { StringInput } from '../Components/FieldWrapper/FieldWrapper';

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof FieldSet> = {
  title: 'Layout/FieldSet',
  component: FieldSet,
  tags: ['autodocs'],
  args: {
    title:        'Section title',
    titleAs:      'h2',
    border:       true,
    shadow:       false,
    headerColor:  'default',
    isExpandable: false,
    defaultOpen:  true,
    disabled:     false,
  },
  argTypes: {
    title:       { control: 'text',   description: 'Section heading text.' },
    titleAs:     { control: 'select', options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'], description: 'HTML heading tag.' },
    titleSize:   { control: 'text',   description: 'Font-size override, e.g. "1.25rem" or 18.' },
    titleWeight: { control: 'number', description: 'Font-weight override, e.g. 400 | 600 | 700.' },
    border:      { control: 'boolean', description: 'Show card border.' },
    shadow:      { control: 'boolean', description: 'Drop shadow without border (card style).' },
    headerColor: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'color-background'],
      description: 'Header background colour.',
    },
    colorBackground: { control: 'boolean', description: 'Themed surface background without border or shadow.' },
    isExpandable:    { control: 'boolean', description: 'Allow collapsing via header click.' },
    defaultOpen:     { control: 'boolean', description: 'Whether the section starts expanded.' },
    disabled:        { control: 'boolean', description: 'Dim and disable the whole section.' },
    headerChildren: { control: false, description: 'Slot for header actions (buttons, badges…).' },
  },
};
export default meta;

type Story = StoryObj<typeof FieldSet>;

// ─── Helper ───────────────────────────────────────────────────────────────────

const Box = ({ label }: { label: string }) => (
  <div style={{ padding: '0.75rem', background: 'var(--color-surface)', border: '1px dashed var(--color-border)', borderRadius: 'var(--border-radius-small)', fontSize: '0.8rem', color: 'var(--color-text-muted)', textAlign: 'center' }}>
    {label}
  </div>
);

// ─── Basic variants ───────────────────────────────────────────────────────────

export const Default: Story = {
  args: { title: 'Contact Information', border: true },
  render: (args) => (
    <FieldSet {...args}>
      <Box label="Field 1" />
      <Box label="Field 2" />
      <Box label="Field 3" />
    </FieldSet>
  ),
};

export const Shadow: Story = {
  args: { title: 'Shadow card', border: false, shadow: true },
  render: (args) => (
    <FieldSet {...args}>
      <Box label="Content" />
      <Box label="Content" />
    </FieldSet>
  ),
};

export const Transparent: Story = {
  name: 'Transparent (layout wrapper)',
  args: { title: undefined, border: false, shadow: false },
  render: (args) => (
    <FieldSet {...args}>
      <Box label="No card — just layout" />
    </FieldSet>
  ),
};

// ─── Header colours ───────────────────────────────────────────────────────────

export const PrimaryHeader: Story = {
  args: { title: 'Primary header', border: true, headerColor: 'primary' },
  render: (args) => (
    <FieldSet {...args}>
      <Box label="Content" />
    </FieldSet>
  ),
};

export const SecondaryHeader: Story = {
  args: { title: 'Secondary header', border: true, headerColor: 'secondary' },
  render: (args) => (
    <FieldSet {...args}>
      <Box label="Content" />
    </FieldSet>
  ),
};

export const ColorBackgroundHeader: Story = {
  name: 'Color background header',
  args: { title: 'Dashboard gradient header', border: true, headerColor: 'color-background' },
  render: (args) => (
    <FieldSet {...args}>
      <Box label="Content" />
    </FieldSet>
  ),
};

export const FullColorBackground: Story = {
  name: 'Color background — header + card',
  render: () => (
    <FieldSet title="Full themed card" border headerColor="color-background" colorBackground>
      <Box label="Both header and card use the themed dashboard gradient" />
    </FieldSet>
  ),
};

// ─── Expandable ───────────────────────────────────────────────────────────────

export const Expandable: Story = {
  name: 'Expandable (open by default)',
  args: { title: 'Collapsible section', border: true, isExpandable: true, defaultOpen: true },
  render: (args) => (
    <FieldSet {...args}>
      <Box label="Hidden when collapsed" />
      <Box label="Hidden when collapsed" />
    </FieldSet>
  ),
};

export const CollapsedByDefault: Story = {
  name: 'Expandable (collapsed by default)',
  args: { title: 'Click header to expand', border: true, isExpandable: true, defaultOpen: false },
  render: (args) => (
    <FieldSet {...args}>
      <Box label="You need to expand to see this" />
    </FieldSet>
  ),
};

// ─── Title customisation ──────────────────────────────────────────────────────

export const CustomTitleStyle: Story = {
  name: 'Custom title size & weight',
  args: { title: 'Large heading', border: true, titleSize: '1.4rem', titleWeight: 800, titleAs: 'h3' },
  render: (args) => (
    <FieldSet {...args}>
      <Box label="Content" />
    </FieldSet>
  ),
};

// ─── Header actions ───────────────────────────────────────────────────────────

export const WithHeaderActions: Story = {
  name: 'With header actions',
  render: () => (
    <FieldSet
      title="User records"
      border
      headerColor="primary"
      headerChildren={
        <button style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem', borderRadius: 4, border: '1px solid rgba(255,255,255,0.4)', background: 'transparent', color: '#fff', cursor: 'pointer' }}>
          + Add
        </button>
      }
    >
      <Box label="Record 1" />
      <Box label="Record 2" />
    </FieldSet>
  ),
};

// ─── Disabled ────────────────────────────────────────────────────────────────

export const ColorBackground: Story = {
  name: 'Color background (no border)',
  args: { title: 'Tinted background', colorBackground: true, border: false, shadow: false },
  render: (args) => (
    <FieldSet {...args}>
      <Box label="Themed surface background — no border, no shadow" />
      <Box label="Uses --color-card-dashboard-background" />
    </FieldSet>
  ),
};

export const Disabled: Story = {
  args: { title: 'Disabled section', border: true, disabled: true },
  render: (args) => (
    <FieldSet {...args}>
      <Box label="Not interactive" />
    </FieldSet>
  ),
};

// ─── With real inputs ─────────────────────────────────────────────────────────

export const WithInputs: Story = {
  name: 'With form inputs',
  render: () => (
    <FieldSet title="Personal details" border>
      <FieldSetColumn size="50">
        <StringInput label="First name" placeholder="Anna" isRequired />
      </FieldSetColumn>
      <FieldSetColumn size="50">
        <StringInput label="Last name" placeholder="Müller" isRequired />
      </FieldSetColumn>
      <FieldSetColumn size="100">
        <StringInput label="Email" type="email" placeholder="anna@example.com" />
      </FieldSetColumn>
    </FieldSet>
  ),
};

// ─── FieldSetColumn ───────────────────────────────────────────────────────────

export const TwoColumns: Story = {
  name: 'FieldSetColumn — 50 / 50',
  render: () => (
    <FieldSet title="Two columns" border>
      <FieldSetColumn size="50"><Box label="Left 50%" /></FieldSetColumn>
      <FieldSetColumn size="50"><Box label="Right 50%" /></FieldSetColumn>
    </FieldSet>
  ),
};

export const ThreeColumns: Story = {
  name: 'FieldSetColumn — 33 / 33 / 33',
  render: () => (
    <FieldSet title="Three columns" border>
      <FieldSetColumn size="33"><Box label="33%" /></FieldSetColumn>
      <FieldSetColumn size="33"><Box label="33%" /></FieldSetColumn>
      <FieldSetColumn size="33"><Box label="33%" /></FieldSetColumn>
    </FieldSet>
  ),
};

export const MixedColumns: Story = {
  name: 'FieldSetColumn — mixed widths',
  render: () => (
    <FieldSet title="Mixed layout" border>
      <FieldSetColumn size="66"><Box label="Main area 66%" /></FieldSetColumn>
      <FieldSetColumn size="33"><Box label="Sidebar 33%" /></FieldSetColumn>
      <FieldSetColumn size="25"><Box label="25%" /></FieldSetColumn>
      <FieldSetColumn size="75"><Box label="75%" /></FieldSetColumn>
    </FieldSet>
  ),
};

export const AllColumnSizes: Story = {
  name: 'FieldSetColumn — all 18 sizes',
  render: () => (
    <FieldSet title="All column widths" border>
      {(Object.entries(sizeMapper) as [string, string][]).map(([key, val]) => (
        <FieldSetColumn key={key} size={val as any}>
          <Box label={`${key} (${val}%)`} />
        </FieldSetColumn>
      ))}
    </FieldSet>
  ),
};

// ─── All card styles ──────────────────────────────────────────────────────────

export const AllCardStyles: Story = {
  name: 'All card styles',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <FieldSet title="Border card (default)" border>
        <Box label="Content" />
      </FieldSet>
      <FieldSet title="Shadow card" shadow>
        <Box label="Content" />
      </FieldSet>
      <FieldSet title="Primary header" border headerColor="primary">
        <Box label="Content" />
      </FieldSet>
      <FieldSet title="Secondary header" border headerColor="secondary">
        <Box label="Content" />
      </FieldSet>
      <FieldSet title="Expandable" border isExpandable defaultOpen>
        <Box label="Collapsible content" />
      </FieldSet>
      <FieldSet title="Color background" colorBackground>
        <Box label="Themed dashboard background" />
      </FieldSet>
      <FieldSet title="Color background header" border headerColor="color-background">
        <Box label="Dashboard gradient on header only" />
      </FieldSet>
    </div>
  ),
};
