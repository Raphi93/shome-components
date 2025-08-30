const typescript = require("@rollup/plugin-typescript");
const dts = require("rollup-plugin-dts").default;
const postcss = require("rollup-plugin-postcss");
const pkg = require("./package.json");

const external = [
  "react",
  "react/jsx-runtime",
  "react-dom",
  "@fortawesome/react-fontawesome",
  "@fortawesome/free-solid-svg-icons",
  "@fortawesome/free-regular-svg-icons",
  "@fortawesome/free-brands-svg-icons",
  "@floating-ui/react",
  "clsx",
  "classnames"
];

module.exports = [
  // JS build
  {
    input: "src/index.ts",
    output: [
      { file: pkg.main, format: "cjs", sourcemap: false },
      { file: pkg.module, format: "esm", sourcemap: false }
    ],
    external,
    plugins: [
      typescript({
        tsconfig: "./tsconfig.json",
        declaration: false,
        declarationMap: false,
        exclude: ["src/stories/**/*", "**/*.stories.*"]
      }),
      postcss({
        extensions: [".css", ".scss"]
        // optional: extract: 'styles.css',
      })
    ]
  },
  // DTS build
  {
    input: "src/index.ts",
    output: [{ file: "dist/index.d.ts", format: "esm" }],
    external: [...external, /\.css$/, /\.scss$/],
    plugins: [dts()]
  }
];
