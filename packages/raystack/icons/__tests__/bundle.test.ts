import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Protects the one-file map: `icons/icons.tsx` holds all 31 keys, and a
 * consumer still pays only for the keys it imports.
 *
 * This is the load-bearing measurement of the design. Splitting the map into
 * one module per icon would make per-key removal trivial for any bundler; a
 * single module makes it depend on the `/*#__PURE__*\/` annotation on every
 * `createIcon(…)` call, and on nothing in the module having a side effect.
 *
 * It also fails if anything reintroduces an aggregate icon map — a merged
 * `{ ...defaultIcons, ...overrides }` in `IconProvider`, or a runtime
 * `ICON_NAMES` array. Either would put all 31 icons in every bundle.
 */

/** vitest runs with the package root as the cwd. */
const ICONS_DIR = resolve(process.cwd(), 'icons');

const IMPORTED = ['CheckIcon', 'CopyIcon', 'XIcon'] as const;
const NOT_IMPORTED = [
  'ClearIcon',
  'ErrorIcon',
  'TableIcon',
  'ArrowUpIcon',
  'CoPilotIcon',
  'ChevronDownIcon'
] as const;

/** `createIcon('XIcon', X)` — quoted, so `XIcon` cannot match `ClearIcon`. */
const registration = (name: string) =>
  new RegExp(`createIcon\\(\\s*["']${name}["']`);

async function bundleFixture() {
  const dir = mkdtempSync(join(tmpdir(), 'apsara-icon-bundle-'));
  const entry = join(dir, 'fixture.ts');
  writeFileSync(
    entry,
    `import { ${IMPORTED.join(', ')} } from ${JSON.stringify(
      join(ICONS_DIR, 'icons')
    )};\n` + `export const icons = [${IMPORTED.join(', ')}];\n`
  );

  // Use rollup, the bundler that actually builds this package.
  const { rollup } = await import('rollup');
  const { nodeResolve } = await import('@rollup/plugin-node-resolve');
  const typescript = (await import('@rollup/plugin-typescript')).default;
  const svgr = (await import('@svgr/rollup')).default;

  const bundle = await rollup({
    input: entry,
    // Keep the libraries out so the assertions read the icon graph only.
    external: [/^react($|\/)/, 'lucide-react'],
    plugins: [
      nodeResolve({ extensions: ['.ts', '.tsx', '.js'] }),
      // The map reaches the in-house SVG default, so rollup must be able to
      // parse it even though it then shakes it out. `exportType: named` gives
      // the `ReactComponent` export that the package build produces.
      svgr({ exportType: 'named' }),
      typescript({
        tsconfig: false,
        jsx: 'react-jsx',
        target: 'esnext',
        module: 'esnext',
        moduleResolution: 'bundler',
        declaration: false,
        skipLibCheck: true,
        noEmitOnError: false
      })
    ],
    // A directive is not a side effect, and the warning is noise here.
    onwarn: warning => {
      if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return;
      if (warning.code === 'PLUGIN_WARNING') return;
    }
  });

  const { output } = await bundle.generate({ format: 'es' });
  await bundle.close();

  return output
    .filter(chunk => chunk.type === 'chunk')
    .map(chunk => ('code' in chunk ? chunk.code : ''))
    .join('\n');
}

// The bundle is a pure function of the source tree, so build it once.
let cached: Promise<string> | undefined;
const bundleOnce = () => (cached ??= bundleFixture());

describe('icon bundle', () => {
  it('includes only the icons the fixture imports', async () => {
    const code = await bundleOnce();

    for (const name of IMPORTED) {
      expect(code, `${name} should be in the bundle`).toMatch(
        registration(name)
      );
    }

    for (const name of NOT_IMPORTED) {
      expect(code, `${name} must not be in the bundle`).not.toMatch(
        registration(name)
      );
    }
  }, 120_000);

  it('pulls in only the lucide icons those three need', async () => {
    const code = await bundleOnce();

    // The lucide import list is the real cost to the consumer.
    const lucideImport = code.match(
      /import\s*\{([^}]*)\}\s*from\s*["']lucide-react["']/
    );
    expect(lucideImport, 'the bundle should import from lucide-react').not.toBe(
      null
    );

    const names = (lucideImport?.[1] ?? '')
      .split(',')
      .map(part => part.split(/\s+as\s+/)[0].trim())
      .filter(Boolean)
      .sort();

    expect(names).toEqual(['Check', 'Copy', 'X']);
  }, 120_000);
});
