import { ChangeEvent } from 'react';

import './Styles/index.scss';

export * from './Components';
export * from './context';
export * from './hooks';
export * from './service'

export type NavigationItem = {
  name: string;
  link?: string;
  preExpanded?: boolean;
  isExternalLink?: boolean;
  localize?: boolean;
  icon?: string;
  isFontAwesome?: boolean;
  svg?: string;
  tooltip?: string;
  children?: NavigationItem[];
};

export type ModuleNavigationItem = {
  name: string;
  icon: string;
  link: string;
};

export type ModuleUser = {
  username: string;
  loggedIn: boolean;
  languageName: string;
  culture: string;
  uiCulture: string;
  roles: string[];
  userProfileUrl?: string;
};

export type ModuleLanguage = {
  nameInLanguage?: string;
  name: string;
};

export type InitialState = {
  module: {
    title: string;
    appRoot?: string;
    environment?: EnvironmentTypes;
    theme?: string;
    logoutUrl?: string;
  };
  localization: Localization;
  user: ModuleUser;
  navigation: NavigationItem[];
  languages: ModuleLanguage[];
  moduleNavigation: ModuleNavigationItem[];
};

export type Localization = {
  url?: string;
  project: string;
  client?: string;
};

export enum EnvironmentTypes {
  Undefined = 'Undefined',
  Local = 'Local',
  Predevelopment = 'Predevelopment',
  Development = 'Development',
  Integration = 'Integration',
  Validation = 'Validation',
  Preproduction = 'Preproduction',
  Production = 'Production',
  Demo = 'Demo',
}

export type Pagination = {
    pageNumber: number;
    pageSize: number;
    filter: string;
    sort: string;
    setPageSize: (newPageSize: number) => void;
    setPageNumber: (newPageNumber: number) => void;
    setFilter: (newFilter: string | undefined) => void;
    setSort: (newSort: string | undefined) => void;
};

export type PagedList<T> = {
    totalCount: number;
    list: T[];
};


export type UseFormRegister = (
  name: string,
  options?: {
    required?: boolean;
    valueAsNumber?: true | undefined;
    onChange?: (e: any) => void;
    onBlur?: (e: any) => void;
  }
) => Record<string, any>;

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

export type CountriesGroupListT = {
  [K in Country]?: CountryItem;
};
