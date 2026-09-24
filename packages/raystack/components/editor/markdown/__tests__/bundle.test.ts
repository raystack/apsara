import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import type { Plugin } from 'rollup';
import { describe, expect, it } from 'vitest';

/* An app that never imports MarkdownAdapter must not ship marked. */

const PACKAGE_ROOT = process.cwd();
const EDITOR_INDEX = resolve(PACKAGE_ROOT, 'components/editor/index.tsx');

/** Resolves `~/` and stubs CSS modules, so the graph is the JavaScript only. */
const sourcePlugin: Plugin = {
  name: 'apsara-source',
  resolveId(id, importer) {
    if (id.endsWith('.css')) return `\0css:${id}`;
    if (id.startsWith('~/')) {
      return this.resolve(join(PACKAGE_ROOT, id.slice(2)), importer, {
        skipSelf: true
      });
    }
    return null;
  },
  load(id) {
    return id.startsWith('\0css:') ? 'export default {};' : null;
  }
};

async function bundle(source: string): Promise<string> {
  const dir = mkdtempSync(join(tmpdir(), 'apsara-editor-bundle-'));
  const entry = join(dir, 'fixture.ts');
  writeFileSync(entry, source);

  const { rollup } = await import('rollup');
  const { nodeResolve } = await import('@rollup/plugin-node-resolve');
  const typescript = (await import('@rollup/plugin-typescript')).default;

  const build = await rollup({
    input: entry,
    // Libraries stay external, so a kept `marked` shows as an import.
    external: id =>
      !id.startsWith('.') &&
      !id.startsWith('/') &&
      !id.startsWith('~') &&
      !id.startsWith('\0'),
    // The package declares `"sideEffects": false`, so an app's bundler drops
    // an Apsara module whose exports it does not use.
    treeshake: { moduleSideEffects: (_id, external) => external },
    plugins: [
      sourcePlugin,
      nodeResolve({ extensions: ['.ts', '.tsx', '.js'] }),
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
    onwarn: () => undefined
  });
  const { output } = await build.generate({ format: 'es' });
  await build.close();
  return output
    .map(chunk => (chunk.type === 'chunk' ? chunk.code : ''))
    .join('\n');
}

describe('Markdown bundle cost', () => {
  it('leaves marked out of a JSON-only app', async () => {
    const code = await bundle(
      `import { Editor } from ${JSON.stringify(EDITOR_INDEX)};\n` +
        'export const editor = Editor;\n'
    );
    expect(code).toContain('Editor.Content');
    expect(code).not.toMatch(/from ['"]marked['"]/);
  }, 120_000);

  it('includes marked when the app imports the adapter', async () => {
    const code = await bundle(
      `import { MarkdownAdapter } from ${JSON.stringify(EDITOR_INDEX)};\n` +
        'export const adapter = MarkdownAdapter.create();\n'
    );
    expect(code).toMatch(/from ['"]marked['"]/);
  }, 120_000);
});
