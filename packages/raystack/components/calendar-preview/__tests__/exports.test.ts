import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/*
 * RFC 005 problem 10 is that the old family's types are unexported and absent
 * from the barrel, so "consumers cannot type a RangePicker wrapper". That is
 * easy to reproduce by adding a part and forgetting the root barrel, which is
 * exactly what happened once here — so it is asserted rather than remembered.
 */
const root = join(__dirname, '../../..');

const exportedNames = (source: string, from: string) => {
  const blocks = source.match(
    new RegExp(`export (?:type )?\\{[^}]*\\} from '${from}'`, 'g')
  );
  if (!blocks) return new Set<string>();
  return new Set(
    blocks
      .flatMap(block => block.replace(/^[^{]*\{|\}[^}]*$/g, '').split(','))
      .map(entry => entry.trim().replace(/^type\s+/, ''))
      .map(entry => (entry.includes(' as ') ? entry.split(' as ')[1] : entry))
      .map(entry => entry.trim())
      .filter(Boolean)
  );
};

describe('CalendarPreview published surface', () => {
  it('re-exports every public name from the root barrel', () => {
    const componentIndex = readFileSync(
      join(root, 'components/calendar-preview/index.tsx'),
      'utf8'
    );
    const barrel = readFileSync(join(root, 'index.tsx'), 'utf8');

    const fromParts = new Set<string>();
    for (const block of componentIndex.split('\n\n')) {
      for (const name of exportedNames(
        componentIndex,
        './calendar-preview.*?'
      )) {
        fromParts.add(name);
      }
      void block;
    }

    // Every name the component index publishes, however it is spelled.
    const published = new Set(
      [...componentIndex.matchAll(/^\s{2}(?:type\s+)?([A-Za-z][\w]*)/gm)]
        .map(match => match[1])
        .filter(name => name !== 'type')
    );
    // Aliased re-exports land under their alias, not their local name.
    published.delete('CalendarPreviewRootProps');
    for (const name of fromParts) published.add(name);

    const barrelNames = exportedNames(barrel, './components/calendar-preview');

    const missing = [...published].filter(name => !barrelNames.has(name));
    expect(missing, `not re-exported from packages/raystack/index.tsx`).toEqual(
      []
    );
  });
});
