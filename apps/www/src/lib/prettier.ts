// @ts-ignore
import prettier from "prettier/standalone";
// @ts-ignore
import tsParser from "prettier/parser-typescript";

export const getFormattedCode = (code: string) => {
  return prettier
    .format(`(${code})`, {
      parser: "typescript",
      plugins: [tsParser],
      printWidth: 80,
    })
    .trim()
    .replace(/;\s*$/, ""); //remove trailing semicolon
};
