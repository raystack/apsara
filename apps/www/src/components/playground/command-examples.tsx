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
            <Command.Input placeholder='Type a command or search...' />
            <Command.Content>
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
                <Command.Item>Profile</Command.Item>
                <Command.Item>Billing</Command.Item>
                <Command.Item>Settings</Command.Item>
              </Command.Group>
            </Command.Content>
          </Command>
        </Flex>

        <Text>Dialog — press ⌘K or click the button</Text>
        <Command.Dialog open={open} onOpenChange={setOpen}>
          <Command.DialogTrigger render={<Button variant='outline' />}>
            Open Command Menu
          </Command.DialogTrigger>
          <Command.DialogContent>
            <Command>
              <Command.Input placeholder='Type a command or search...' />
              <Command.Content>
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
              </Command.Content>
            </Command>
          </Command.DialogContent>
        </Command.Dialog>
      </Flex>
    </PlaygroundLayout>
  );
}
