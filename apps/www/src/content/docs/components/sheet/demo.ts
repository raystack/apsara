"use client";

import { getPropsString } from "@/lib/utils";

export const getCode = (props: any) => {
  return `
    <Sheet>
      <Sheet.Trigger asChild>
        <Button>Sheet</Button>
      </Sheet.Trigger>
      <Sheet.Content${getPropsString(props)}>
        <Sheet.Title>Sheet</Sheet.Title>
        <Sheet.Description>A simple sheet</Sheet.Description>
      </Sheet.Content>
    </Sheet>`;
};

export const playground = {
  type: "playground",
  controls: {
    side: {
      type: "select",
      options: ["top", "right", "bottom", "left"],
      defaultValue: "right",
    },
    close: {
      type: "checkbox",
      defaultValue: false,
    },
  },
  getCode,
};

export const basicDemo = {
  type: "code",
  code: `
  <Sheet>
  <Sheet.Trigger asChild>
    <Button>Open Sheet</Button>
  </Sheet.Trigger>
  <Sheet.Content close>
    <Sheet.Title>Sheet Title</Sheet.Title>
    <Sheet.Description>Sheet description goes here</Sheet.Description>
    <span>Main content of the sheet</span>
  </Sheet.Content>
</Sheet>`,
};

export const positionDemo = {
  type: "code",
  code: `
  <Flex gap="medium">
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
  </Flex>`,
};
