// url=<FIGMA_LINK>?node-id=209-1186
// source=https://github.com/raystack/apsara/blob/main/packages/raystack/components/search/search.tsx
// component=Search

import figma from 'figma';

const findTextContent = (name: string) => {
  const t = figma.selectedInstance.findText(name);
  return t && t.type === 'TEXT' ? t.textContent : undefined;
};

// State Hover/Active are visual-only — only the filled states surface a typed value.
const placeholder = figma.selectedInstance.getEnum('State', {
  Default: findTextContent('Search...'),
  Active: findTextContent('Search...'),
  Hover: findTextContent('Search...')
});
const value = figma.selectedInstance.getEnum('State', {
  Filled: findTextContent('Search...'),
  Filled_Active: findTextContent('Search...')
});
// Search renders its own leading magnifying-glass icon — the Leading Icon
// boolean has no public prop, so it is intentionally not mapped.
const size = figma.selectedInstance.getEnum('Size', {
  Small: 'small',
  Large: 'large'
});
const variant = figma.selectedInstance.getEnum('Outline', {
  False: 'borderless'
});

export default {
  id: 'Search',
  imports: ["import { Search } from '@raystack/apsara'"],
  example: figma.code`<Search${figma.helpers.react.renderProp(
    'placeholder',
    placeholder
  )}${figma.helpers.react.renderProp(
    'value',
    value
  )}${figma.helpers.react.renderProp(
    'size',
    size
  )}${figma.helpers.react.renderProp('variant', variant)}/>`,
  metadata: { nestable: true }
};
