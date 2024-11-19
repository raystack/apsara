import commonjs from "@rollup/plugin-commonjs";
import image from "@rollup/plugin-image";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import postcss from "rollup-plugin-postcss";
import postcssImport from 'postcss-import';

const createPlugins = (isV1 = false) => [
  nodeResolve(),
  commonjs(),
  postcss({
    plugins: [
      postcssImport(),
    ],
    extract: 'style.css',
    minimize: true,
    autoModules: true, // Auto process files ending with .module.css
    modules: true,
    namedExports: true // Enable named exports for CSS modules
  }),
  typescript({
    tsconfig: "tsconfig.json",
    declaration: true,
    rootDir: isV1 ? "v1" : ".",
    declarationDir: isV1 ? 'dist/v1' : 'dist',
  }),
  image(),
];

const sharedWarningHandler = (warning, warn) => {
  // Ignore circular dependency warnings
  // if (warning.code === 'CIRCULAR_DEPENDENCY') return;
  
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
        preserveModules: true,
        preserveModulesRoot: "."
      },
      {
        dir: "dist",
        format: "cjs",
        sourcemap: true,
        exports: "named",
        entryFileNames: "[name].cjs",
        preserveModules: true,
        preserveModulesRoot: "."
      },
    ],
    external: ["react", "react-dom"],
    plugins: createPlugins(false),
    onwarn: sharedWarningHandler,
  },
  // V1 bundle
  {
    input: "v1/index.tsx",
    output: [
      {
        dir: "dist/v1",
        format: "es",
        sourcemap: true,
        exports: "named",
        preserveModules: true,
        preserveModulesRoot: "v1"
      },
      {
        dir: "dist/v1",
        format: "cjs",
        sourcemap: true,
        exports: "named",
        entryFileNames: "[name].cjs",
        preserveModules: true,
        preserveModulesRoot: "v1"
      },
    ],
    external: ["react", "react-dom"],
    plugins: createPlugins(true),
    onwarn: sharedWarningHandler,
  },
];