import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

/* Per-key tree-shaking needs the PURE annotations, no side effects, and no aggregate map. */

const ICONS_DIR = resolve(process.cwd(), 'icons');

const IMPORTED = ['CheckIcon', 'CopyIcon', 'XIcon'] as const;
const NOT_IMPORTED = [
  'ClearIcon',
  'ErrorIcon',
  'FilterIcon',
  'ArrowUpIcon',
  'CoPilotIcon',
  'ChevronDownIcon'
] as const;

/** `createIcon('XIcon', X)`, quoted so `XIcon` cannot match `ClearIcon`. */
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

  // Use rolldown, the bundler that builds this package.
  const { rolldown } = await import('rolldown');

  const bundle = await rolldown({
    input: entry,
    // Keep the libraries out so the assertions read the icon graph only.
    external: [/^react($|\/)/, 'lucide-react'],
    tsconfig: false,
    transform: { jsx: 'react-jsx' },
    resolve: { extensions: ['.ts', '.tsx', '.js'] },
    // A directive is not a side effect, and the warning is noise here.
    logLevel: 'silent'
  });

  const { output } = await bundle.generate({ format: 'es' });
  await bundle.close();

  return output
    .map(chunk => (chunk.type === 'chunk' ? chunk.code : ''))
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
