import commonjs from "@rollup/plugin-commonjs";
import image from "@rollup/plugin-image";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import postcss from "rollup-plugin-postcss";
import alias from "@rollup/plugin-alias";

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
    alias({
      entries: {
        "~/*": "./*"
      }
    }),
    nodeResolve(),
    commonjs(),
    postcss({
      extract: true,
      modules: true,
    }),
    typescript({
      tsconfig: "tsconfig.json",
    }),
    image(),
  ],
};
