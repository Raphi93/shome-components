import { IconProp } from '@fortawesome/fontawesome-svg-core';

export type NavigationItem = {
    icon?: IconProp | string;
    isFontAwesome?: boolean;
    svg?: string;
    tooltip?: string;
    children?: NavigationItem[];
    name: string;
    link?: string;
    preExpanded?: boolean;
    isExternalLink?: boolean;
    localize?: boolean;
}

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