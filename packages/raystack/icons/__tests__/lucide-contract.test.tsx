import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { render } from '@testing-library/react';
import * as lucide from 'lucide-react';
import { describe, expect, it } from 'vitest';
import { CheckIcon } from '../icons';

/**
 * The peer range spans two lucide majors (`>=0.500.0 <2.0.0`), so what Apsara
 * relies on has to hold across both. It relies on three things only, and this
 * file pins each one:
 *
 *   1. every drawing it imports is still exported under that name,
 *   2. `width` / `height` / `strokeWidth` are plain SVG props, and
 *   3. the viewBox is 24 units, which is what makes `strokeWidth={1.5}` a 1px
 *      stroke at 16px.
 *
 * A lucide release that breaks any of them fails here rather than in a
 * consumer's app.
 */

/** vitest runs with the package root as the cwd. */
const ICONS_SRC = resolve(process.cwd(), 'icons/icons.tsx');

/** The lucide names `icons.tsx` imports, read from its own import block. */
function importedNames(): string[] {
  const src = readFileSync(ICONS_SRC, 'utf8');
  const block = src.match(/import \{([\s\S]*?)\} from 'lucide-react';/);
  if (!block) throw new Error('no lucide import block in icons.tsx');
  return block[1]
    .split(',')
    .map(name => name.trim())
    .filter(Boolean);
}

describe('lucide contract', () => {
  it('exports every drawing icons.tsx imports', () => {
    const names = importedNames();

    expect(names.length).toBeGreaterThan(0);
    expect(names.filter(name => !(name in lucide))).toEqual([]);
  });

  it('takes size and stroke as SVG props, on a 24-unit viewBox', () => {
    const { container } = render(<CheckIcon />);
    const svg = container.querySelector('svg');

    expect(svg).toHaveAttribute('width', '16');
    expect(svg).toHaveAttribute('height', '16');
    expect(svg).toHaveAttribute('stroke-width', '1.5');
    // Not 0 0 16 16: the rendered stroke is strokeWidth x size / 24.
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
  });
});
