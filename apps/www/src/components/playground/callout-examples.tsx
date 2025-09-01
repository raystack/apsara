"use client";

import { Button, Callout, Flex } from "@raystack/apsara";
import PlaygroundLayout from "./playground-layout";

export function CalloutExamples() {
  return (
    <PlaygroundLayout title="Callout">
      <Flex gap="medium" wrap="wrap">
        <Callout type="grey">Default Callout</Callout>
        <Callout type="success">Success Callout</Callout>
        <Callout type="alert">Alert Callout</Callout>
        <Callout type="gradient">Gradient Callout</Callout>
        <Callout type="accent">Accent Callout</Callout>
        <Callout type="attention">Attention Callout</Callout>
        <Callout type="normal">Normal Callout</Callout>
        <Callout type="success" outline>
          With Outline Callout
        </Callout>
        <Callout dismissible onDismiss={() => alert("Dismissed!")}>
          Dismissible Callout
        </Callout>
        <Callout type="success" action={<Button>Action</Button>}>
          A short message to attract user's attention
        </Callout>
      </Flex>
    </PlaygroundLayout>
  );
}
