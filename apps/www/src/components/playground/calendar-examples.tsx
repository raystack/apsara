'use client';

import { Calendar, DatePicker, Flex, RangePicker } from '@raystack/apsara';
import PlaygroundLayout from './playground-layout';

export function CalendarExamples() {
  return (
    <PlaygroundLayout title='Calendar'>
      <Flex gap='medium' direction='column'>
        <Calendar numberOfMonths={2} />
        <RangePicker inputFieldsProps={{ startDate: { size: 'small' } }} />
        <DatePicker inputFieldProps={{ size: 'medium' }} />
      </Flex>
    </PlaygroundLayout>
  );
}
