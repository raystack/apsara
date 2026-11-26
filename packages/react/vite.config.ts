import { spawn } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, join, relative, resolve, sep } from 'node:path';
import browserslist from 'browserslist';
import genericNames from 'generic-names';
import { browserslistToTargets, Features, transform } from 'lightningcss';
import type { OutputOptions } from 'rolldown';
import { defineConfig, type Plugin } from 'vite';

const root = import.meta.dirname;
const outDir = join(root, 'dist');
const typesDir = join(root, 'node_modules/.cache/apsara-types');

const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')) as {
  browserslist: string[];
  dependencies: Record<string, string>;
  peerDependencies: Record<string, string>;
};
const targets = browserslistToTargets(browserslist(pkg.browserslist));
// Colors stay as written. Fallbacks for oklch() would add about 11% to
// style.css (gzip), for Safari 15.0 to 15.3 only.
const exclude = Features.Colors;
// The same generator, pattern, and context as rollup-plugin-postcss 4.
const scopedName = genericNames('[name]_[local]__[hash:base64:5]', {
  context: root
});
const externals = [
  ...Object.keys(pkg.dependencies),
  ...Object.keys(pkg.peerDependencies)
];

const minifyCss = (code: string, filename: string) =>
  transform({
    filename,
    code: Buffer.from(code),
    minify: true,
    targets,
    exclude
  }).code.toString();

