import { IconProp } from '@fortawesome/fontawesome-svg-core';

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
