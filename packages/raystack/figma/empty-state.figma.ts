// url=<FIGMA_LINK>?node-id=6144-2601
// source=https://github.com/raystack/apsara/blob/main/packages/raystack/components/empty-state/empty-state.tsx
// component=EmptyState

import figma from 'figma';

const instance = figma.selectedInstance;

// Default variant 'empty1' (Figma "Empty") is omitted; only Zero → 'empty2'.
const variant = instance.getEnum('Variant', {
  Zero: 'empty2'
});

const findTextContent = (name: string) => {
  const t = instance.findText(name);
  return t && t.type === 'TEXT' ? t.textContent : undefined;
};
const renderInstance = (name: string) => {
  const i = instance.findInstance(name);
  return i && i.type === 'INSTANCE' ? i.executeTemplate().example : undefined;
};

// "Heading" / "Sub heading" TEXT layers, gated by their BOOLEANs.
const heading = instance.getBoolean('Heading', {
  true: findTextContent('Heading'),
  false: undefined
});
const subHeading = instance.getBoolean('Sub heading', {
  true: findTextContent('Sub heading'),
  false: undefined
});

// Primary / Secondary actions are distinct Button instances ("Primary Button"
// and "Secondary Button"), gated by their respective BOOLEANs.
const primaryAction = instance.getBoolean('Primary Action', {
  true: renderInstance('Primary Button'),
  false: undefined
});
const secondaryAction = instance.getBoolean('Secondary Action', {
  true: renderInstance('Secondary Button'),
  false: undefined
});

// Icon: the "empty1" variant wraps it in ".state icon" (instance-swap "Icon");
// the "empty2" variant uses a direct icon instance. Try the wrapper first, then
// fall back to the first connected instance that isn't an action button.
const icon = (function () {
  const stateIcon = instance.findInstance('.state icon');
  if (stateIcon && stateIcon.type === 'INSTANCE') {
    const swapped = stateIcon.getInstanceSwap('Icon');
    if (swapped) return swapped.executeTemplate().example;
  }
  const [iconInstance] = instance.findConnectedInstances(
    n => n.name !== 'Primary Button' && n.name !== 'Secondary Button'
  );
  return iconInstance && iconInstance.type === 'INSTANCE'
    ? iconInstance.executeTemplate().example
    : figma.helpers.react.jsxElement('<Icon />');
})();

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
  )}${figma.helpers.react.renderProp('icon', icon)} />`,
  metadata: { nestable: true }
};
