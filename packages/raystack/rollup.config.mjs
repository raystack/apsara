import commonjs from "@rollup/plugin-commonjs";
import image from "@rollup/plugin-image";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import tsconfigPaths from "rollup-plugin-tsconfig-paths";
import postcss from "rollup-plugin-postcss";
import postcssImport from "postcss-import";
import svgr from "@svgr/rollup";

const createPlugins = ({ rootDir, declarationDir }) => [
  nodeResolve(),
  commonjs(),
  svgr(),
  postcss({
    plugins: [postcssImport()],
    extract: "style.css",
    minimize: true,
    autoModules: true, // Auto process files ending with .module.css
    modules: true,
    namedExports: true, // Enable named exports for CSS modules
  }),
  tsconfigPaths(),
  typescript({
    tsconfig: "tsconfig.json",
    declaration: true,
    rootDir: rootDir,
    declarationDir: declarationDir,
  }),
  image(),
];

const sharedWarningHandler = (warning, warn) => {
  // Ignore circular dependency warnings
  // if (warning.code === 'CIRCULAR_DEPENDENCY') return;

  // This ignores the warnings generated during build from
  // CSS module imports which is not standard JS module syntax.
  if (warning.code === "MODULE_LEVEL_DIRECTIVE") return;

  warn(warning);
};

const configs = [
  {
    inputPath: ".",
    outputPath: "dist",
  },
  {
    inputPath: "v1",
    outputPath: "dist/v1",
  },
  {
    inputPath: "v1/icons",
    outputPath: "dist/v1/icons",
  },
  {
    inputPath: "v1/hooks",
    outputPath: "dist/v1/hooks",
  },
];

const rollupConfig = configs.map((conf) => {
  return {
    input: conf.inputPath + "/index.tsx",
    output: [
      {
        dir: conf.outputPath,
        format: "es",
        sourcemap: true,
        exports: "named",
        preserveModules: true,
        preserveModulesRoot: conf.inputPath,
      },
      {
        dir: conf.outputPath,
        format: "cjs",
        sourcemap: true,
        exports: "named",
        entryFileNames: "[name].cjs",
        preserveModules: true,
        preserveModulesRoot: conf.inputPath,
      },
    ],
    external: ["react", "react-dom"],
    plugins: createPlugins({
      rootDir: conf.inputPath,
      declarationDir: conf.outputPath,
    }),
    onwarn: sharedWarningHandler,
  };
});

export default rollupConfig;
