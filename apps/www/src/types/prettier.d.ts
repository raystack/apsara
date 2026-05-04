declare module 'prettier/standalone' {
  import type { Options } from 'prettier';
  const prettier: {
    format(source: string, options?: Options): string;
  };
  export default prettier;
}

declare module 'prettier/parser-typescript' {
  const parser: import('prettier').Plugin;
  export default parser;
}
