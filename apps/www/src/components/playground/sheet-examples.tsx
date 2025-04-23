"use client";

import { Sheet, Button, Flex } from "@raystack/apsara/v1";
import PlaygroundLayout from "./playground-layout";

export function SheetExamples() {
  return (
    <PlaygroundLayout title="Sheet">
      <Flex gap="medium" wrap="wrap">
        <Sheet>
          <Sheet.Trigger asChild>
            <Button>Top Sheet</Button>
          </Sheet.Trigger>
          <Sheet.Content side="top" close>
            <Sheet.Title>Top Sheet</Sheet.Title>
            <Sheet.Description>Slides in from the Top</Sheet.Description>
          </Sheet.Content>
        </Sheet>
        <Sheet>
          <Sheet.Trigger asChild>
            <Button>Right Sheet</Button>
          </Sheet.Trigger>
          <Sheet.Content side="right" close>
            <Sheet.Title>Right Sheet</Sheet.Title>
            <Sheet.Description>Slides in from the Right</Sheet.Description>
          </Sheet.Content>
        </Sheet>
        <Sheet>
          <Sheet.Trigger asChild>
            <Button>Left Sheet</Button>
          </Sheet.Trigger>
          <Sheet.Content side="left" close>
            <Sheet.Title>Left Sheet</Sheet.Title>
            <Sheet.Description>Slides in from the Left</Sheet.Description>
          </Sheet.Content>
        </Sheet>
        <Sheet>
          <Sheet.Trigger asChild>
            <Button>Bottom Sheet</Button>
          </Sheet.Trigger>
          <Sheet.Content side="bottom" close>
            <Sheet.Title>Bottom Sheet</Sheet.Title>
            <Sheet.Description>Slides in from the Bottom</Sheet.Description>
          </Sheet.Content>
        </Sheet>
      </Flex>{" "}
    </PlaygroundLayout>
  );
}
