'use client';

import { Button, EmptyState } from '@raystack/apsara';
import { X } from 'lucide-react';
import PlaygroundLayout from './playground-layout';

export function EmptyStateExamples() {
  return (
    <PlaygroundLayout title='EmptyState'>
      <EmptyState
        heading='No Data Available'
        subHeading='Try adjusting your filters.'
        icon={<X size={16} />}
        primaryAction={<Button>Primary Action</Button>}
        secondaryAction={<Button variant='text'>Secondary Action</Button>}
      />
    </PlaygroundLayout>
  );
}
