import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  faCheck, faTrash, faPlus, faSave, faGear, faHeart,
  faChevronDown, faArrowRight, faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { Button } from '../Components/Button/Button';
import { EnumButtonColor } from '../Components/Button/Button.type';

// ─── Meta ────────────────────────────────────────────────────────────────────

const meta: Meta<typeof Button> = {
  title: 'Inputs/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    text:         'Button',
    color:        EnumButtonColor.Primary,
    disabled:     false,
    isLightColor: false,
    border:       false,
    small:        false,
    expander:     false,
    expanderValue: false,
    isLoading:    false,
    isSelected:   false,
  },
  argTypes: {
    text:  { control: 'text', description: 'Button label text. Omit for icon-only.' },
    color: {
      control: 'select',
      options: Object.values(EnumButtonColor),
      description: 'Visual color variant.',
    },
    icon:          { control: false, description: 'Primary FontAwesome icon.' },
    disabled:      { control: 'boolean' },
    isLightColor:  { control: 'boolean', description: 'Alpha/ghost fill variant.' },
    border:        { control: 'boolean', description: 'Add a visible border.' },
    small:         { control: 'boolean', description: 'Compact height.' },
    isLoading:     { control: 'boolean', description: 'Show spinner, disable interaction.' },
    isSelected:    { control: 'boolean', description: 'Active/selected visual state.' },
    expander:      { control: 'boolean', description: 'Show chevron toggle arrow.' },
    expanderValue: { control: 'boolean', description: 'Chevron direction (open / closed).' },
    width:         { control: 'text',    description: 'CSS width override, e.g. "200px".' },
    height:        { control: 'text',    description: 'CSS height override.' },
    fontSize:      { control: 'text',    description: 'Font size override, e.g. "1.125rem".' },
    tooltip:       { control: 'text' },
    link:          { control: 'text',    description: 'Renders as <a href> when set.' },
    target:        { control: 'select',  options: ['_self', '_blank'] },
    onClick:       { action: 'clicked' },
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

// ─── Basic ───────────────────────────────────────────────────────────────────

export const Default: Story = {};

export const WithIcon: Story = {
  args: { text: 'Save', icon: faSave, color: EnumButtonColor.Success },
};

export const IconOnly: Story = {
  args: {
    icon: faTrash, color: EnumButtonColor.Danger,
    tooltip: 'Delete record', width: '40px', height: '40px',
  },
};

export const Loading: Story = {
  args: { text: 'Saving…', isLoading: true, color: EnumButtonColor.Primary },
};

export const Disabled: Story = {
  args: { text: 'Not available', disabled: true, color: EnumButtonColor.Primary },
};

export const Small: Story = {
  args: { text: 'Compact', small: true, color: EnumButtonColor.Secondary },
};

export const WithBorder: Story = {
  args: { text: 'Outlined', border: true, color: EnumButtonColor.Primary },
};

export const LightVariant: Story = {
  args: { text: 'Ghost', isLightColor: true, color: EnumButtonColor.Primary },
};

export const Selected: Story = {
  args: { text: 'Active', isSelected: true, color: EnumButtonColor.Primary },
};

export const Expander: Story = {
  name: 'Expander toggle',
  args: { text: 'Show more', expander: true, expanderValue: false, color: EnumButtonColor.Secondary },
};

export const AsLink: Story = {
  name: 'As hyperlink',
  args: {
    text: 'Open in new tab', icon: faArrowRight,
    link: 'https://example.com', target: '_blank', color: EnumButtonColor.Info,
  },
};

export const CustomSize: Story = {
  args: { text: 'Wide button', width: '240px', height: '48px', fontSize: '1.125rem', color: EnumButtonColor.Primary },
};

// ─── All-variants showcase ────────────────────────────────────────────────────

export const AllColors: Story = {
  name: 'All color variants',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <section>
        <p style={{ margin: '0 0 0.5rem', fontWeight: 600, fontSize: '0.8rem', opacity: 0.6 }}>Default</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {Object.values(EnumButtonColor).map((color) => (
            <Button key={color} text={color} color={color} onClick={() => undefined} />
          ))}
        </div>
      </section>

      <section>
        <p style={{ margin: '0 0 0.5rem', fontWeight: 600, fontSize: '0.8rem', opacity: 0.6 }}>Light / Ghost</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {Object.values(EnumButtonColor).map((color) => (
            <Button key={color} text={color} color={color} isLightColor onClick={() => undefined} />
          ))}
        </div>
      </section>

      <section>
        <p style={{ margin: '0 0 0.5rem', fontWeight: 600, fontSize: '0.8rem', opacity: 0.6 }}>With Border</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {Object.values(EnumButtonColor).map((color) => (
            <Button key={color} text={color} color={color} border onClick={() => undefined} />
          ))}
        </div>
      </section>

      <section>
        <p style={{ margin: '0 0 0.5rem', fontWeight: 600, fontSize: '0.8rem', opacity: 0.6 }}>Light + Border</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {Object.values(EnumButtonColor).map((color) => (
            <Button key={color} text={color} color={color} isLightColor border onClick={() => undefined} />
          ))}
        </div>
      </section>

      <section>
        <p style={{ margin: '0 0 0.5rem', fontWeight: 600, fontSize: '0.8rem', opacity: 0.6 }}>Small</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {Object.values(EnumButtonColor).map((color) => (
            <Button key={color} text={color} color={color} small onClick={() => undefined} />
          ))}
        </div>
      </section>
    </div>
  ),
};
