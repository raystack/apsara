"use client";

import { Flex, Button } from "@raystack/apsara/v1";
import PlaygroundLayout from "./playground-layout";

export function FlexExamples() {
  return (
    <PlaygroundLayout title="Flex">
      <Flex gap="large" direction="column">
        <Flex gap="extra-small" align="center">
          <Button>Button 1</Button>
          <Button>Button 2</Button>
          <Button>Button 3</Button>
        </Flex>
        <Flex gap="small" align="center">
          <Button>Button 1</Button>
          <Button>Button 2</Button>
          <Button>Button 3</Button>
        </Flex>
        <Flex gap="medium" align="center">
          <Button>Button 1</Button>
          <Button>Button 2</Button>
          <Button>Button 3</Button>
        </Flex>
        <Flex gap="large" align="center">
          <Button>Button 1</Button>
          <Button>Button 2</Button>
          <Button>Button 3</Button>
        </Flex>
        <Flex gap="extra-large" align="center">
          <Button>Button 1</Button>
          <Button>Button 2</Button>
          <Button>Button 3</Button>
        </Flex>
      </Flex>
    </PlaygroundLayout>
  );
}
