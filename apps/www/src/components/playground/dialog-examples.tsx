'use client';

import { Button, Dialog, Flex } from '@raystack/apsara';
import PlaygroundLayout from './playground-layout';

export function DialogExamples() {
  return (
    <PlaygroundLayout title='Dialog'>
      <Flex gap='medium'>
        <Dialog>
          <Dialog.Trigger render={<Button />}>Dialog</Dialog.Trigger>
          <Dialog.Content
            width='400px'
            overlay={{
              blur: true,
              className: 'custom-overlay',
              style: { backgroundColor: 'rgba(0, 0, 0, 0.5)' }
            }}
          >
            <Dialog.Title>Custom Styled Dialog</Dialog.Title>
            <Dialog.Description className='custom-description'>
              This dialog has custom width and overlay styling.
            </Dialog.Description>
            <Dialog.Close />
          </Dialog.Content>
        </Dialog>
        <Dialog>
          <Dialog.Trigger render={<Button variant='outline' />}>
            Open Dialog
          </Dialog.Trigger>
          <Dialog.Content width={600} showCloseButton={false}>
            <Dialog.Title>No Close Button</Dialog.Title>
            <Dialog.Description>
              This dialog doesn't show the close button.
            </Dialog.Description>
          </Dialog.Content>
        </Dialog>
      </Flex>
    </PlaygroundLayout>
  );
}
