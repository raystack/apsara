import path from "path";
import multiInput from "rollup-plugin-multi-input";
import typescript from "rollup-plugin-typescript2";
import tsImportPluginFactory from "ts-import-plugin";

const NODE_MODULES = path.resolve(__dirname, "../../node_modules");

export default {
  input: ["src/**/*.ts", "src/**/*.tsx"],
  /*
  ES Modules have a static module structure, which helps building tool that target ESM to perform tree shaking
  Note: Tree shaking is a process of dead code elimination where Bundlers will attempt to only bundle code 
  that is being used.
  
  CommonJS modules have a dynamic module structure, used by building tool that target CommonJS(Webpack, Node.js).
  This means that even if only one component is imported from our library, all components will be bundled.
  */
  output: [
    {
      dir: "lib",
      format: "cjs",
      sourcemap: true,
    },
  ],

  plugins: [
    multiInput(),
    // Transpiles our TypeScript code into JavaScript
    typescript({
      clean: true,
      tsconfigDefaults: {
        compilerOptions: { declaration: true },
      },
      tsconfig: "./tsconfig.json",
      useTsconfigDeclarationDir: false,
      transformers: [
        () => ({
          before: tsImportPluginFactory({
            libraryName: "antd",
            libraryDirectory: "lib",
            style: true,
          }),
        }),
      ],
    }),
  ],
};
