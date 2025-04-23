"use client";

import { Chip, Flex } from "@raystack/apsara/v1";
import PlaygroundLayout from "./playground-layout";

export function ChipExamples() {
  return (
    <PlaygroundLayout title="Chip">
      <Flex gap="large">
        <Chip size="small">Small</Chip>
        <Chip size="large">Large</Chip>
      </Flex>
      <Flex gap="large">
        <Chip color="neutral" variant="outline">
          Outline
        </Chip>
        <Chip color="neutral" variant="filled">
          Filled
        </Chip>
        <Chip color="accent" variant="outline">
          Outline
        </Chip>
        <Chip color="accent" variant="filled">
          Filled
        </Chip>
      </Flex>
      <Flex gap="large">
        <Chip leadingIcon={"O"}>Add Item</Chip>
        <Chip trailingIcon={"O"}>Next</Chip>
        <Chip leadingIcon={"O"} trailingIcon={"O"}>
          Download
        </Chip>
      </Flex>
      <Flex gap="large">
        <Chip
          isDismissible
          onDismiss={() => alert("dismissed")}
          ariaLabel="Dismissible chip">
          Dismissable Chip
        </Chip>
        <Chip
          variant="outline"
          color="accent"
          isDismissible
          onDismiss={() => alert("dismissed")}
          ariaLabel="Dismissible chip">
          Dismissable Chip
        </Chip>
        <Chip
          variant="filled"
          color="accent"
          isDismissible
          onDismiss={() => alert("dismissed")}
          ariaLabel="Dismissible chip">
          Dismissable Chip
        </Chip>
      </Flex>
    </PlaygroundLayout>
  );
}
