import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import postcss from 'rollup-plugin-postcss';
import postcssImport from 'postcss-import';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import preserveDirectives from 'rollup-preserve-directives';
import pkg from './package.json' with { type: 'json' };

const peerExternals = Object.keys(pkg.peerDependencies || {});

const hardcodedExternals = [
  'react',
  'react-dom',
  'react/jsx-runtime',
  'react-router-dom',
  'react-i18next',
  'i18next',
  /^next(\/.*)?$/,
  /^@fortawesome\/.*/,
];

const isExternal = (id) =>
  hardcodedExternals.some((e) => (e instanceof RegExp ? e.test(id) : e === id)) ||
  peerExternals.includes(id);

const tsPlugin = () => typescript({
  tsconfig: './tsconfig.json',
  declaration: false,
  declarationMap: false,
  exclude: ['src/stories/**/*', '**/*.stories.*'],
});

const resolvePlugins = [
  nodeResolve({ extensions: ['.ts', '.tsx', '.js', '.jsx'], browser: true }),
  commonjs(),
];

const postcssPlugin = (extract) => postcss({
  extensions: ['.css', '.scss'],
  use: [['sass', { silenceDeprecations: ['legacy-js-api'] }]],
  extract,
  sourceMap: true,
  minimize: false,
  plugins: [postcssImport()],
  modules: {
    auto: (id) => /\.module\.(css|scss)$/.test(id),
    generateScopedName: '[name]_[local]__[hash:base64:6]',
  },
});

export default [
  // ESM — CSS extracted to dist/esm/index.css
  {
    input: 'src/index.ts',
    output: { file: pkg.module, format: 'esm', sourcemap: true },
    external: isExternal,
    plugins: [
      preserveDirectives(),
      ...resolvePlugins,
      tsPlugin(),
      postcssPlugin('index.css'),
    ],
  },
  // CJS — no CSS (ESM is what Next.js/bundlers use)
  {
    input: 'src/index.ts',
    output: { file: pkg.main, format: 'cjs', sourcemap: true },
    external: isExternal,
    plugins: [
      preserveDirectives(),
      ...resolvePlugins,
      tsPlugin(),
      postcss({
        extensions: ['.css', '.scss'],
        use: [['sass', { silenceDeprecations: ['legacy-js-api'] }]],
        inject: false,
        modules: {
          auto: (id) => /\.module\.(css|scss)$/.test(id),
          generateScopedName: '[name]_[local]__[hash:base64:6]',
        },
      }),
    ],
  },
  // Types
  {
    input: 'src/index.ts',
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    external: [/\.css$/, /\.scss$/],
    plugins: [dts()],
  },
];
