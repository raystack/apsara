"use client";
import { AnnouncementBar, Flex } from "@raystack/apsara/v1";
import PlaygroundLayout from "./playground-layout";

export function AnnouncementBarExamples() {
  return (
    <PlaygroundLayout title="Announcement Bar">
      <Flex gap="medium" direction="column">
        <AnnouncementBar
          variant="normal"
          text="We have introduced a new feature"
          actionLabel="Read More"
        />
        <AnnouncementBar
          variant="error"
          text="We have introduced a new feature"
          actionLabel="Read More"
        />
        <AnnouncementBar
          variant="gradient"
          text="We have introduced a new feature"
          actionLabel="Read More"
        />
      </Flex>
    </PlaygroundLayout>
  );
}
