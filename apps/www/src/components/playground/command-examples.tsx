"use client";

import { Command, Flex } from "@raystack/apsara/v1";
import PlaygroundLayout from "./playground-layout";

export function CommandExamples() {
  return (
    <PlaygroundLayout title="Command">
      <Flex style={{ width: 400 }}>
        <Command>
          <Command.Input placeholder="Type a command or search..." />
          <Command.List>
            <Command.Empty>No results found.</Command.Empty>
            <Command.Group heading="Suggestions">
              <Command.Item>Calendar</Command.Item>
              <Command.Item>Search Emoji</Command.Item>
              <Command.Item>Calculator</Command.Item>
            </Command.Group>
            <Command.Separator />
            <Command.Group heading="Settings">
              <Command.Item>Profile</Command.Item>
              <Command.Item>Billing</Command.Item>
              <Command.Item>Settings</Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </Flex>
    </PlaygroundLayout>
  );
}
