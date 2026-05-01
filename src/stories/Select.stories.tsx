import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Select } from '../Components/Select/Select';
import type { TSelectOption, SingleValue, MultiValue } from '../Components/Select/Select';

const COUNTRIES: TSelectOption[] = [
  { value: 'ch', label: 'Switzerland' },
  { value: 'de', label: 'Germany'     },
  { value: 'at', label: 'Austria'     },
  { value: 'fr', label: 'France'      },
  { value: 'it', label: 'Italy'       },
  { value: 'nl', label: 'Netherlands' },
  { value: 'es', label: 'Spain'       },
  { value: 'pl', label: 'Poland'      },
];

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof Select> = {
  title: 'Inputs/Select',
  component: Select,
  tags: ['autodocs'],
  args: {
    options:            COUNTRIES,
    isMulti:            false,
    isDisabled:         false,
    isClearable:        false,
    isSearchable:       true,
    closeMenuOnSelect:  true,
    hideSelectedOptions: false,
    isCreatable:        false,
    isRequired:         false,
    hasBorderLabel:     false,
    placeholder:        'Select an option…',
    label:              'Country',
  },
  argTypes: {
    options: {
      control: 'object',
      description: 'Array of { value, label } options.',
    },
    isMulti: {
      control: 'boolean',
      description: 'Allow selecting multiple options.',
    },
    isDisabled: {
      control: 'boolean',
      description: 'Disables the control.',
    },
    isClearable: {
      control: 'boolean',
      description: 'Shows an × button to clear the selection.',
    },
    isSearchable: {
      control: 'boolean',
      description: 'Allow filtering options by typing.',
    },
    closeMenuOnSelect: {
      control: 'boolean',
      description: 'Close the dropdown after each selection.',
    },
    hideSelectedOptions: {
      control: 'boolean',
      description: 'Hide already-selected options from the list.',
    },
    isCreatable: {
      control: 'boolean',
      description: 'Allow creating options not in the list.',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder shown when no option is selected.',
    },
    label: {
      control: 'text',
      description: 'Label above the control.',
    },
    description: {
      control: 'text',
      description: 'Helper text below the label.',
    },
    isRequired: {
      control: 'boolean',
      description: 'Mark the field as required.',
    },
    errorText: {
      control: 'text',
      description: 'Validation error shown below the control.',
    },
    hasBorderLabel: {
      control: 'boolean',
      description: 'Floating border-label style.',
    },
    selectWidth: {
      control: 'text',
      description: 'CSS width override, e.g. "300px".',
    },
    menuPlacement: {
      control: 'select',
      options: ['auto', 'top', 'bottom'],
    },
    isDirty: {
      control: 'boolean',
      description: 'Mark as having unsaved changes.',
    },
    selectedOptions: { control: false },
    setSelectedOptions: { action: 'setSelectedOptions' },
  },
};

export default meta;

type Story = StoryObj<typeof Select>;

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: args => {
    const [selected, setSelected] = useState<SingleValue<TSelectOption>>(null);
    return (
      <div style={{ padding: '1rem', maxWidth: '25rem' }}>
        <Select
          {...args}
          isMulti={false}
          selectedOptions={selected}
          setSelectedOptions={v => { setSelected(v as SingleValue<TSelectOption>); args.setSelectedOptions?.(v as any); }}
        />
        <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
          Selected: <strong>{(selected as TSelectOption)?.label?.toString() ?? '–'}</strong>
        </p>
      </div>
    );
  },
};

export const MultiSelect: Story = {
  name: 'Multi select',
  args: {
    isMulti: true,
    label: 'Countries',
    placeholder: 'Select one or more countries…',
    closeMenuOnSelect: false,
    hideSelectedOptions: false,
    isClearable: true,
  },
  render: args => {
    const [selected, setSelected] = useState<MultiValue<TSelectOption>>([]);
    return (
      <div style={{ padding: '1rem', maxWidth: '25rem' }}>
        <Select
          {...args}
          isMulti={true}
          selectedOptions={selected}
          setSelectedOptions={v => setSelected(v as MultiValue<TSelectOption>)}
        />
        <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
          Selected: <strong>{(selected as TSelectOption[]).map(o => o.label).join(', ') || '–'}</strong>
        </p>
      </div>
    );
  },
};

