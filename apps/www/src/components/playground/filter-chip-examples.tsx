"use client";

import { FilterChip, Flex } from "@raystack/apsara/v1";
import PlaygroundLayout from "./playground-layout";
import { Info } from "lucide-react";

export function FilterChipExamples() {
  return (
    <PlaygroundLayout title="FilterChip">
      <Flex gap="large" wrap="wrap">
        <FilterChip
          label="Status"
          leadingIcon={<Info />}
          columnType="select"
          options={[
            { label: "Active", value: "active" },
            { label: "Inactive", value: "inactive" },
          ]}
        />
        <FilterChip label="Date" leadingIcon={<Info />} columnType="date" />
        <FilterChip label="Search" leadingIcon={<Info />} columnType="text" />
      </Flex>
    </PlaygroundLayout>
  );
}
