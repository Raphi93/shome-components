import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Select } from '../Components/Select/Select';
import type { TSelectOption, SingleValue, MultiValue } from '../Components/Select/Select';

const OPTIONS: TSelectOption[] = [
  { value: 'ch', label: 'Switzerland' },
  { value: 'de', label: 'Germany' },
  { value: 'at', label: 'Austria' },
  { value: 'fr', label: 'France' },
  { value: 'it', label: 'Italy' },
];

const meta: Meta = {
  title: 'Inputs/Select',
  tags: ['autodocs'],
};
export default meta;

/** Single select */
export const Single: StoryObj = {
  render: () => {
    const [value, setValue] = useState<SingleValue<TSelectOption>>(null);
    return (
      <Select
        isMulti={false}
        options={OPTIONS}
        selectedOptions={value}
        setSelectedOptions={setValue}
        label="Country"
        placeholder="Select a country..."
        isClearable
      />
    );
  },
};

/** Multi select */
export const Multi: StoryObj = {
  render: () => {
    const [value, setValue] = useState<MultiValue<TSelectOption>>([]);
    return (
      <Select
        isMulti={true}
        options={OPTIONS}
        selectedOptions={value}
        setSelectedOptions={setValue}
        label="Countries"
        placeholder="Select countries..."
        closeMenuOnSelect={false}
        hideSelectedOptions={false}
        isClearable
      />
    );
  },
};

/** Border label variant */
export const BorderLabel: StoryObj = {
  render: () => {
    const [value, setValue] = useState<SingleValue<TSelectOption>>(null);
    return (
      <Select
        isMulti={false}
        options={OPTIONS}
        selectedOptions={value}
        setSelectedOptions={setValue}
        label="Country"
        hasBorderLabel
        isClearable
      />
    );
  },
};

/** Creatable — user can add new options */
export const Creatable: StoryObj = {
  render: () => {
    const [value, setValue] = useState<SingleValue<TSelectOption>>(null);
    return (
      <Select
        isMulti={false}
        isCreatable
        options={OPTIONS}
        selectedOptions={value}
        setSelectedOptions={(v) => setValue(v as SingleValue<TSelectOption>)}
        label="Country (creatable)"
        placeholder="Type to create..."
        isClearable
      />
    );
  },
};

/** With validation error */
export const WithError: StoryObj = {
  render: () => {
    const [value, setValue] = useState<SingleValue<TSelectOption>>(null);
    return (
      <Select
        isMulti={false}
        options={OPTIONS}
        selectedOptions={value}
        setSelectedOptions={setValue}
        label="Country"
        isRequired
        errorText="Please select a country"
        isClearable
      />
    );
  },
};

/** Disabled */
export const Disabled: StoryObj = {
  render: () => (
    <Select
      isMulti={false}
      options={OPTIONS}
      selectedOptions={{ value: 'ch', label: 'Switzerland' }}
      setSelectedOptions={() => {}}
      label="Country"
      isDisabled
    />
  ),
};
