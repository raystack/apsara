import path from "path";
import multiInput from "rollup-plugin-multi-input";
import typescript from "rollup-plugin-typescript2";
import tsImportPluginFactory from "ts-import-plugin";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import rollupPostcssLessLoader from "rollup-plugin-postcss-webpack-alias-less-loader";
import svgr from "@svgr/rollup";
import json from "@rollup/plugin-json";

import Theme from "./theme";

export default {
    input: ["src/**/*.ts", "src/**/*.tsx", "!src/**/*.stories.[tj]s[x]", "!src/**/*.test.[tj]s[x]"],
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
        postcss({
            use: [["less", { javascriptEnabled: true, modifyVars: Theme }]],
            loaders: [
                rollupPostcssLessLoader({
                    nodeModulePath: path.resolve(__dirname, "./node_modules"),
                    aliases: {},
                    options: {
                        javascriptEnabled: true,
                    },
                }),
            ],
        }),

        // Prevents Rollup from bundling the peer dependencies
        peerDepsExternal(),

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
        svgr(),
        json(),
    ],
};
