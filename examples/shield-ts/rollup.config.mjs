import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import postcss from "rollup-plugin-postcss";

export default {
  input: "src/index.tsx",
  output: [
    {
      dir: "dist",
      format: "es",
      preserveModules: true,
      preserveModulesRoot: "src",
      sourcemap: true,
    },
    {
      dir: "dist",
      format: "cjs",
      preserveModules: true,
      preserveModulesRoot: "src",
      sourcemap: true,
      entryFileNames: "[name].cjs",
    },
  ],
  external: [/node_modules/],
  plugins: [
    nodeResolve(),
    postcss({
      extract: true,
      modules: true,
    }),
    typescript({
      tsconfig: "tsconfig.json",
    }),
  ],
};
