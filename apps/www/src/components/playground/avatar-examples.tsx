"use client";
import { Avatar, Flex } from "@raystack/apsara";
import PlaygroundLayout from "./playground-layout";

export function AvatarExamples() {
  return (
    <PlaygroundLayout title="Avatar">
      <Flex gap="medium" align="end">
        <Avatar
          size={6}
          radius="full"
          fallback="RC"
          src="https://images.unsplash.com/photo-1511485977113-f34c92461ad9?ixlib=rb-1.2.1&w=128&h=128&dpr=2&q=80"
        />
        <Avatar
          size={8}
          radius="small"
          fallback="RC"
          src="https://images.unsplash.com/photo-1511485977113-f34c92461ad9?ixlib=rb-1.2.1&w=128&h=128&dpr=2&q=80"
        />
      </Flex>
      <Flex gap="medium">
        <Avatar size={6} color="indigo" fallback="RC" />
        <Avatar size={6} color="orange" fallback="RC" />
        <Avatar size={6} color="mint" fallback="RC" />
        <Avatar size={6} color="neutral" fallback="RC" />
      </Flex>
      <Flex gap="medium">
        <Avatar size={6} color="sky" fallback="RC" />
        <Avatar size={6} color="lime" fallback="RC" />
        <Avatar size={6} color="grass" fallback="RC" />
        <Avatar size={6} color="cyan" fallback="RC" />
        <Avatar size={6} color="iris" fallback="RC" />
        <Avatar size={6} color="purple" fallback="RC" />
        <Avatar size={6} color="pink" fallback="RC" />
        <Avatar size={6} color="crimson" fallback="RC" />
        <Avatar size={6} color="gold" fallback="RC" />
      </Flex>
      <Flex gap="large" direction="column">
        <Flex gap="small" align="end">
          <Avatar size={1} fallback="RC" />
          <Avatar size={2} fallback="RC" />
          <Avatar size={3} fallback="RC" />
          <Avatar size={4} fallback="RC" />
          <Avatar size={5} fallback="RC" />
          <Avatar size={6} fallback="RC" />
          <Avatar size={7} fallback="RC" />
          <Avatar size={8} fallback="RC" />
          <Avatar size={9} fallback="RC" />
        </Flex>
        <Flex gap="small">
          <Avatar size={10} fallback="RC" />
          <Avatar size={11} fallback="RC" />
          <Avatar size={12} fallback="RC" />
          <Avatar size={13} fallback="RC" />
        </Flex>
      </Flex>
    </PlaygroundLayout>
  );
}
