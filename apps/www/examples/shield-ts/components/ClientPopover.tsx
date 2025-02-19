"use client"

import { Popover, Button, Flex, Text } from "@raystack/apsara/v1";

export const ClientPopover = () => {
  return (
    <Popover>
      <Popover.Trigger asChild>
        <Button>Open Popover</Button>
      </Popover.Trigger>
      <Popover.Content>
        <Flex direction="column" gap="medium" style={{ padding: "var(--rs-space-2)" }}>
          <Text>This is a popover content</Text>
          <Popover.Close asChild>
            <Button size="small">Close</Button>
          </Popover.Close>
        </Flex>
      </Popover.Content>
    </Popover>
  );
}; 