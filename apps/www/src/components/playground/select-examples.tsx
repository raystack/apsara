"use client";

import { Select, Flex } from "@raystack/apsara";
import PlaygroundLayout from "./playground-layout";

export function SelectExamples() {
  return (
    <PlaygroundLayout title="Select">
      <Flex align="center" gap="large" wrap="wrap">
        <Select>
          <Select.Trigger size="small">
            <Select.Value placeholder="Small select" />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="1">Option 1</Select.Item>
            <Select.Item value="2">Option 2</Select.Item>
          </Select.Content>
        </Select>
        <Select>
          <Select.Trigger>
            <Select.Value placeholder="Large select" />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="1">Option 1</Select.Item>
            <Select.Item value="2">Option 2</Select.Item>
          </Select.Content>
        </Select>
        <Select>
          <Select.Trigger variant="filter">
            <Select.Value placeholder="Filter..." />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="all">All</Select.Item>
            <Select.Item value="active">Active</Select.Item>
            <Select.Item value="inactive">Inactive</Select.Item>
          </Select.Content>
        </Select>
      </Flex>
    </PlaygroundLayout>
  );
}
