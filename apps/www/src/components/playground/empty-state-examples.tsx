"use client";

import { Button, EmptyState } from "@raystack/apsara/v1";
import PlaygroundLayout from "./playground-layout";
import { X } from "lucide-react";

export function EmptyStateExamples() {
  return (
    <PlaygroundLayout title="EmptyState">
      <EmptyState
        heading="No Data Available"
        subHeading="Try adjusting your filters."
        icon={<X size={16} />}
        primaryAction={<Button>Primary Action</Button>}
        secondaryAction={<Button variant="text">Secondary Action</Button>}
      />
    </PlaygroundLayout>
  );
}
