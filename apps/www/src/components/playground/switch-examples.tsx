"use client";

import { Switch, Flex } from "@raystack/apsara/v1";
import PlaygroundLayout from "./playground-layout";

export function SwitchExamples() {
  return (
    <PlaygroundLayout title="Switch">
      <Flex gap="large" align="center" wrap="wrap">
        <Switch />
        <Switch defaultChecked />
        <Switch disabled />
        <Switch disabled defaultChecked />
        <Switch required />
      </Flex>
    </PlaygroundLayout>
  );
}
