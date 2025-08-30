// .storybook/main.ts
import type { StorybookConfig } from '@storybook/react-webpack5';
import type { RuleSetRule } from 'webpack';

function isStyleRule(rule: RuleSetRule): boolean {
  const t = rule.test?.toString() ?? '';
  return /s[ac]ss/.test(t) || /css/.test(t);
}

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx|js|jsx|mdx)'],

  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-webpack5-compiler-swc', // ok, kann bleiben
    // KEIN @storybook/preset-scss!
  ],

  framework: { name: '@storybook/react-webpack5', options: {} },

  webpackFinal: async (cfg) => {
    if (!cfg.module) cfg.module = { rules: [] };

    // 1) Alle vorhandenen CSS/SCSS-Regeln raus (auch oneOf flatten)
    const cleaned: RuleSetRule[] = [];
    for (const r of (cfg.module.rules as RuleSetRule[])) {
      const anyR = r as any;
      if (Array.isArray(anyR.oneOf)) {
        for (const sub of anyR.oneOf as RuleSetRule[]) {
          if (!isStyleRule(sub)) cleaned.push(sub);
        }
      } else {
        if (!isStyleRule(r)) cleaned.push(r);
      }
    }
    cfg.module.rules = cleaned;

    // 2) Unsere 4 eindeutigen Regeln – Reihenfolge wichtig
    cfg.module.rules.push(
      // a) SCSS Modules (*.module.scss)
      {
        test: /\.module\.s[ac]ss$/i,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { modules: { exportLocalsConvention: 'camelCaseOnly' } } },
          'sass-loader',
        ],
      },
      // b) globales SCSS
      {
        test: /\.s[ac]ss$/i,
        exclude: /\.module\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      // c) CSS Modules (*.module.css)
      {
        test: /\.module\.css$/i,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { modules: { exportLocalsConvention: 'camelCaseOnly' } } },
        ],
      },
      // d) globales CSS
      {
        test: /\.css$/i,
        exclude: /\.module\.css$/i,
        use: ['style-loader', 'css-loader'],
      }
    );

    return cfg;
  },
};

export default config;
