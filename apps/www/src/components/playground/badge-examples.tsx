"use client";

import { Badge, Flex } from "@raystack/apsara/v1";
import PlaygroundLayout from "./playground-layout";
import { Home, Laugh } from "lucide-react";

export function BadgeExamples() {
  return (
    <PlaygroundLayout title="Badge">
      <Flex gap="medium">
        <Badge variant="accent">Accent</Badge>
        <Badge variant="warning">Warning</Badge>
        <Badge variant="danger">Danger</Badge>
        <Badge variant="success">Success</Badge>
        <Badge variant="neutral">Neutral</Badge>
        <Badge variant="gradient">Gradient</Badge>
      </Flex>
      <Flex gap="medium" align="center">
        <Badge size="micro">Micro</Badge>
        <Badge size="small">Small</Badge>
        <Badge size="regular">Regular</Badge>
      </Flex>
      <Flex gap="medium">
        <Badge icon={<Home size="16" />}>Badge</Badge>
        <Badge icon={<Laugh size="16" />}>Badge</Badge>
        <Badge icon="🔥">Badge</Badge>
      </Flex>
    </PlaygroundLayout>
  );
}
