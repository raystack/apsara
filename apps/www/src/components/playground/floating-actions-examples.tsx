'use client';

import { TransformIcon } from '@radix-ui/react-icons';
import { Button, Chip, Flex, FloatingActions, Text } from '@raystack/apsara';
import PlaygroundLayout from './playground-layout';

export function FloatingActionsExamples() {
  return (
    <PlaygroundLayout title='FloatingActions'>
      <Flex direction='column' gap='large'>
        <Text>Default:</Text>
        <FloatingActions aria-label='Selection actions'>
          <Chip
            variant='outline'
            size='large'
            color='accent'
            leadingIcon={<TransformIcon />}
            isDismissible
          >
            2 selected
          </Chip>
          <FloatingActions.Separator />
          <Button variant='outline' color='neutral' size='small'>
            Move to
          </Button>
          <Button variant='outline' color='neutral' size='small'>
            Actions
          </Button>
        </FloatingActions>

        <Text>Multiple action groups:</Text>
        <FloatingActions aria-label='Bulk actions'>
          <Chip
            variant='outline'
            size='large'
            color='accent'
            leadingIcon={<TransformIcon />}
            isDismissible
          >
            5 selected
          </Chip>
          <FloatingActions.Separator />
          <Button variant='outline' color='neutral' size='small'>
            Archive
          </Button>
          <Button variant='outline' color='neutral' size='small'>
            Move to
          </Button>
          <FloatingActions.Separator />
          <Button variant='outline' color='danger' size='small'>
            Delete
          </Button>
        </FloatingActions>
      </Flex>
    </PlaygroundLayout>
  );
}
