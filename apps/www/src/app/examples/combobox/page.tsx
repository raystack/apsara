'use client';

import {
  Button,
  Combobox,
  Dialog,
  Flex,
  Toast,
  toastManager,
  useToastManager
} from '@raystack/apsara';

const FRUITS = ['Apple', 'Banana', 'Blueberry', 'Grapes', 'Pineapple'];

function ToastButton({
  label,
  source,
  type
}: {
  label: string;
  source: string;
  type?: 'success' | 'info' | 'warning';
}) {
  // Demonstrates the hook flavor — works because every button is a
  // descendant of <Toast.Provider> in the tree below.
  const { add } = useToastManager();
  return (
    <Button
      onClick={() =>
        add({
          title: `Toast from ${source}`,
          description: 'Toasts portal to the top-level provider.',
          type
        })
      }
    >
      {label}
    </Button>
  );
}

const Page = () => {
  return (
    <Toast.Provider position='bottom-right'>
      <Flex
        direction='column'
        gap={5}
        style={{
          minHeight: '100vh',
          padding: '80px',
          background: 'var(--rs-color-background-base-primary)'
        }}
      >
        <h1>Combobox + nested dialogs + toast</h1>
        <p>
          Toasts triggered from any depth of nested dialog still render at the
          root viewport. Each level has its own combobox and toast button.
        </p>

        <Combobox>
          <Combobox.Input placeholder='Pick a fruit' width={240} />
          <Combobox.Content>
            {FRUITS.map(f => (
              <Combobox.Item key={f} value={f.toLowerCase()}>
                {f}
              </Combobox.Item>
            ))}
          </Combobox.Content>
        </Combobox>

        <Flex gap={3}>
          {/* Singleton flavor — usable from anywhere, including non-React code. */}
          <Button
            onClick={() =>
              toastManager.add({
                title: 'Toast from root',
                description: 'Triggered via the singleton toastManager.',
                type: 'success'
              })
            }
          >
            Show toast (root)
          </Button>

          <Dialog>
            <Dialog.Trigger render={<Button variant='outline' />}>
              Open dialog 1
            </Dialog.Trigger>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Dialog 1</Dialog.Title>
                <Dialog.Description>
                  Triggers a toast and opens a nested dialog.
                </Dialog.Description>
              </Dialog.Header>
              <Dialog.Body>
                <Flex direction='column' gap={3}>
                  <Combobox>
                    <Combobox.Input
                      placeholder='Pick a fruit (dialog 1)'
                      width={300}
                    />
                    <Combobox.Content>
                      {FRUITS.map(f => (
                        <Combobox.Item key={f} value={f.toLowerCase()}>
                          {f}
                        </Combobox.Item>
                      ))}
                    </Combobox.Content>
                  </Combobox>
                  <Flex gap={3}>
                    <ToastButton
                      label='Show toast (dialog 1)'
                      source='dialog 1'
                      type='info'
                    />

                    <Dialog>
                      <Dialog.Trigger render={<Button variant='outline' />}>
                        Open dialog 2
                      </Dialog.Trigger>
                      <Dialog.Content>
                        <Dialog.Header>
                          <Dialog.Title>Dialog 2 (nested)</Dialog.Title>
                          <Dialog.Description>
                            A toast fired from here still appears at the root
                            viewport — even though this dialog is portaled.
                          </Dialog.Description>
                        </Dialog.Header>
                        <Dialog.Body>
                          <Flex gap={3}>
                            <ToastButton
                              label='Show toast (dialog 2)'
                              source='dialog 2'
                              type='warning'
                            />
                          </Flex>
                        </Dialog.Body>
                        <Dialog.Footer>
                          <Dialog.Close render={<Button variant='outline' />}>
                            Close
                          </Dialog.Close>
                        </Dialog.Footer>
                      </Dialog.Content>
                    </Dialog>
                  </Flex>
                </Flex>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.Close render={<Button variant='outline' />}>
                  Close
                </Dialog.Close>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog>
        </Flex>
      </Flex>
    </Toast.Provider>
  );
};

export default Page;
