import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { FieldSet, FieldSetColumn, sizeMapper } from '../Components/FieldSet/FieldSet';

const meta: Meta<typeof FieldSet> = {
  title: 'Layout/FieldSet',
  component: FieldSet,
  tags: ['autodocs'],
  argTypes: {
    title:       { control: 'text' },
    titleAs:     { control: 'select', options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] },
    titleSize:   { control: 'text', description: 'e.g. "1rem", "1.25rem" or 18' },
    titleWeight: { control: 'number', description: '400 | 600 | 700' },
    border:      { control: 'boolean' },
    shadow:      { control: 'boolean' },
    headerColor: { control: 'select', options: ['default', 'primary', 'secondary'] },
    isExpandable:{ control: 'boolean' },
    defaultOpen: { control: 'boolean' },
    disabled:    { control: 'boolean' },
  },
  args: {
    title: 'Section Title',
    border: true,
    shadow: false,
    headerColor: 'default',
    isExpandable: false,
    defaultOpen: true,
    disabled: false,
  },
};
export default meta;

type Story = StoryObj<typeof FieldSet>;

const Placeholder = ({ label }: { label: string }) => (
  <div style={{ padding: '0.5rem', background: 'var(--color-gray-100)', border: '1px dashed var(--color-gray-300)', borderRadius: 4, fontSize: '0.8rem', color: 'var(--color-gray-600)' }}>
    {label}
  </div>
);

/** Basic card with border */
export const Default: Story = {
  args: { title: 'Contact Info', border: true },
  render: (args) => (
    <FieldSet {...args}>
      <Placeholder label="Field 1" />
      <Placeholder label="Field 2" />
    </FieldSet>
  ),
};

/** Card with drop shadow instead of border */
export const Shadow: Story = {
  args: { title: 'Shadow Card', border: false, shadow: true },
  render: (args) => (
    <FieldSet {...args}>
      <Placeholder label="Content" />
    </FieldSet>
  ),
};

/** No header, no card — transparent layout wrapper */
export const Transparent: Story = {
  args: { title: undefined, border: false, shadow: false },
  render: (args) => (
    <FieldSet {...args}>
      <Placeholder label="Just layout" />
    </FieldSet>
  ),
};

/** Collapsible content — click header to toggle */
export const Expandable: Story = {
  args: { title: 'Expandable Section', border: true, isExpandable: true, defaultOpen: true },
  render: (args) => (
    <FieldSet {...args}>
      <Placeholder label="Hidden content" />
      <Placeholder label="Also hidden" />
    </FieldSet>
  ),
};

/** Collapsed by default */
export const CollapsedByDefault: Story = {
  args: { title: 'Collapsed', border: true, isExpandable: true, defaultOpen: false },
  render: (args) => (
    <FieldSet {...args}>
      <Placeholder label="You need to open this" />
    </FieldSet>
  ),
};

/** Primary header color */
export const PrimaryHeader: Story = {
  args: { title: 'Primary Header', border: true, headerColor: 'primary' },
  render: (args) => (
    <FieldSet {...args}>
      <Placeholder label="Content" />
    </FieldSet>
  ),
};

/** Secondary header color */
export const SecondaryHeader: Story = {
  args: { title: 'Secondary Header', border: true, headerColor: 'secondary' },
  render: (args) => (
    <FieldSet {...args}>
      <Placeholder label="Content" />
    </FieldSet>
  ),
};

/** Custom title size and weight */
export const CustomTitleStyle: Story = {
  args: { title: 'Big Bold Title', border: true, titleSize: '1.4rem', titleWeight: 800 },
  render: (args) => (
    <FieldSet {...args}>
      <Placeholder label="Content" />
    </FieldSet>
  ),
};

/** Header with action buttons on the right */
export const WithHeaderChildren: Story = {
  args: { title: 'With Actions', border: true },
  render: (args) => (
    <FieldSet
      {...args}
      headerChildren={
        <button style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}>Edit</button>
      }
    >
      <Placeholder label="Content" />
    </FieldSet>
  ),
};

/** Two-column layout using FieldSetColumn */
export const TwoColumns: Story = {
  name: 'FieldSetColumn / 50-50',
  render: () => (
    <FieldSet title="Two Columns" border>
      <FieldSetColumn size={50}><Placeholder label="Left 50%" /></FieldSetColumn>
      <FieldSetColumn size={50}><Placeholder label="Right 50%" /></FieldSetColumn>
    </FieldSet>
  ),
};

/** Three-column layout */
export const ThreeColumns: Story = {
  name: 'FieldSetColumn / 33-33-33',
  render: () => (
    <FieldSet title="Three Columns" border>
      <FieldSetColumn size={33}><Placeholder label="33%" /></FieldSetColumn>
      <FieldSetColumn size={33}><Placeholder label="33%" /></FieldSetColumn>
      <FieldSetColumn size={33}><Placeholder label="33%" /></FieldSetColumn>
    </FieldSet>
  ),
};

/** All available sizes displayed */
export const AllSizes: Story = {
  name: 'FieldSetColumn / All sizes',
  render: () => (
    <FieldSet title="All column sizes" border>
      {(Object.entries(sizeMapper) as [string, number][]).map(([key, val]) => (
        <FieldSetColumn key={key} size={val as any}>
          <Placeholder label={`${key} (${val}%)`} />
        </FieldSetColumn>
      ))}
    </FieldSet>
  ),
};
