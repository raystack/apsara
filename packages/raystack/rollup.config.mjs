import commonjs from "@rollup/plugin-commonjs";
import image from "@rollup/plugin-image";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import postcss from "rollup-plugin-postcss";
import postcssImport from 'postcss-import';

const createPlugins = () => [
  nodeResolve(),
  commonjs(),
  postcss({
    plugins: [
      postcssImport(),
    ],
    extract: 'style.css',
    minimize: true
  }),
  typescript({
    tsconfig: "tsconfig.json",
    outDir: 'dist',
    rootDir: ".",
  }),
  image(),
];

const sharedWarningHandler = (warning, warn) => {
  // Ignore circular dependency warnings
  if (warning.code === 'CIRCULAR_DEPENDENCY') return;
  
  // This ignores the warnings generated during build from
  // CSS module imports which is not standard JS module syntax.
  if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return;
  
  warn(warning);
};

export default [
  // Main bundle
  {
    input: "index.tsx",
    output: [
      {
        dir: "dist",
        format: "es",
        sourcemap: true,
        exports: "named",
      },
      {
        dir: "dist",
        format: "cjs",
        sourcemap: true,
        exports: "named",
        entryFileNames: "[name].cjs",
      },
    ],
    external: ["react", "react-dom"],
    plugins: createPlugins(),
    onwarn: sharedWarningHandler,
  },
  // V1 bundle
  {
    input: "v1/index.tsx",
    output: [
      {
        dir: "dist",
        format: "es",
        sourcemap: true,
        exports: "named",
        preserveModules: true,
        preserveModulesRoot: "v1"
      },
      {
        dir: "dist",
        format: "cjs",
        sourcemap: true,
        exports: "named",
        entryFileNames: "[name].cjs",
        preserveModules: true,
        preserveModulesRoot: "v1"
      },
    ],
    external: ["react", "react-dom"],
    plugins: createPlugins(),
    onwarn: sharedWarningHandler,
  },
];