export const WithBorderLabel: Story = {
  name: 'Border label variant',
  args: { hasBorderLabel: true },
  render: args => {
    const [selected, setSelected] = useState<SingleValue<TSelectOption>>(null);
    return (
      <div style={{ padding: '2rem', maxWidth: '25rem' }}>
        <Select
          {...args}
          isMulti={false}
          selectedOptions={selected}
          setSelectedOptions={v => setSelected(v as SingleValue<TSelectOption>)}
        />
      </div>
    );
  },
};

export const Clearable: Story = {
  args: { isClearable: true },
  render: args => {
    const [selected, setSelected] = useState<SingleValue<TSelectOption>>({ value: 'de', label: 'Germany' });
    return (
      <div style={{ padding: '1rem', maxWidth: '25rem' }}>
        <Select
          {...args}
          isMulti={false}
          selectedOptions={selected}
          setSelectedOptions={v => setSelected(v as SingleValue<TSelectOption>)}
        />
      </div>
    );
  },
};

export const Creatable: Story = {
  name: 'Creatable (add new options)',
  args: { isCreatable: true, placeholder: 'Type to create a new option…' },
  render: args => {
    const [selected, setSelected] = useState<SingleValue<TSelectOption>>(null);
    return (
      <div style={{ padding: '1rem', maxWidth: '25rem' }}>
        <Select
          {...args}
          isMulti={false}
          selectedOptions={selected}
          setSelectedOptions={v => setSelected(v as SingleValue<TSelectOption>)}
        />
      </div>
    );
  },
};

export const WithError: Story = {
  name: 'Validation error',
  args: { isRequired: true, errorText: 'Please select a country.' },
  render: args => {
    const [selected, setSelected] = useState<SingleValue<TSelectOption>>(null);
    return (
      <div style={{ padding: '1rem', maxWidth: '25rem' }}>
        <Select
          {...args}
          isMulti={false}
          selectedOptions={selected}
          setSelectedOptions={v => setSelected(v as SingleValue<TSelectOption>)}
        />
      </div>
    );
  },
};

export const WithDescription: Story = {
  name: 'With description',
  args: { description: 'Select the country of your current citizenship.' },
  render: args => {
    const [selected, setSelected] = useState<SingleValue<TSelectOption>>(null);
    return (
      <div style={{ padding: '1rem', maxWidth: '25rem' }}>
        <Select
          {...args}
          isMulti={false}
          selectedOptions={selected}
          setSelectedOptions={v => setSelected(v as SingleValue<TSelectOption>)}
        />
      </div>
    );
  },
};

export const PreSelected: Story = {
  name: 'Pre-selected value',
  render: args => {
    const [selected, setSelected] = useState<SingleValue<TSelectOption>>({ value: 'ch', label: 'Switzerland' });
    return (
      <div style={{ padding: '1rem', maxWidth: '25rem' }}>
        <Select
          {...args}
          isMulti={false}
          selectedOptions={selected}
          setSelectedOptions={v => setSelected(v as SingleValue<TSelectOption>)}
        />
      </div>
    );
  },
};

export const Disabled: Story = {
  args: { isDisabled: true },
  render: args => (
    <div style={{ padding: '1rem', maxWidth: '25rem' }}>
      <Select
        {...args}
        isMulti={false}
        selectedOptions={{ value: 'ch', label: 'Switzerland' }}
        setSelectedOptions={() => undefined}
      />
    </div>
  ),
};

export const Loading: Story = {
  render: args => (
    <div style={{ padding: '1rem', maxWidth: '25rem' }}>
      <Select
        {...args}
        isMulti={false}
        options={[]}
        selectedOptions={null}
        setSelectedOptions={() => undefined}
        label="Loading options…"
        isLoading
      />
    </div>
  ),
};
