import type { StorybookConfig } from '@storybook/react-webpack5';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx|mdx)'],
  addons: [
    '@storybook/addon-docs',
    // '@storybook/addon-interactions', // optional, nur wenn installiert
  ],
  framework: { name: '@storybook/react-webpack5', options: {} },

  webpackFinal: async (cfg) => {
    cfg.module ??= {};
    cfg.module.rules ??= [];

    // Transpile TS/TSX via Babel -> behebt "import type"-Fehler
    cfg.module.rules.push({
      test: /\.[jt]sx?$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            ['@babel/preset-react', { runtime: 'automatic' }],
            ['@babel/preset-typescript', { allowDeclareFields: true }],
          ],
        },
      },
    });

    // Dateiendungen sicherstellen
    cfg.resolve ??= {};
    cfg.resolve.extensions = ['.ts', '.tsx', '.js', '.jsx', ...(cfg.resolve.extensions || [])];

    return cfg;
  },
};

export default config;
