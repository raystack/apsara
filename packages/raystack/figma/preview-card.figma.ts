// url=<FIGMA_LINK>?node-id=8980-1047
// source=https://github.com/raystack/apsara/blob/main/packages/raystack/components/preview-card/preview-card.tsx
// component=PreviewCard

import figma from 'figma';

// PreviewCard has no Figma component properties — compose a minimal realistic
// example using the public sub-components (Trigger / Content).

export default {
  id: 'PreviewCard',
  imports: ["import { PreviewCard } from '@raystack/apsara'"],
  example: figma.code`<PreviewCard>
  <PreviewCard.Trigger>Hover me</PreviewCard.Trigger>
  <PreviewCard.Content>Preview content</PreviewCard.Content>
</PreviewCard>`,
  metadata: { nestable: false }
};
