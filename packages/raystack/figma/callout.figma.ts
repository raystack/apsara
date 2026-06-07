// url=<FIGMA_LINK>?node-id=661-1063
// source=https://github.com/raystack/apsara/blob/main/packages/raystack/components/callout/callout.tsx
// component=Callout

import figma from 'figma';

const type = figma.selectedInstance.getEnum('Type', {
  Accent: 'accent',
  Success: 'success',
  Alert: 'alert',
  Gradient: 'gradient',
  Attentio: 'attention',
  Normal: 'normal',
  Grey: 'grey'
});
// Outline and High Contrast are VARIANT (False/True) in Figma — map True to the boolean
// prop and leave False unmapped (renderProp omits undefined).
const outline = figma.selectedInstance.getEnum('Outline', {
  True: true
});
const highContrast = figma.selectedInstance.getEnum('High Contrast', {
  True: true
});
// children text, `dismissible` and `action` live on the nested ".callout_structure"
// instance (guarded — findInstance returns an ErrorHandle when absent).
const structure = (function () {
  const nested = figma.selectedInstance.findInstance('.callout_structure');
  if (!nested || nested.type !== 'INSTANCE') {
    return { children: undefined, dismissible: undefined, action: undefined };
  }
  const message = nested.findText(
    'A short message to attract user’s attention'
  );
  return {
    children:
      message && message.type === 'TEXT' ? message.textContent : undefined,
    dismissible: nested.getBoolean('Dismiss'),
    action: nested.getBoolean('Action', {
      true: (function () {
        const btn = nested.findInstance('Button');
        return btn && btn.type === 'INSTANCE'
          ? btn.executeTemplate().example
          : undefined;
      })(),
      false: undefined
    })
  };
})();

export default {
  id: 'Callout',
  imports: ["import { Callout } from '@raystack/apsara'"],
  example: figma.code`<Callout${figma.helpers.react.renderProp(
    'type',
    type
  )}${figma.helpers.react.renderProp(
    'outline',
    outline
  )}${figma.helpers.react.renderProp(
    'highContrast',
    highContrast
  )}${figma.helpers.react.renderProp(
    'dismissible',
    structure.dismissible
  )}${figma.helpers.react.renderProp(
    'action',
    structure.action
  )}>${figma.helpers.react.renderChildren(
    structure.children ?? "A short message to attract user's attention"
  )}</Callout>`,
  metadata: { nestable: true }
};
