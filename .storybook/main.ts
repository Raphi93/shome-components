import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],

  addons: [
    '@storybook/addon-a11y',
  ],

  framework: {
    name: '@storybook/react-vite',
    options: {},
  },

  // Serve the public/ folder so theme CSS files are reachable at /Theme/*.css
  staticDirs: ['../public'],

  docs: {},
};

export default config;
