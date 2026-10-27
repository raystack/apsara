import { posix } from 'node:path';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import autoprefixer from 'autoprefixer';
import postcssImport from 'postcss-import';
import nodeExternals from 'rollup-plugin-node-externals';
import postcss from 'rollup-plugin-postcss';
import preserveDirectives from 'rollup-plugin-preserve-directives';
import tsconfigPaths from 'rollup-plugin-tsconfig-paths';

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
const ALIAS_SPECIFIER = /(['"])~\/([^'"]+)\1/g;

/**
 * Rewrites `~/` specifiers in emitted declarations to relative paths, because
 * TypeScript keeps `paths` aliases as written and apps cannot resolve them.
 * `aliasRoot` is where the package root's declarations land. Fails the build
 * if a specifier is left. Must be ordered after `typescript()`.
 */
const resolveDeclarationAliases = ({ aliasRoot }) => ({
  name: 'apsara-declaration-aliases',
  // Runs for each output, and each output gets its own copy of the assets.
  generateBundle({ dir }, bundle) {
    const declarations = Object.entries(bundle).filter(
      ([fileName, asset]) =>
        asset.type === 'asset' && fileName.endsWith('.d.ts')
    );
    const emitted = new Set(
      declarations.map(([fileName]) => posix.join(dir, fileName))
    );
    const leaks = [];
    for (const [fileName, asset] of declarations) {
      const from = posix.dirname(posix.join(dir, fileName));
      asset.source = asset.source
        .toString()
        .replace(ALIAS_SPECIFIER, (specifier, quote, rest) => {
          const target = posix.join(aliasRoot, rest);
          if (
            !emitted.has(`${target}.d.ts`) &&
            !emitted.has(`${target}/index.d.ts`)
          ) {
            return specifier;
          }
          const relative = posix.relative(from, target);
          return `${quote}${relative.startsWith('.') ? relative : `./${relative}`}${quote}`;
        });
      asset.source.split('\n').forEach((line, index) => {
        for (const [specifier] of line.matchAll(ALIAS_SPECIFIER)) {
          leaks.push(`${fileName}:${index + 1} ${specifier}`);
        }
      });
    }
    if (leaks.length > 0) {
      this.error(
        `Declarations import through the ~/ alias, and no emitted declaration matches:\n${leaks.join('\n')}`
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
  // `~/*` maps to the package root (tsconfig.json), emitted under `dist`.
  resolveDeclarationAliases({ aliasRoot: 'dist' }),
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
