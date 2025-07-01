"use client";

import { Headline, Flex } from "@raystack/apsara";
import PlaygroundLayout from "./playground-layout";

export function HeadlineExamples() {
  return (
    <PlaygroundLayout title="Headline">
      <Flex direction="column" gap="large">
        <Flex direction="column" gap="large">
          <Headline size="large" as="h1">
            Large Headline
          </Headline>

          <Headline size="medium">Medium Headline</Headline>

          <Headline size="small" as="h3">
            Small Headline
          </Headline>
        </Flex>
        <Flex direction="column" style={{ width: "500px" }} gap="large">
          <Headline size="small" align="left">
            Left Aligned
          </Headline>
          <Headline size="small" align="center">
            Center Aligned
          </Headline>
          <Headline size="small" align="right">
            Right Aligned
          </Headline>
        </Flex>
        <Flex style={{ width: "200px" }}>
          <Headline size="small" truncate>
            This is a truncated headline that is very long
          </Headline>
        </Flex>
      </Flex>
    </PlaygroundLayout>
  );
}
