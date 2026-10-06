// @vitest-environment node
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import type { Plugin } from 'rollup';
import { describe, expect, it } from 'vitest';

/* An app that never imports MarkdownAdapter must not ship marked. */

const PACKAGE_ROOT = resolve(__dirname, '../../..');
const PACKAGE_INDEX = join(PACKAGE_ROOT, 'index.tsx');
const { sideEffects } = JSON.parse(
  readFileSync(join(PACKAGE_ROOT, 'package.json'), 'utf8')
) as { sideEffects?: unknown };

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
  try {
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
      // The package's own `sideEffects` setting, as an app's bundler reads it.
      treeshake: {
        moduleSideEffects: (_id, external) => external || sideEffects !== false
      },
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
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

describe('Markdown bundle cost', () => {
  it('ships marked only to an app that imports the adapter', async () => {
    const editorOnly = await bundle(
      `import { Editor } from ${JSON.stringify(PACKAGE_INDEX)};\n` +
        'export const editor = Editor;\n'
    );
    expect(editorOnly).toContain('Editor.Content');
    expect(editorOnly).not.toMatch(/from ['"]marked['"]/);

    const withAdapter = await bundle(
      `import { MarkdownAdapter } from ${JSON.stringify(PACKAGE_INDEX)};\n` +
        'export const adapter = MarkdownAdapter.create();\n'
    );
    expect(withAdapter).toMatch(/from ['"]marked['"]/);
  }, 180_000);
});
