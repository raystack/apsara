import path from "path";
import multiInput from "rollup-plugin-multi-input";
import typescript from "rollup-plugin-typescript2";
import tsImportPluginFactory from "ts-import-plugin";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import svgr from "@svgr/rollup";
import json from "@rollup/plugin-json";
import url from "@rollup/plugin-url";

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
            dir: "lib/cjs",
            format: "cjs",
            sourcemap: true,
        },
        {
            dir: "lib/esm",
            format: "esm",
            sourcemap: true,
        },
    ],
    plugins: [
        multiInput(),
        // Prevents Rollup from bundling the peer dependencies
        peerDepsExternal(),
        url({
            // by default, rollup-plugin-url will not handle font files
            include: ["**/*.woff", "**/*.woff2", "**/*.otf", "**/*.ttf"],
            // setting infinite limit will ensure that the files
            // are always bundled with the code, not copied to /dist
            limit: Infinity,
            sourceDir: path.join(__dirname, "assets"),
        }),
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
                        style: "css",
                    }),
                }),
            ],
        }),
        svgr(),
        json(),
        postcss(),
    ],
};
