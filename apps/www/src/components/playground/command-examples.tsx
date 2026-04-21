'use client';

import { Button, Command, Flex, Text } from '@raystack/apsara';
import { useEffect, useState } from 'react';
import PlaygroundLayout from './playground-layout';

export function CommandExamples() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        setOpen(prev => !prev);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  return (
    <PlaygroundLayout title='Command'>
      <Flex direction='column' gap='large'>
        <Text>Inline command menu</Text>
        <Flex style={{ width: 420 }}>
          <Command>
            <Command.Panel>
              <Command.Input placeholder='Type a command or search...' />
              <Command.List>
                <Command.Empty>No results found.</Command.Empty>
                <Command.Group>
                  <Command.Label>Suggestions</Command.Label>
                  <Command.Item>Calendar</Command.Item>
                  <Command.Item>Search Emoji</Command.Item>
                  <Command.Item>Calculator</Command.Item>
                </Command.Group>
                <Command.Separator />
                <Command.Group>
                  <Command.Label>Settings</Command.Label>
                  <Command.Item>
                    Profile <Command.Shortcut>⌘P</Command.Shortcut>
                  </Command.Item>
                  <Command.Item>
                    Billing <Command.Shortcut>⌘B</Command.Shortcut>
                  </Command.Item>
                  <Command.Item>
                    Settings <Command.Shortcut>⌘S</Command.Shortcut>
                  </Command.Item>
                </Command.Group>
              </Command.List>
              <Command.Footer>
                <span>
                  Press <Command.Shortcut>↵</Command.Shortcut> to select
                </span>
                <span>
                  <Command.Shortcut>ESC</Command.Shortcut> to close
                </span>
              </Command.Footer>
            </Command.Panel>
          </Command>
        </Flex>

        <Text>
          Dialog — press <Command.Shortcut>⌘K</Command.Shortcut> or click the
          button
        </Text>
        <Command.Dialog open={open} onOpenChange={setOpen}>
          <Command.Dialog.Trigger render={<Button variant='outline' />}>
            Open Command Menu
          </Command.Dialog.Trigger>
          <Command.Dialog.Content>
            <Command>
              <Command.Input placeholder='Type a command or search...' />
              <Command.List>
                <Command.Empty>No results found.</Command.Empty>
                <Command.Group>
                  <Command.Label>Suggestions</Command.Label>
                  <Command.Item onClick={() => setOpen(false)}>
                    Calendar
                  </Command.Item>
                  <Command.Item onClick={() => setOpen(false)}>
                    Search Emoji
                  </Command.Item>
                  <Command.Item onClick={() => setOpen(false)}>
                    Calculator
                  </Command.Item>
                </Command.Group>
              </Command.List>
            </Command>
          </Command.Dialog.Content>
        </Command.Dialog>
      </Flex>
    </PlaygroundLayout>
  );
}
