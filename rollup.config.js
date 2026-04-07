import typescript from '@rollup/plugin-typescript';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import dts from 'rollup-plugin-dts';
import postcss from 'rollup-plugin-postcss';
import preserveDirectives from 'rollup-preserve-directives';

// Only these need to be singletons / share context with the host app.
// Everything else gets bundled into the dist so consumers don't need to install it.
const EXTERNAL = [
  'react',
  'react-dom',
  'react/jsx-runtime',
  'react-router-dom',
  'react-i18next',
  'i18next',
  'next',
];

const external = (id) =>
  EXTERNAL.some((p) => id === p || id.startsWith(p + '/'));

// Silence Dart Sass legacy-js-api deprecation warning emitted by rollup-plugin-postcss
const sassOptions = {
  extensions: ['.css', '.scss'],
  use: [['sass', { silenceDeprecations: ['legacy-js-api'] }]],
};

const jsPlugins = [
  preserveDirectives(),
  nodeResolve({ extensions: ['.ts', '.tsx', '.js', '.jsx'], browser: true }),
  commonjs(),
  typescript({
    tsconfig: './tsconfig.json',
    declaration: false,
    declarationMap: false,
    exclude: ['src/stories/**/*', '**/*.stories.*'],
  }),
  postcss(sassOptions),
];

export default [
  // JS build
  {
    input: 'src/index.ts',
    output: [
      { file: 'dist/cjs/index.js', format: 'cjs', sourcemap: false },
      { file: 'dist/esm/index.js', format: 'esm', sourcemap: false },
    ],
    external,
    plugins: jsPlugins,
  },
  // DTS build
  {
    input: 'src/index.ts',
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    external: (id) => external(id) || /\.(css|scss)$/.test(id),
    plugins: [dts()],
  },
];
