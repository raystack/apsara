'use client';

import { Calendar, DatePicker, Flex, RangePicker } from '@raystack/apsara';
import PlaygroundLayout from './playground-layout';

/** Playground showcase for `Calendar`, `DatePicker`, and `RangePicker` using the `slotProps` API. */
export function CalendarExamples() {
  return (
    <PlaygroundLayout title='Calendar'>
      <Flex gap={5} direction='column'>
        <Calendar numberOfMonths={2} />
        <RangePicker slotProps={{ startInput: { size: 'small' } }} />
        <DatePicker slotProps={{ input: { size: 'small' } }} />
      </Flex>
    </PlaygroundLayout>
  );
}
