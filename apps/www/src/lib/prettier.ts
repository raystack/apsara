// @ts-ignore
import prettier from "prettier/standalone";
// @ts-ignore
import tsParser from "prettier/parser-typescript";

const prettierOptions = {
  parser: "typescript",
  plugins: [tsParser],
  printWidth: 80,
};
export const getFormattedCode = (code: string) => {
  try {
    return prettier
      .format(`(${code})`, prettierOptions)
      .trim()
      .replace(/;\s*$/, ""); //remove trailing semicolon
  } catch (e) {
    return prettier
      .format(`${code}`, prettierOptions)
      .trim()
      .replace(/;\s*$/, ""); //remove trailing semicolon
  }
};
