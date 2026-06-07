// url=<FIGMA_LINK>?node-id=722-205
// source=https://github.com/raystack/apsara/blob/main/packages/raystack/components/calendar/calendar.tsx
// component=Calendar

import figma from 'figma';

// Plain COMPONENT with no Figma properties — emit a simple example with
// sensible defaults from the code API (`mode` defaults to 'single').

export default {
  id: 'Calendar',
  imports: ["import { Calendar } from '@raystack/apsara'"],
  example: figma.code`<Calendar mode="single" />`,
  metadata: { nestable: false }
};
