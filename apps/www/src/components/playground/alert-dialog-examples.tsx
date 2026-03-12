'use client';

import { AlertDialog, Button, Flex } from '@raystack/apsara';
import PlaygroundLayout from './playground-layout';

export function AlertDialogExamples() {
  return (
    <PlaygroundLayout title='AlertDialog'>
      <Flex gap='medium'>
        <AlertDialog>
          <AlertDialog.Trigger render={<Button color='danger' />}>
            Delete Item
          </AlertDialog.Trigger>
          <AlertDialog.Content width='400px'>
            <AlertDialog.Header>
              <AlertDialog.Title>Are you sure?</AlertDialog.Title>
            </AlertDialog.Header>
            <AlertDialog.Body>
              <AlertDialog.Description>
                This action cannot be undone. This will permanently delete the
                item from our servers.
              </AlertDialog.Description>
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <AlertDialog.Close
                render={
                  <Button variant='outline' color='neutral'>
                    Cancel
                  </Button>
                }
              />
              <Button color='danger'>Delete</Button>
            </AlertDialog.Footer>
          </AlertDialog.Content>
        </AlertDialog>
        <AlertDialog>
          <AlertDialog.Trigger render={<Button variant='outline' />}>
            Discard Changes
          </AlertDialog.Trigger>
          <AlertDialog.Content width={400} showCloseButton={false}>
            <AlertDialog.Body>
              <AlertDialog.Title>Unsaved Changes</AlertDialog.Title>
              <AlertDialog.Description>
                You have unsaved changes. Do you want to discard them?
              </AlertDialog.Description>
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <AlertDialog.Close
                render={
                  <Button variant='outline' color='neutral'>
                    Continue Editing
                  </Button>
                }
              />
              <Button color='danger'>Discard</Button>
            </AlertDialog.Footer>
          </AlertDialog.Content>
        </AlertDialog>
      </Flex>
    </PlaygroundLayout>
  );
}
