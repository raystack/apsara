"use client";

import { Spinner, Flex } from "@raystack/apsara/v1";
import PlaygroundLayout from "./playground-layout";

export function SpinnerExamples() {
  return (
    <PlaygroundLayout title="Spinner">
      <Flex gap="medium" align="center" wrap="wrap">
        <Spinner size={1} />
        <Spinner size={2} />
        <Spinner size={3} />
        <Spinner size={4} />
        <Spinner size={5} />
        <Spinner size={6} />
      </Flex>
    </PlaygroundLayout>
  );
}
