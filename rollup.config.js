import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";

import typescript from "rollup-plugin-typescript2";
import pkg from "./package.json";

const name = pkg.name.replace(/^@.*\//, "");

const defaultGlobals = {
    react: "React",
    "react-dom": "ReactDOM",
};

export default {
    input: "index.ts",
    output: [
        {
            file: pkg.main,
            format: "cjs",
        },
        {
            file: pkg.module,
            format: "es",
        },
        {
            file: pkg.browser,
            format: "umd",
            name,
            globals: defaultGlobals,
        },
        {
            file: pkg.main.replace(/\.js$/, ".min.js"),
            format: "umd",
            name,
            globals: defaultGlobals,
            plugins: [terser()],
        },
    ],
    plugins: [
        nodeResolve(),
        commonjs(),
        typescript({
            clean: true,
            typescript: require("typescript"),
        }),
    ],
    external: ["react", "react-dom"],
};
