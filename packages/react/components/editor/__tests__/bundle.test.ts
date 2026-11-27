// @vitest-environment node
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, join, resolve } from 'node:path';
import type { Plugin } from 'rolldown';
import { describe, expect, it } from 'vitest';

/* An app that never imports MarkdownAdapter must not ship marked. */

const PACKAGE_ROOT = resolve(__dirname, '../../..');
const PACKAGE_INDEX = join(PACKAGE_ROOT, 'index.tsx');
const { sideEffects } = JSON.parse(
  readFileSync(join(PACKAGE_ROOT, 'package.json'), 'utf8')
) as { sideEffects?: boolean | string[] };

/** Reads `sideEffects` the way an app's bundler does: `*.css` globs match file names. */
const hasSideEffects = (id: string) =>
  Array.isArray(sideEffects)
    ? sideEffects.some(glob =>
        new RegExp(
          `^${glob.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '[^/]*')}$`
        ).test(basename(id))
      )
    : sideEffects !== false;

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
    return id.startsWith('\0css:')
      ? { code: 'export default {};', moduleType: 'js' }
      : null;
  }
};

async function bundle(source: string): Promise<string> {
  const dir = mkdtempSync(join(tmpdir(), 'apsara-editor-bundle-'));
  try {
    const entry = join(dir, 'fixture.ts');
    writeFileSync(entry, source);

    const { rolldown } = await import('rolldown');

    const build = await rolldown({
      input: entry,
      // Libraries stay external, so a kept `marked` shows as an import.
      external: id =>
        !id.startsWith('.') &&
        !id.startsWith('/') &&
        !id.startsWith('~') &&
        !id.startsWith('\0'),
      // The package's own `sideEffects` setting, as an app's bundler reads it.
      treeshake: {
        moduleSideEffects: (id, external) => external || hasSideEffects(id)
      },
      tsconfig: false,
      transform: { jsx: 'react-jsx' },
      resolve: { extensions: ['.ts', '.tsx', '.js'] },
      plugins: [sourcePlugin],
      logLevel: 'silent'
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

/* PromptInput runs on the core store, so it must not ship the rich editor. */

describe('PromptInput bundle cost', () => {
  it('leaves out the rich editor features', async () => {
    const promptInput = await bundle(
      `import { PromptInput } from ${JSON.stringify(PACKAGE_INDEX)};\n` +
        'export const input = PromptInput;\n'
    );
    expect(promptInput).toContain('PromptInput.Editor');
    for (const name of [
      'prosemirror-schema-list',
      'prosemirror-inputrules',
      'prosemirror-dropcursor',
      'prosemirror-gapcursor'
    ]) {
      expect(promptInput).not.toMatch(new RegExp(`from ['"]${name}['"]`));
    }
    expect(promptInput).not.toContain('class RichEditorStore');
  }, 180_000);
});
