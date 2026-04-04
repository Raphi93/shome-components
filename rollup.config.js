import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import postcss from 'rollup-plugin-postcss';
import preserveDirectives from 'rollup-preserve-directives';
import pkg from './package.json' with { type: 'json' };

// All packages from dependencies + peerDependencies are external —
// never bundle them into the library output.
const externalPackages = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
  // Used in components but not declared as peer dep
  'react-router-dom',
  'path',
];

// Match exact package names AND any sub-path (e.g. "next/link", "lodash/merge")
const external = (id) =>
  externalPackages.some((p) => id === p || id.startsWith(p + '/'));

// Silence Dart Sass legacy-js-api deprecation warning emitted by rollup-plugin-postcss
const sassOptions = {
  extensions: ['.css', '.scss'],
  use: [['sass', { silenceDeprecations: ['legacy-js-api'] }]],
};

export default [
  // JS build
  {
    input: 'src/index.ts',
    output: [
      { file: pkg.main, format: 'cjs', sourcemap: false },
      { file: pkg.module, format: 'esm', sourcemap: false },
    ],
    external,
    plugins: [
      preserveDirectives(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
        declarationMap: false,
        exclude: ['src/stories/**/*', '**/*.stories.*'],
      }),
      postcss(sassOptions),
    ],
  },
  // DTS build
  {
    input: 'src/index.ts',
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    external: (id) => external(id) || /\.(css|scss)$/.test(id),
    plugins: [dts()],
  },
];
