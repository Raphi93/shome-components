import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],

  addons: [
    // In Storybook 10 the former addon-essentials (controls, actions, viewport,
    // docs, backgrounds) are built into the core — only extra addons needed here.
    '@storybook/addon-a11y',         // accessibility audit panel
    '@storybook/addon-interactions', // play-function / interaction testing
  ],

  framework: {
    name: '@storybook/react-vite',
    options: {},
  },

  docs: {},
};

export default config;
