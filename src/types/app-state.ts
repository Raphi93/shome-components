import { EnvironmentTypes } from './environment';
import { ModuleNavigationItem, NavigationItem } from './navigation';
import { Localization, ModuleLanguage, ModuleUser } from './user';

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
