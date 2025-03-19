"use client";

import { Slider, Flex, Text } from "@raystack/apsara/v1";
import PlaygroundLayout from "./playground-layout";

export function SliderExamples() {
  return (
    <PlaygroundLayout title="Slider">
      <Flex gap="extra-large" style={{ width: 400 }} direction="column">
        <Slider variant="single" label="Value" defaultValue={50} />
        <Slider
          variant="range"
          label={["Min", "Max"]}
          defaultValue={[20, 80]}
        />
      </Flex>
    </PlaygroundLayout>
  );
}