/** Matches `@import "https://fonts.googleapis.com/…";`, with or without `url()`. */
const FONT_IMPORT =
  /@import\s*(?:url\(\s*(['"]?)https:\/\/fonts\.googleapis\.com\/[^)'"]*\1\s*\)|(['"])https:\/\/fonts\.googleapis\.com\/[^'"]*\2)[^;]*;?/g;

/**
 * Minifies `style.css` and writes `style-no-fonts.css` and `normalize.css`.
 * The no-fonts sheet comes from the finished `style.css`, so the two can only
 * differ by the font imports. Vite emits `style.css` in its own
 * `generateBundle`, so this runs once the files are on disk.
 */
const stylesheets = (): Plugin => ({
  name: 'apsara-stylesheets',
  apply: 'build',
  writeBundle: {
    order: 'post',
    async handler(options, bundle) {
      // Each output writes its own copy of style.css, so each one is processed.
      const emitted = Object.values(bundle).some(
        file => file.type === 'asset' && file.fileName === 'style.css'
      );
      if (!emitted) {
        if (options.format === 'es') {
          this.error('The build emitted no style.css.');
        }
        return;
      }
      const dir = options.dir ?? outDir;
      const path = join(dir, 'style.css');
      const css = minifyCss(await readFile(path, 'utf8'), 'style.css');
      const fontFree = css.replace(FONT_IMPORT, '');
      // A miss fails the build rather than publishing a `no-fonts` sheet that
      // still calls out to Google.
      if (fontFree === css) {
        this.error('style.css carries no Google Fonts @import to strip.');
      }
      const normalize = minifyCss(
        await readFile(join(root, 'normalize.css'), 'utf8'),
        'normalize.css'
      );
      await Promise.all([
        writeFile(path, css),
        writeFile(join(dir, 'style-no-fonts.css'), fontFree),
        writeFile(join(dir, 'normalize.css'), normalize)
      ]);
    }
  }
});

const runTsc = () =>
  new Promise<void>((resolvePromise, reject) => {
    const tsc = join(
      dirname(
        createRequire(import.meta.url).resolve('typescript/package.json')
      ),
      'bin/tsc'
    );
    spawn(process.execPath, [tsc, '-p', 'tsconfig.build.json'], {
      cwd: root,
      stdio: 'inherit'
    }).on('exit', code =>
      code === 0
        ? resolvePromise()
        : reject(new Error(`tsc exited with code ${code}`))
    );
  });

/** Matches a module specifier after `from`, `import(`, or a bare `import`. */
const SPECIFIER = /(\bfrom\s*|\bimport\s*\(\s*|^import\s*)(['"])([^'"]+)\2/gm;

const toSpecifier = (fromDir: string, target: string) => {
  const path = relative(fromDir, target).split(sep).join('/');
  return path.startsWith('.') ? path : `./${path}`;
};

/**
 * Copies the declarations from `typesDir` to `dir` as `.d.ts` and `.d.cts`.
 * TypeScript keeps `~/` aliases and extensionless paths as written, and
 * neither resolves in an app, so each one is rewritten to a relative path
 * with the `.js` or `.cjs` extension of its format. Returns the specifiers
 * that do not resolve.
 */
async function writeDeclarations(dir: string) {
  const problems: string[] = [];
  const files = (await readdir(typesDir, { recursive: true })).filter(file =>
    file.endsWith('.d.ts')
  );

  await Promise.all(
    files.map(async file => {
      const source = join(typesDir, file);
      const fromDir = dirname(source);
      const esm = (await readFile(source, 'utf8'))
        // The CSS is shipped as `style.css`, not as modules next to the types.
        .replace(/^import\s+['"][^'"]+\.css['"];?\n/gm, '')
        .replace(SPECIFIER, (match, prefix, quote, specifier: string) => {
          if (!specifier.startsWith('.') && !specifier.startsWith('~/')) {
            return match;
          }
          const path = specifier.startsWith('~/')
            ? join(typesDir, specifier.slice(2))
            : resolve(fromDir, specifier);
          const target = existsSync(`${path}.d.ts`)
            ? `${path}.js`
            : existsSync(join(path, 'index.d.ts'))
              ? join(path, 'index.js')
              : undefined;
          if (!target) {
            problems.push(`${file}: ${specifier}`);
            return match;
          }
          return `${prefix}${quote}${toSpecifier(fromDir, target)}${quote}`;
        });
      const cjs = esm.replace(SPECIFIER, (match, prefix, quote, specifier) =>
        specifier.startsWith('.')
          ? `${prefix}${quote}${specifier.replace(/\.js$/, '.cjs')}${quote}`
          : match
      );

      const target = join(dir, file);
      await mkdir(dirname(target), { recursive: true });
      await writeFile(target, esm);
      await writeFile(target.replace(/\.d\.ts$/, '.d.cts'), cjs);
    })
  );
  return problems;
}

/**
 * Runs `tsc` alongside the bundle, which also type-checks the build. A type
 * error fails `vite build` and is only logged in watch mode.
 */
const declarations = (): Plugin => {
  let tsc: Promise<void> | undefined;
  return {
    name: 'apsara-declarations',
    apply: 'build',
    async buildStart() {
      await rm(typesDir, { recursive: true, force: true });
      tsc = runTsc();
      // The result is read in writeBundle. This keeps a failure from being
      // reported as unhandled before then.
      tsc.catch(() => undefined);
    },
    async writeBundle(options) {
      if (options.format !== 'es') return;
      try {
        await tsc;
      } catch (error) {
        if (!this.meta.watchMode) throw error;
        this.warn(String(error));
        return;
      }
      const problems = await writeDeclarations(options.dir ?? outDir);
      if (problems.length > 0) {
        this.error(
          `Declarations import modules that do not resolve:\n${problems.join('\n')}`
        );
      }
    }
  };
};

const output: OutputOptions = {
  exports: 'named',
  preserveModules: true,
  preserveModulesRoot: root
};

export default defineConfig({
  resolve: {
    alias: [{ find: /^~\//, replacement: `${root}/` }]
  },
  css: {
    // The class names stay the same as in the Rollup builds. An app that
    // loads two Apsara versions applies both sheets to a shared name, so new
    // names would change its styles.
    transformer: 'postcss',
    modules: { generateScopedName: scopedName }
  },
  build: {
    target: 'esnext',
    outDir,
    emptyOutDir: true,
    sourcemap: true,
    minify: false,
    // The stylesheets plugin minifies with the package's browserslist targets.
    cssMinify: false,
    lib: {
      entry: {
        index: join(root, 'index.tsx'),
        'icons/index': join(root, 'icons/index.tsx'),
        'hooks/index': join(root, 'hooks/index.tsx')
      },
      cssFileName: 'style'
    },
    rolldownOptions: {
      external: id =>
        externals.some(name => id === name || id.startsWith(`${name}/`)),
      onwarn(warning, warn) {
        // `preserveModules` keeps each module's 'use client' in its own file.
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return;
        warn(warning);
      },
      output: [
        {
          ...output,
          format: 'es',
          // dayjs ships CommonJS at its root and ES modules under `esm/`.
          paths: id => {
            if (id === 'dayjs') return 'dayjs/esm/index.js';
            if (id.startsWith('dayjs/plugin/')) {
              return `${id.replace('dayjs/plugin/', 'dayjs/esm/plugin/')}/index.js`;
            }
            return id;
          }
        },
        { ...output, format: 'cjs' }
      ]
    }
  },
  plugins: [declarations(), stylesheets()]
});
