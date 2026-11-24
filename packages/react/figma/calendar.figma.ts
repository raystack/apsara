// url=<FIGMA_LINK>?node-id=722-205
// source=https://github.com/raystack/apsara/blob/main/packages/react/components/calendar/calendar.tsx
// component=Calendar

import figma from 'figma';

// Plain COMPONENT with no Figma properties, so emit the inline day view.

export default {
  id: 'Calendar',
  imports: ["import { Calendar } from '@raystack/apsara'"],
  example: figma.code`<Calendar>
  <Calendar.Days />
</Calendar>`,
  metadata: { nestable: false }
};
