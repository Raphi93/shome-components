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
