import { ChangeEvent } from 'react';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

// ─── Navigation ───────────────────────────────────────────────────────────────

/**
 * A single item in the application sidebar navigation tree.
 * Items can be nested indefinitely via the `children` array.
 */
export type NavigationItem = {
  name: string;
  link?: string;
  /** Expand this item and its children when the sidebar first renders. */
  preExpanded?: boolean;
  isExternalLink?: boolean;
  /** When true the label will be passed through i18next `t()`. */
  localize?: boolean;
  /** FontAwesome icon or Ionicons icon name string. */
  icon?: string | IconProp;
  isFontAwesome?: boolean;
  /** Raw SVG string used as an inline icon. */
  svg?: string;
  tooltip?: string;
  children?: NavigationItem[];
};

/** Top-level module entry shown in the module switcher. */
export type ModuleNavigationItem = {
  name: string;
  icon: string;
  link: string;
};

// ─── User ─────────────────────────────────────────────────────────────────────

/** Authenticated user profile returned by the server on app init. */
export type ModuleUser = {
  username: string;
  loggedIn: boolean;
  languageName: string;
  /** BCP 47 date/number culture, e.g. `"de-CH"`. */
  culture: string;
  /** BCP 47 UI language, e.g. `"de"`. */
  uiCulture: string;
  roles: string[];
  userProfileUrl?: string;
};

/** Language option used in a language switcher. */
export type ModuleLanguage = {
  /** Native language name, e.g. `"Deutsch"`. */
  nameInLanguage?: string;
  /** English name, e.g. `"German"`. */
  name: string;
};

/** i18next / localization configuration. */
export type Localization = {
  url?: string;
  project: string;
  client?: string;
};

// ─── Environment ──────────────────────────────────────────────────────────────

/** Deployment environment of the running application. */
export enum EnvironmentTypes {
  Undefined     = 'Undefined',
  Local         = 'Local',
  Predevelopment = 'Predevelopment',
  Development   = 'Development',
  Integration   = 'Integration',
  Validation    = 'Validation',
  Preproduction = 'Preproduction',
  Production    = 'Production',
  Demo          = 'Demo',
}

// ─── App init state ───────────────────────────────────────────────────────────

/**
 * Root state object passed to the app on startup (e.g. from a server-rendered
 * `window.__INITIAL_STATE__` or a fetch to `/api/init`).
 */
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

// ─── Pagination ───────────────────────────────────────────────────────────────

/**
 * Full pagination state including setters.
 * Returned by `usePaginationQuery` and consumed by `<PagedGrid>` / `<Pager>`.
 */
export type Pagination = {
  pageNumber: number;
  pageSize: number;
  /** Active text filter string. */
  filter: string;
  /** Active sort expression, e.g. `"name asc"`. */
  sort: string;
  setPageSize: (newPageSize: number) => void;
  setPageNumber: (newPageNumber: number) => void;
  setFilter: (newFilter: string | undefined) => void;
  setSort: (newSort: string | undefined) => void;
};

/**
 * Standard server response shape for paginated lists.
 *
 * @template T  The list item type — must have an `id: string` field.
 */
export type PagedList<T> = {
  totalCount: number;
  list: T[];
};

// ─── Form helpers ─────────────────────────────────────────────────────────────

/**
 * Minimal subset of `react-hook-form`'s `UseFormRegister` used by input
 * components. Keeps the library independent of a specific RHF version.
 */
export type UseFormRegister = (
  name: string,
  options?: {
    required?: boolean;
    valueAsNumber?: true | undefined;
    onChange?: (e: any) => void;
    onBlur?: (e: any) => void;
  }
) => Record<string, any>;

// ─── Localisation ─────────────────────────────────────────────────────────────

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
