import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import type { MenuPlacement, MenuPosition, MultiValue, SingleValue } from 'react-select';

export type { MultiValue, SingleValue } from 'react-select';

export type IconLabel = {
  icon: IconProp;
  title?: string;
};

export type TSelectOption = {
  value: string;
  label: string | IconLabel;
};

export type TSelectBaseProps = {
  options: TSelectOption[];
  isDisabled?: boolean;
  placeholder?: string;
  closeMenuOnSelect?: boolean;
  hideSelectedOptions?: boolean;
  isClearable?: boolean;
  isSearchable?: boolean;
  maxMenuHeight?: number;
  label?: string;
  selectWidth?: string;
  color?: string;
  colorActive?: string;
  pressColor?: string;
  isCreatable?: boolean;
  description?: string;
  isRequired?: boolean;
  errorText?: string;
  hasBorderLabel?: boolean;
  isDirty?: boolean;
  onClearDirty?: (arg: any) => void;
  dirtyText?: string;
  menuPortalTarget?: HTMLElement | null;
  menuPlacement?: MenuPlacement;
  menuPosition?: MenuPosition;
};

export type MultiSelectProps = TSelectBaseProps & {
  isMulti: true;
  selectedOptions?: MultiValue<TSelectOption> | SingleValue<TSelectOption> | null;
  setSelectedOptions: (option: MultiValue<TSelectOption>) => void;
  value?: string[];
};

export type SingleSelectProps = TSelectBaseProps & {
  isMulti: false;
  selectedOptions?: SingleValue<TSelectOption> | null;
  setSelectedOptions: (option: SingleValue<TSelectOption>) => void;
  value?: string;
};

export type TSelectProps = SingleSelectProps | MultiSelectProps;
