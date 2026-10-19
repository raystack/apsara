import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterAll, expect, test } from 'vitest';
import { checkDocsProps } from './check-docs-props.js';

const root = mkdtempSync(path.join(tmpdir(), 'docs-props-'));
afterAll(() => rmSync(root, { recursive: true, force: true }));

function write(file, content) {
  mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
  writeFileSync(path.join(root, file), content);
}

write(
  'src/index.tsx',
  `export { Flex, type FlexProps } from './components/flex/flex';
export { type BarProps, Foo, type FooProps } from './components/foo/foo';
`
);
write(
  'src/components/flex/flex.tsx',
  `export interface FlexProps { gap?: number }
export function Flex(_props: FlexProps) { return null; }
`
);
write(
  'src/components/foo/foo.tsx',
  `import type { FlexProps } from '../flex/flex';
export interface FooProps {
  size: 'small' | 'large';
  /** @deprecated Use \`size\`. */
  legacy?: boolean;
  open?: boolean | 'trap-focus';
  tone?: string;
  internalFlag?: boolean;
}
export type BarProps = { kind: 'a'; label: string } | { kind: 'b' };
export interface FooItemData { label?: string }
type PartProps = FlexProps & { title?: string };
function FooRoot(_props: FooProps) { return null; }
function FooPart(_props: PartProps) { return null; }
export const Foo = Object.assign(FooRoot, {
  Header: FooPart,
  Body: FooPart,
  Footer: FooPart
});
`
);
write(
  'docs/foo/props.ts',
  `export type Size = 'small' | 'large';
export interface FooProps {
  size?: Size;
  legacy?: boolean;
  open?: boolean;
  extra?: string;
}
export interface FooHeaderProps { title?: string }
export interface FooBodyProps { title?: string }
export interface FooFooterProps { title?: string }
export interface BarProps { kind: 'a' | 'b'; label?: string }
export interface FooItem { label?: string }
export interface Orphan { label?: string }
export interface DocsOnlyThing { label?: string }
`
);
write(
  'docs/foo/index.mdx',
  `### Header

- Inherits all Flex props

<auto-type-table path="./props.ts" name="FooHeaderProps" />

### Footer

<auto-type-table path="./props.ts" name="FooFooterProps" />
`
);

test('reports each rule', () => {
  const issues = checkDocsProps({
    sourceEntry: path.join(root, 'src/index.tsx'),
    docsFiles: [path.join(root, 'docs/foo/props.ts')],
    config: {
      matches: { FooItem: 'components/foo/foo.tsx#FooItemData' },
      docsOnly: { DocsOnlyThing: 'Fixture type with no component.' },
      inherits: { FooHeaderProps: ['Flex'], FooFooterProps: ['Flex'] },
      internal: { FooProps: { internalFlag: 'Fixture internal prop.' } }
    }
  });

  expect(issues.map(({ rule, name, prop }) => [rule, name, prop])).toEqual([
    ['optional', 'FooProps', 'size'],
    ['deprecated', 'FooProps', 'legacy'],
    ['literals', 'FooProps', 'open'],
    ['unknown', 'FooProps', 'extra'],
    ['missing', 'FooProps', 'tone'],
    ['inherits', 'FooBodyProps', 'gap'],
    ['inheritsText', 'FooFooterProps', undefined],
    ['unmatched', 'Orphan', undefined]
  ]);
});
