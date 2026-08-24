import { ChangeEvent } from 'react';

/** Supported country/language codes for i18n. */
export enum Country {
  DE = 'de',
  IT = 'it',
  FR = 'fr',
  EN = 'en',
}

type CountryItem = {
  src: string;
  countryName: string;
  value: string;
  disabled?: boolean;
  handleChange?: (c: ChangeEvent<HTMLInputElement>) => void;
};

/** Map of country items keyed by `Country` enum value. */
export type CountriesGroupListT = {
  [K in Country]?: CountryItem;
};
