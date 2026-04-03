import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import postcss from 'rollup-plugin-postcss';
import pkg from './package.json' with { type: 'json' };

// All packages from dependencies + peerDependencies are external —
// never bundle them into the library output.
const externalPackages = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
];

// Match exact package names AND any sub-path (e.g. "next/link", "lodash/merge")
const external = (id) =>
  externalPackages.some((p) => id === p || id.startsWith(p + '/'));

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
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
        declarationMap: false,
        exclude: ['src/stories/**/*', '**/*.stories.*'],
      }),
      postcss({
        extensions: ['.css', '.scss'],
        use: ['sass'],
      }),
    ],
  },
  // Standalone CSS build — outputs dist/styles.css for direct web import:
  //   import '@raphi93/shome-components/styles.css'
  {
    input: 'src/styles.scss',
    output: [{ file: 'dist/styles.css', format: 'es' }],
    plugins: [
      postcss({
        extensions: ['.css', '.scss'],
        use: ['sass'],
        extract: true,
        inject: false,
      }),
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
