"use client";

import { Popover, Button, Flex, Text } from "@raystack/apsara/v1";
import PlaygroundLayout from "./playground-layout";

export function PopoverExamples() {
  return (
    <PlaygroundLayout title="Popover">
      <Flex gap="medium" wrap="wrap">
        <Popover>
          <Popover.Trigger asChild>
            <Button>Top Popover</Button>
          </Popover.Trigger>
          <Popover.Content side="top">
            <Text size="2">Content appears above the trigger</Text>
          </Popover.Content>
        </Popover>
        <Popover>
          <Popover.Trigger asChild>
            <Button>Right Popover</Button>
          </Popover.Trigger>
          <Popover.Content side="right">
            <Text size="2">Content appears to the right</Text>
          </Popover.Content>
        </Popover>
        <Popover>
          <Popover.Trigger asChild>
            <Button>Bottom Popover</Button>
          </Popover.Trigger>
          <Popover.Content side="bottom">
            <Text size="2">Content appears below the trigger</Text>
          </Popover.Content>
        </Popover>
        <Popover>
          <Popover.Trigger asChild>
            <Button>Left Popover</Button>
          </Popover.Trigger>
          <Popover.Content side="left">
            <Text size="2">Content appears to the left</Text>
          </Popover.Content>
        </Popover>
        <Popover>
          <Popover.Trigger asChild>
            <Button>Center Aligned</Button>
          </Popover.Trigger>
          <Popover.Content align="center">
            <Text size="2">Centered with the trigger</Text>
          </Popover.Content>
        </Popover>
        <Popover>
          <Popover.Trigger asChild>
            <Button>Start Aligned</Button>
          </Popover.Trigger>
          <Popover.Content align="start">
            <Text size="2">Aligned to the start</Text>
          </Popover.Content>
        </Popover>
        <Popover>
          <Popover.Trigger asChild>
            <Button>End Aligned</Button>
          </Popover.Trigger>
          <Popover.Content align="end">
            <Text size="2">Aligned to the end</Text>
          </Popover.Content>
        </Popover>
      </Flex>
    </PlaygroundLayout>
  );
}
