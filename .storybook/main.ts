import { config as fontAwesomeConfig } from '@fortawesome/fontawesome-svg-core';
import type { StorybookConfig } from '@storybook/react-vite';

fontAwesomeConfig.autoAddCss = false;

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],

  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
  ],

  framework: '@storybook/react-vite',

  // Serve the public/ folder so theme CSS files are reachable at /Theme/*.css
  staticDirs: ['../public'],
};

export default config;
