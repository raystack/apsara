// url=<FIGMA_LINK>?node-id=6144-2601
// source=https://github.com/raystack/apsara/blob/main/packages/raystack/components/empty-state/empty-state.tsx
// component=EmptyState

import figma from 'figma';

const variant = figma.selectedInstance.getEnum('Variant', {
  Empty: 'empty1',
  Zero: 'empty2'
});
const findTextContent = (name: string) => {
  const t = figma.selectedInstance.findText(name);
  return t && t.type === 'TEXT' ? t.textContent : undefined;
};
const heading = figma.selectedInstance.getBoolean('Heading', {
  true: figma.selectedInstance.getEnum('Variant', {
    Empty: findTextContent('Looking for images in this area?'),
    Zero: findTextContent('Organization')
  }),
  false: undefined
});
const subHeading = figma.selectedInstance.getBoolean('Sub heading', {
  true: figma.selectedInstance.getEnum('Variant', {
    Empty: findTextContent('Draw your area of interest to find images'),
    Zero: findTextContent(
      'An organization in Aurora is a shared workspace where teams manage projects, AOIs, and image orders. It streamlines collaboration, analysis, and decision-making across industries.'
    )
  }),
  false: undefined
});
const icon = (function () {
  const nested = figma.selectedInstance.findInstance('.state icon');
  return nested && nested.type === 'INSTANCE'
    ? nested.getInstanceSwap('Icon')?.executeTemplate().example
    : undefined;
})();
const buttonExample = (function () {
  const btn = figma.selectedInstance.findInstance('Button');
  return btn && btn.type === 'INSTANCE'
    ? btn.executeTemplate().example
    : undefined;
})();
const primaryAction = figma.selectedInstance.getBoolean('Primary Action', {
  true: buttonExample,
  false: undefined
});
const secondaryAction = figma.selectedInstance.getBoolean('Secondary Action', {
  true: buttonExample,
  false: undefined
});

export default {
  id: 'EmptyState',
  imports: ["import { EmptyState } from '@raystack/apsara'"],
  example: figma.code`<EmptyState${figma.helpers.react.renderProp(
    'variant',
    variant
  )}${figma.helpers.react.renderProp(
    'heading',
    heading
  )}${figma.helpers.react.renderProp(
    'subHeading',
    subHeading
  )}${figma.helpers.react.renderProp(
    'primaryAction',
    primaryAction
  )}${figma.helpers.react.renderProp(
    'secondaryAction',
    secondaryAction
  )}${figma.helpers.react.renderProp('icon', icon)}/>`,
  metadata: { nestable: true }
};
