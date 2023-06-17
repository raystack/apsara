import { Options } from "tsup";

const tsupOptions: Options = {
  entryPoints: ["index.tsx"],
  format: ["cjs", "esm"],
  sourcemap: true,
  splitting: true,
  clean: true,
  dts: true,
  minify: false,
  external: ["react", "react-dom"],
  jsxFactory: "React.createElement",
  tsconfig: "tsconfig.json",
};

export default tsupOptions;
