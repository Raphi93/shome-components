import type { Meta, StoryObj } from '@storybook/react';
import { faTrash, faSave, faPlus, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { Button } from '../Components/Button/Button';
import { EnumButtonColor } from '../Components/Button/Button.type';

const meta: Meta<typeof Button> = {
  title: 'Inputs/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: Object.values(EnumButtonColor),
    },
    isLightColor: { control: 'boolean' },
    disabled:     { control: 'boolean' },
    isLoading:    { control: 'boolean' },
    small:        { control: 'boolean' },
    border:       { control: 'boolean' },
    text:         { control: 'text' },
    width:        { control: 'text' },
  },
  args: {
    text: 'Click me',
    color: 'primary',
    disabled: false,
    isLoading: false,
    small: false,
    isLightColor: false,
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = {};

export const AllColors: Story = {
  name: 'All color variants',
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
      {Object.values(EnumButtonColor).map((color) => (
        <Button key={color} text={color} color={color} />
      ))}
    </div>
  ),
};

export const LightVariants: Story = {
  name: 'Light (alpha) variants',
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
      {Object.values(EnumButtonColor).map((color) => (
        <Button key={color} text={color} color={color} isLightColor />
      ))}
    </div>
  ),
};

export const WithIcon: Story = {
  args: { text: 'Save', icon: faSave, color: 'success' },
};

export const IconOnly: Story = {
  args: { icon: faTrash, color: 'danger', tooltip: 'Delete item' },
};

export const Loading: Story = {
  args: { text: 'Saving...', isLoading: true, color: 'primary' },
};

export const Small: Story = {
  args: { text: 'Small', small: true, color: 'secondary' },
};

export const Expander: Story = {
  args: { text: 'Collapse', icon: faChevronDown, expander: true, expanderValue: false },
};

export const AsLink: Story = {
  args: { text: 'Open page', link: 'https://example.com', target: '_blank', color: 'info' },
};

export const Disabled: Story = {
  args: { text: 'Disabled', disabled: true, color: 'primary' },
};
