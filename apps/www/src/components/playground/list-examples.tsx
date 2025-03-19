"use client";

import { List, Flex } from "@raystack/apsara/v1";
import PlaygroundLayout from "./playground-layout";

export function ListExamples() {
  return (
    <PlaygroundLayout title="List">
      <Flex align="center" justify="center">
        <List.Root>
          <List.Header>User Information</List.Header>
          <List.Item align="center">
            <List.Label minWidth="88px">Status</List.Label>
            <List.Value>Active</List.Value>
          </List.Item>
          <List.Item align="center">
            <List.Label minWidth="88px">Type</List.Label>
            <List.Value>Premium Account</List.Value>
          </List.Item>
          <List.Item align="center">
            <List.Label minWidth="88px">Created</List.Label>
            <List.Value>April 24, 2024</List.Value>
          </List.Item>
        </List.Root>
      </Flex>
    </PlaygroundLayout>
  );
}
