"use client";

import { Text, Flex } from "@raystack/apsara/v1";
import PlaygroundLayout from "./playground-layout";

export function TextExamples() {
  return (
    <PlaygroundLayout title="Text">
      <Flex gap="extra-large" wrap="wrap">
        <Flex gap="medium" align="center" direction="column">
          <Text variant="primary">primary</Text>
          <Text variant="secondary">secondary</Text>
          <Text variant="tertiary">tertiary</Text>
          <div
            style={{
              backgroundColor: "var(--rs-color-background-neutral-tertiary)",
              padding: "var(--rs-space-3)",
            }}>
            <Text variant="emphasis">emphasis</Text>
          </div>
          <Text variant="accent">accent</Text>
          <Text variant="attention">attention</Text>
          <Text variant="danger">danger</Text>
          <Text variant="success">success</Text>
        </Flex>
        <Flex gap="medium" align="center" direction="column">
          <Text size="1">This is a text</Text>
          <Text size="2">This is a text</Text>
          <Text size="3">This is a text</Text>
          <Text size="4">This is a text</Text>
          <Text size="5">This is a text</Text>
        </Flex>
        <Flex gap="medium" align="center" direction="column">
          <Text weight="100">This is a text</Text>
          <Text weight="200">This is a text</Text>
          <Text weight="300">This is a text</Text>
          <Text weight="400">This is a text</Text>
          <Text weight="500">This is a text</Text>
          <Text weight="600">This is a text</Text>
          <Text weight="700">This is a text</Text>
          <Text weight="800">This is a text</Text>
          <Text weight="900">This is a text</Text>
        </Flex>
      </Flex>
    </PlaygroundLayout>
  );
}
