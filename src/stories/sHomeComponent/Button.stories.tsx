// stories/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

// Importiere den echten Component-Wert (Default-Export)
import { Button } from '../../components/index';

// Nur für Demos mit Icons
import {
  faFloppyDisk,
  faPaperPlane,
  faChevronDown,
  faCircleInfo,
} from '@fortawesome/free-solid-svg-icons';

const meta: Meta<typeof Button> = {
  title: 'sHomeComponents/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A flexible, accessible button/link component with:
- optional FontAwesome icons (primary + secondary),
- color themes (primary/secondary/status) + *Light* variants,
- tooltip wrapping,
- async-loading UX with spinner and temporary disable,
- optional expander chevron that rotates via \`expanderValue\`.

Theming via CSS variables. Defaults are auto-included from the library.
        `.trim(),
      },
    },
  },
  argTypes: {
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light'],
    },
    isLightColor: { control: 'boolean' },
    text: { control: 'text' },
    width: { control: 'text' },
    height: { control: 'text' },
    fontSize: { control: 'text' },
    disabled: { control: 'boolean' },
    expander: { control: 'boolean' },
    expanderValue: { control: 'boolean' },
    link: { control: 'text' },
    target: { control: 'select', options: ['_self', '_blank'] },
    isLoading: { control: 'boolean' },
    loadingTimeoutMs: { control: 'number' },
    tooltip: { control: 'text' },
    onClick: { action: 'clicked' },
  },
  args: {
    text: 'Button',
    color: 'primary',
    isLightColor: false,
    width: 'auto',
    height: '40px',
    fontSize: '1rem',
    disabled: false,
    expander: false,
    expanderValue: false,
    target: '_self',
    isLoading: false,
    loadingTimeoutMs: 1500,
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

/** SOLID VARIANTEN */
export const Primary: Story = {
  parameters: { docs: { description: { story: 'Default primary button (solid).' } } },
  args: { color: 'primary', text: 'Primary' },
};
export const Secondary: Story = {
  parameters: { docs: { description: { story: 'Secondary (solid).' } } },
  args: { color: 'secondary', text: 'Secondary' },
};
export const Success: Story = {
  parameters: { docs: { description: { story: 'Success (solid).' } } },
  args: { color: 'success', text: 'Success' },
};
export const Danger: Story = {
  parameters: { docs: { description: { story: 'Danger (solid).' } } },
  args: { color: 'danger', text: 'Danger' },
};
export const Warning: Story = {
  parameters: { docs: { description: { story: 'Warning (solid).' } } },
  args: { color: 'warning', text: 'Warning' },
};
export const Info: Story = {
  parameters: { docs: { description: { story: 'Info (solid).' } } },
  args: { color: 'info', text: 'Info' },
};
export const Light: Story = {
  parameters: { docs: { description: { story: 'Light neutral (solid).' } } },
  args: { color: 'light', text: 'Light' },
};

/** LIGHT/ALPHA VARIANTEN */
export const PrimaryLight: Story = {
  parameters: { docs: { description: { story: 'Primary **Light** (alpha background).' } } },
  args: { color: 'primary', isLightColor: true, text: 'Primary Light' },
};
export const SecondaryLight: Story = {
  parameters: { docs: { description: { story: 'Secondary **Light**.' } } },
  args: { color: 'secondary', isLightColor: true, text: 'Secondary Light' },
};
export const SuccessLight: Story = {
  parameters: { docs: { description: { story: 'Success **Light**.' } } },
  args: { color: 'success', isLightColor: true, text: 'Success Light' },
};
export const DangerLight: Story = {
  parameters: { docs: { description: { story: 'Danger **Light**.' } } },
  args: { color: 'danger', isLightColor: true, text: 'Danger Light' },
};
export const WarningLight: Story = {
  parameters: { docs: { description: { story: 'Warning **Light**.' } } },
  args: { color: 'warning', isLightColor: true, text: 'Warning Light' },
};
export const InfoLight: Story = {
  parameters: { docs: { description: { story: 'Info **Light**.' } } },
  args: { color: 'info', isLightColor: true, text: 'Info Light' },
};
export const LightLight: Story = {
  parameters: { docs: { description: { story: 'Neutral light-on-light.' } } },
  args: { color: 'light', isLightColor: true, text: 'Light Light' },
};

/** ICONS */
export const WithIcon: Story = {
  parameters: { docs: { description: { story: 'Single icon left (Font Awesome).' } } },
  args: { icon: faFloppyDisk, text: 'Save' },
};
export const WithTwoIcons: Story = {
  parameters: { docs: { description: { story: 'Primary + secondary overlay icon.' } } },
  args: { icon: faFloppyDisk, icon2: faCircleInfo, text: 'Save + Info' },
};

/** TOOLTIP */
export const WithTooltip: Story = {
  parameters: { docs: { description: { story: 'Wrapped with Tooltip. Hover/focus to show.' } } },
  args: { text: 'Hover me', tooltip: 'This is a tooltip' },
};

/** LOADING */
export const Loading: Story = {
  parameters: { docs: { description: { story: 'Shows spinner and disables temporarily on click.' } } },
  args: { icon: faPaperPlane, text: 'Submit', isLoading: true },
};

/** DISABLED */
export const Disabled: Story = {
  parameters: { docs: { description: { story: 'Disabled state.' } } },
  args: { text: 'Disabled', disabled: true },
};

/** LINK MODE */
export const AsLink: Story = {
  parameters: { docs: { description: { story: 'Renders an <a> with identical visuals.' } } },
  args: { text: 'Open Docs', link: 'https://example.com', target: '_blank', icon: faCircleInfo },
};

/** EXPANDER (CONTROLLED) */
export const WithExpanderControlled: Story = {
  render: (args: any) => {
    const [open, setOpen] = useState(false);
    return (
      <Button
        {...args}
        expander
        expanderValue={open}
        onClick={() => setOpen((v) => !v)}
        text={open ? 'Hide details' : 'Show details'}
      />
    );
  },
  parameters: { docs: { description: { story: 'Chevron rotiert via `expanderValue`.' } } },
  args: { color: 'primary' },
};

/** CUSTOM SIZE */
export const CustomSize: Story = {
  parameters: { docs: { description: { story: 'Custom width/height/fontSize (unitless → px).' } } },
  args: { text: 'Wide', width: '240', height: '48px', fontSize: '1.25rem' },
};

/** CHILDREN SLOT */
export const AsChildren: Story = {
  parameters: { docs: { description: { story: 'Eigene Children rendern, Styles/Behavior bleiben.' } } },
  render: (args: React.ComponentProps<typeof Button>) => (
    <Button {...args}>
      <span style={{ display: 'inline-flex', gap: '.5rem', alignItems: 'center' }}>
        <span role="img" aria-label="warn">⚠️</span>
        <span>Custom Slot</span>
      </span>
    </Button>
  ),
  args: { color: 'warning' },
};
