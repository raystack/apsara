// url=<FIGMA_LINK>?node-id=78-963
// source=https://github.com/raystack/apsara/blob/main/packages/raystack/components/filter-chip/filter-chip.tsx
// component=FilterChip

import figma from 'figma';

// The Figma component exposes no properties, so emit a minimal realistic
// example from the code API (required `label`, plus `columnType` and `value`).

export default {
  id: 'FilterChip',
  imports: ["import { FilterChip } from '@raystack/apsara'"],
  example: figma.code`<FilterChip label='Status' columnType='select' value='active' />`,
  metadata: { nestable: true }
};
