'use client';

import { Calendar, DatePicker, Flex, RangePicker } from '@raystack/apsara';
import PlaygroundLayout from './playground-layout';

export function CalendarExamples() {
  return (
    <PlaygroundLayout title='Calendar'>
      <Flex gap={5} direction='column'>
        <Calendar numberOfMonths={2} />
        <RangePicker inputsProps={{ startDate: { size: 'small' } }} />
        <DatePicker inputProps={{ size: 'small' }} />
      </Flex>
    </PlaygroundLayout>
  );
}
