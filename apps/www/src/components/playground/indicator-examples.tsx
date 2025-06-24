"use client";

import { Indicator, Flex, Button } from "@raystack/apsara";
import PlaygroundLayout from "./playground-layout";

export function IndicatorExamples() {
  return (
    <PlaygroundLayout title="Indicator">
      <Flex gap="large" direction="column" wrap="wrap">
        <Flex gap="large" align="center" wrap="wrap">
          <Indicator variant="accent">
            <Button color="neutral">Notification</Button>
          </Indicator>
          <Indicator variant="warning">
            <Button color="neutral">Notification</Button>
          </Indicator>
          <Indicator variant="danger">
            <Button color="neutral">Notification</Button>
          </Indicator>
          <Indicator variant="success">
            <Button color="neutral">Notification</Button>
          </Indicator>
          <Indicator variant="neutral">
            <Button color="neutral">Notification</Button>
          </Indicator>
        </Flex>
        <Flex gap="large" wrap="wrap">
          <Indicator variant="accent" label="2 new">
            <Button color="neutral">Notification</Button>
          </Indicator>
          <Indicator variant="accent">
            <Button color="neutral">Notification</Button>
          </Indicator>
        </Flex>
      </Flex>
    </PlaygroundLayout>
  );
}
