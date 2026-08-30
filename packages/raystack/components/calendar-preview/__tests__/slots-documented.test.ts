import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/*
 * `data-slot` names are public API covered by semver, and three separate
 * audits found slots shipping without ever reaching a document. Rather than
 * re-checking by hand, the docs page is asserted to list exactly what the
 * component emits.
 */
const componentDir = join(__dirname, '..');
const docsPage = join(
  __dirname,
  '../../../../../apps/www/src/content/docs/components/calendar-preview/index.mdx'
);

describe('CalendarPreview data-slot documentation', () => {
  it('documents every slot the component emits, and no others', () => {
    const emitted = new Set<string>();
    for (const file of readdirSync(componentDir)) {
      if (!file.endsWith('.tsx')) continue;
      const source = readFileSync(join(componentDir, file), 'utf8');
      for (const match of source.matchAll(
        /data-slot='(calendar-preview-[a-z-]+)'/g
      )) {
        emitted.add(match[1]);
      }
    }

    const page = readFileSync(docsPage, 'utf8');
    const documented = new Set(
      [...page.matchAll(/^\| `(calendar-preview-[a-z-]+)` \|$/gm)].map(
        match => match[1]
      )
    );

    expect(
      [...emitted].filter(slot => !documented.has(slot)).sort(),
      'emitted but not in the docs Slots table'
    ).toEqual([]);
    expect(
      [...documented].filter(slot => !emitted.has(slot)).sort(),
      'documented but no longer emitted'
    ).toEqual([]);
  });
});
