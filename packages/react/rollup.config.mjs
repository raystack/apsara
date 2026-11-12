import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import autoprefixer from 'autoprefixer';
import postcssImport from 'postcss-import';
import nodeExternals from 'rollup-plugin-node-externals';
import postcss from 'rollup-plugin-postcss';
import preserveDirectives from 'rollup-plugin-preserve-directives';
import tsconfigPaths from 'rollup-plugin-tsconfig-paths';
import { replaceTscAliasPaths } from 'tsc-alias';

/** Matches `@import url("https://fonts.googleapis.com/…");` in any quoting. */
const FONT_IMPORT =
  /@import\s+url\(\s*(['"]?)https:\/\/fonts\.googleapis\.com\/[^)'"]*\1\s*\)\s*;?/g;

/**
 * Emits `style-no-fonts.css` for consumers self-hosting the fonts. Derived from
 * the finished asset rather than compiled again, so the two can only differ by
 * the font imports. Must be ordered after the `postcss()` that extracts `from`.
 */
const emitFontFreeCss = ({ from, to }) => {
  let emitted = false;
  return {
    name: 'apsara-font-free-css',
    generateBundle(_options, bundle) {
      const asset = bundle[from];
      if (!asset) return;
      const source = asset.source.toString();
      const stripped = source.replace(FONT_IMPORT, '');
      // A miss fails the build rather than publishing a `no-fonts` sheet that
      // still calls out to Google.
      if (stripped === source) {
        this.error(`${from} carries no Google Fonts @import to strip.`);
      }
      this.emitFile({ type: 'asset', fileName: to, source: stripped });
      emitted = true;
    },
    closeBundle() {
      if (!emitted) {
        this.error(`${from} was never extracted, so ${to} is missing.`);
      }
    }
  };
};

/** Matches a quoted `~/` module specifier. */
const ALIAS_SPECIFIER = /(['"])~\/[^'"]+\1/g;

/**
 * Rewrites `~/` specifiers in emitted declarations to relative paths, because
 * TypeScript keeps `paths` aliases as written and apps cannot resolve them.
 * `tsconfig.alias.json` leaves out the `react` entry of `tsconfig.json`, which
 * tsc-alias would otherwise rewrite to `node_modules/@types/react`. Fails the
 * build if a specifier is left. Must be ordered after `typescript()`.
 */
const resolveDeclarationAliases = () => ({
  name: 'apsara-declaration-aliases',
  async closeBundle() {
    await replaceTscAliasPaths({
      configFile: 'tsconfig.alias.json',
      outDir: 'dist'
    });
    const leaks = [];
    const declarations = readdirSync('dist', { recursive: true }).filter(
      fileName => fileName.endsWith('.d.ts')
    );
    for (const fileName of declarations) {
      readFileSync(join('dist', fileName), 'utf8')
        .split('\n')
        .forEach((line, index) => {
          for (const [specifier] of line.matchAll(ALIAS_SPECIFIER)) {
            leaks.push(`dist/${fileName}:${index + 1} ${specifier}`);
          }
        });
    }
    if (leaks.length > 0) {
      this.error(
        `Declarations still import through the ~/ alias:\n${leaks.join('\n')}`
      );
    }
  }
});

const createPlugins = ({ rootDir, declarationDir }) => [
  // Externalize all dependencies and peer dependencies
  // This must be placed before nodeResolve() to work correctly
  nodeExternals({
    deps: true,
    devDeps: false,
    peerDeps: true,
    optDeps: true,
    // Note: Include deps with subpaths that need to be externalized in include array.
    // https://github.com/Septh/rollup-plugin-node-externals?tab=readme-ov-file#1-this-plugin-is-smart
    include: ['react/jsx-runtime', 'react-dom/client', /^dayjs\/plugin\/.*/]
  }),
  nodeResolve(),
  commonjs(),
  postcss({
    plugins: [postcssImport(), autoprefixer()],
    extract: 'style.css',
    minimize: true,
    autoModules: true, // Auto process files ending with .module.css
    modules: true,
    namedExports: true, // Enable named exports for CSS modules
    exclude: ['normalize.css']
  }),
  postcss({
    plugins: [postcssImport()],
    extract: 'normalize.css',
    minimize: true,
    include: ['normalize.css'],
    exclude: ['**/*.module.css', 'style.css']
  }),
  tsconfigPaths(),
  typescript({
    tsconfig: 'tsconfig.json',
    declaration: true,
    rootDir: rootDir,
    declarationDir: declarationDir
  }),
  resolveDeclarationAliases(),
  preserveDirectives() //preserve `use client` directive
];

const sharedWarningHandler = (warning, warn) => {
  // Ignore circular dependency warnings
  // if (warning.code === 'CIRCULAR_DEPENDENCY') return;

  // This ignores the warnings generated during build from
  // CSS module imports which is not standard JS module syntax.
  if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return;

  warn(warning);
};

const configs = [
  {
    inputPath: '.',
    outputPath: 'dist',
    // The only entry that extracts the stylesheets.
    extractsCss: true
  },
  {
    inputPath: './icons',
    outputPath: 'dist/icons'
  },
  {
    inputPath: './hooks',
    outputPath: 'dist/hooks'
  }
];

const rollupConfig = configs.map(conf => {
  return {
    input: conf.inputPath + '/index.tsx',
    output: [
      {
        dir: conf.outputPath,
        format: 'es',
        sourcemap: true,
        exports: 'named',
        preserveModules: true,
        preserveModulesRoot: conf.inputPath,
        paths: id => {
          if (id === 'dayjs') return 'dayjs/esm/index.js';
          if (id.startsWith('dayjs/plugin/'))
            return `${id.replace('dayjs/plugin/', 'dayjs/esm/plugin/')}/index.js`;
          return id;
        }
      },
      {
        dir: conf.outputPath,
        format: 'cjs',
        sourcemap: true,
        exports: 'named',
        entryFileNames: '[name].cjs',
        preserveModules: true,
        preserveModulesRoot: conf.inputPath
      }
    ],
    plugins: [
      ...createPlugins({
        rootDir: conf.inputPath,
        declarationDir: conf.outputPath
      }),
      ...(conf.extractsCss
        ? [emitFontFreeCss({ from: 'style.css', to: 'style-no-fonts.css' })]
        : [])
    ],
    onwarn: sharedWarningHandler
  };
});

export default rollupConfig;
