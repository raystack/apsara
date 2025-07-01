"use client";

import { Tooltip, Button, Flex } from "@raystack/apsara";
import PlaygroundLayout from "./playground-layout";

export function TooltipExamples() {
  return (
    <PlaygroundLayout title="Tooltip">
      <Flex gap="medium" align="center" wrap="wrap">
        <Tooltip message="Top tooltip" side="top">
          <Button>Top</Button>
        </Tooltip>
        <Tooltip message="Right tooltip" side="right">
          <Button>Right</Button>
        </Tooltip>
        <Tooltip message="Bottom tooltip" side="bottom">
          <Button>Bottom</Button>
        </Tooltip>
        <Tooltip message="Left tooltip" side="left">
          <Button>Left</Button>
        </Tooltip>
        <Tooltip message="Top Left tooltip" side="top-left">
          <Button>Top Left</Button>
        </Tooltip>
        <Tooltip message="Top Right tooltip" side="top-right">
          <Button>Top Right</Button>
        </Tooltip>
        <Tooltip message="Bottom Left tooltip" side="bottom-left">
          <Button>Bottom Left</Button>
        </Tooltip>
        <Tooltip message="Bottom Right tooltip" side="bottom-right">
          <Button>Bottom Right</Button>
        </Tooltip>
      </Flex>{" "}
    </PlaygroundLayout>
  );
}
