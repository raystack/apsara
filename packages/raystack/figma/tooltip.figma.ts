// url=<FIGMA_LINK>?node-id=3598-25261
// source=https://github.com/raystack/apsara/blob/main/packages/raystack/components/tooltip/tooltip.tsx
// component=Tooltip

import figma from 'figma';

function findTextContent(name: string): string | undefined {
  const node = figma.selectedInstance.findText(name);
  return node && node.type === 'TEXT' ? node.textContent : undefined;
}

const message = findTextContent('Tooltip text');

// Nob (the arrow) maps to the `showArrow` prop on Tooltip.Content.
const showArrow = figma.selectedInstance.getBoolean('Nob', {
  true: true,
  false: undefined
});

// Base UI positioning splits into two props: `side` (vertical) and `align`
// (horizontal). V Position -> side, H Position -> align.
const side = figma.selectedInstance.getEnum('V Position', {
  Bottom: 'bottom'
});
const align = figma.selectedInstance.getEnum('H Position', {
  Left: 'start',
  Right: 'end'
});

// Contrast (Low/High) has no code counterpart and is intentionally not mapped.

export default {
  id: 'Tooltip',
  imports: ["import { Tooltip } from '@raystack/apsara'"],
  example: figma.code`<Tooltip>
      <Tooltip.Trigger render={<button />}>TOOLTIP_TRIGGER</Tooltip.Trigger>
      <Tooltip.Content${figma.helpers.react.renderProp(
        'side',
        side
      )}${figma.helpers.react.renderProp(
        'align',
        align
      )}${figma.helpers.react.renderProp(
        'showArrow',
        showArrow
      )}>${figma.helpers.react.renderChildren(message)}</Tooltip.Content>
    </Tooltip>`,
  metadata: { nestable: true }
};
