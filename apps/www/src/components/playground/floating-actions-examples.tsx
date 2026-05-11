'use client';

import { CheckCircledIcon } from '@radix-ui/react-icons';
import { Button, Chip, Flex, FloatingActions, Text } from '@raystack/apsara';
import PlaygroundLayout from './playground-layout';

export function FloatingActionsExamples() {
  return (
    <PlaygroundLayout title='FloatingActions'>
      <Flex direction='column' gap={9}>
        <Text>Inline:</Text>
        <FloatingActions variant='inline' aria-label='Selection actions'>
          <Chip
            variant='outline'
            size='large'
            color='accent'
            leadingIcon={<CheckCircledIcon />}
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

        <Text>Inline — multiple action groups:</Text>
        <FloatingActions variant='inline' aria-label='Bulk actions'>
          <Chip
            variant='outline'
            size='large'
            color='accent'
            leadingIcon={<CheckCircledIcon />}
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

        <Text>Inline — grouped actions:</Text>
        <FloatingActions variant='inline' aria-label='Bulk actions'>
          <Chip
            variant='outline'
            size='large'
            color='accent'
            leadingIcon={<CheckCircledIcon />}
            isDismissible
          >
            3 selected
          </Chip>
          <FloatingActions.Separator />
          <FloatingActions.Group>
            <Button variant='outline' color='neutral' size='small'>
              Archive
            </Button>
            <Button variant='outline' color='neutral' size='small'>
              Move to
            </Button>
          </FloatingActions.Group>
          <FloatingActions.Separator />
          <FloatingActions.Group>
            <Button variant='outline' color='danger' size='small'>
              Delete
            </Button>
          </FloatingActions.Group>
        </FloatingActions>

        <Text>Floating (default) — pins to bottom-center of the viewport:</Text>
        <FloatingActions aria-label='Floating selection actions'>
          <Chip
            variant='outline'
            size='large'
            color='accent'
            leadingIcon={<CheckCircledIcon />}
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
      </Flex>
    </PlaygroundLayout>
  );
}
