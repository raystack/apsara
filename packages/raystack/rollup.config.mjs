import commonjs from "@rollup/plugin-commonjs";
import image from "@rollup/plugin-image";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import postcss from "rollup-plugin-postcss";
import postcssImport from 'postcss-import';

const defaultGlobals = {
  react: "React",
  "react-dom": "ReactDOM",
};

export default {
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
  plugins: [
    nodeResolve(),
    commonjs(),
    postcss({
      plugins: [
        postcssImport(),
      ],
      extract: true,
      minimize: true
    }),
    typescript({
      tsconfig: "tsconfig.json",
    }),
    image(),
  ],
  onwarn: (warning, warn) => {
    if (warning.code === "MODULE_LEVEL_DIRECTIVE") {
      return;
    }
    warn(warning);
  }
};
