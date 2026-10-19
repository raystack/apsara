import { expect, test } from 'vitest';
import { parseCommit } from './changelog';

const select = ['packages/react/components/select/select-root.tsx'];

test.each([
  ['fix: [select] keep focus (#1)', [], ['select']],
  ['feat: [dialog, data-view] add sizes (#2)', [], ['dialog', 'data-view']],
  ['fix(theme): set dir (#3)', [], ['theme']],
  ['fix: keep focus (#4)', select, ['select']],
  [
    'fix: keep focus (#5)',
    [...select, 'packages/react/components/menu/menu-root.tsx'],
    undefined
  ],
  ['fix: [docs] fix a typo (#6)', [], ['docs']],
  ['docs: [select] fix a typo (#7)', [], undefined],
  ['fix: [select] keep focus', [], undefined]
])('%s', (subject, files, scopes) => {
  expect(parseCommit(subject, files)?.scopes).toEqual(scopes);
});
