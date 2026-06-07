// url=<FIGMA_LINK>?node-id=497-911
// source=https://github.com/raystack/apsara/blob/main/packages/raystack/components/breadcrumb/breadcrumb-root.tsx
// component=Breadcrumb

import figma from 'figma';

const instance = figma.selectedInstance;

// Figma `Size` is Small/Large; code root supports `small` and `medium`.
// Map Large -> medium (the larger of the two code options).
const size = instance.getEnum('Size', {
  Small: 'small',
  Large: 'medium'
});

export default {
  id: 'Breadcrumb',
  imports: ["import { Breadcrumb } from '@raystack/apsara'"],
  example: figma.code`<Breadcrumb${figma.helpers.react.renderProp(
    'size',
    size
  )}>
  <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
  <Breadcrumb.Separator />
  <Breadcrumb.Item href="/components">Components</Breadcrumb.Item>
  <Breadcrumb.Separator />
  <Breadcrumb.Item current>Breadcrumb</Breadcrumb.Item>
</Breadcrumb>`,
  metadata: { nestable: false }
};
