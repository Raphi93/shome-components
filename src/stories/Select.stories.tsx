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

const meta: Meta = {
  title: 'Inputs/Select',
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj;

export const Single: Story = {
  name: 'Single select',
  render: () => {
    const [value, setValue] = useState<SingleValue<TSelectOption>>(null);
    return (
      <Select
        isMulti={false}
        options={COUNTRIES}
        selectedOptions={value}
        setSelectedOptions={setValue}
        label="Country"
        placeholder="Select a country…"
        isClearable
      />
    );
  },
};

export const Multi: Story = {
  name: 'Multi select',
  render: () => {
    const [value, setValue] = useState<MultiValue<TSelectOption>>([]);
    return (
      <Select
        isMulti
        options={COUNTRIES}
        selectedOptions={value}
        setSelectedOptions={setValue}
        label="Countries"
        placeholder="Select one or more countries…"
        closeMenuOnSelect={false}
        hideSelectedOptions={false}
        isClearable
      />
    );
  },
};

export const BorderLabel: Story = {
  name: 'Border label variant',
  render: () => {
    const [value, setValue] = useState<SingleValue<TSelectOption>>(null);
    return (
      <Select
        isMulti={false}
        options={COUNTRIES}
        selectedOptions={value}
        setSelectedOptions={setValue}
        label="Country"
        hasBorderLabel
        isClearable
      />
    );
  },
};

export const Creatable: Story = {
  name: 'Creatable (add new options)',
  render: () => {
    const [value, setValue] = useState<SingleValue<TSelectOption>>(null);
    return (
      <Select
        isMulti={false}
        isCreatable
        options={COUNTRIES}
        selectedOptions={value}
        setSelectedOptions={(v) => setValue(v as SingleValue<TSelectOption>)}
        label="Country (type to add)"
        placeholder="Type to create a new option…"
        isClearable
      />
    );
  },
};

export const WithError: Story = {
  name: 'Validation error',
  render: () => {
    const [value, setValue] = useState<SingleValue<TSelectOption>>(null);
    return (
      <Select
        isMulti={false}
        options={COUNTRIES}
        selectedOptions={value}
        setSelectedOptions={setValue}
        label="Country"
        isRequired
        errorText="Please select a country."
        isClearable
      />
    );
  },
};

export const PreSelected: Story = {
  name: 'Pre-selected value',
  render: () => {
    const [value, setValue] = useState<SingleValue<TSelectOption>>({ value: 'ch', label: 'Switzerland' });
    return (
      <Select
        isMulti={false}
        options={COUNTRIES}
        selectedOptions={value}
        setSelectedOptions={setValue}
        label="Country"
        isClearable
      />
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <Select
      isMulti={false}
      options={COUNTRIES}
      selectedOptions={{ value: 'ch', label: 'Switzerland' }}
      setSelectedOptions={() => undefined}
      label="Country (read-only)"
      isDisabled
    />
  ),
};

export const Loading: Story = {
  render: () => (
    <Select
      isMulti={false}
      options={[]}
      selectedOptions={null}
      setSelectedOptions={() => undefined}
      label="Loading options…"
      isLoading
    />
  ),
};
