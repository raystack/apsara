'use client';

import { Button, Flex, Toast, toastManager } from '@raystack/apsara';
import PlaygroundLayout from './playground-layout';

export function ToastExamples() {
  return (
    <PlaygroundLayout title='Toast'>
      <Toast.Provider position='bottom-right'>
        <Flex gap='large' wrap='wrap'>
          <Button
            onClick={() =>
              toastManager.add({ title: 'Success toast', type: 'success' })
            }
          >
            Success Toast
          </Button>
          <Button
            onClick={() =>
              toastManager.add({ title: 'Error toast', type: 'error' })
            }
          >
            Error Toast
          </Button>
          <Button
            onClick={() =>
              toastManager.add({ title: 'Warning toast', type: 'warning' })
            }
          >
            Warning Toast
          </Button>
          <Button
            onClick={() =>
              toastManager.add({ title: 'Info toast', type: 'info' })
            }
          >
            Info Toast
          </Button>
        </Flex>
        <Flex gap='large' wrap='wrap'>
          <Button
            onClick={() =>
              toastManager.add({
                title: 'With description',
                description: 'This toast has a title and a description.',
                type: 'success'
              })
            }
          >
            Description Toast
          </Button>
          <Button
            onClick={() =>
              toastManager.add({
                title: 'Item deleted',
                description: '1 item was moved to trash.',
                actionProps: {
                  children: 'Undo',
                  onClick: () => console.log('Undo clicked')
                }
              })
            }
          >
            Action Toast
          </Button>
          <Button
            variant='outline'
            onClick={() =>
              toastManager.promise(
                new Promise(resolve => setTimeout(resolve, 2000)),
                {
                  loading: 'Loading...',
                  success: 'Done!',
                  error: 'Failed!'
                }
              )
            }
          >
            Promise Toast
          </Button>
        </Flex>
      </Toast.Provider>
    </PlaygroundLayout>
  );
}
