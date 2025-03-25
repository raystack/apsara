"use client";

import { getPropsString } from "@/lib/utils";

export const getCode = (props: any) => {
  return `<EmptyState
  ${getPropsString(props)}
      primaryAction={<Button>Primary Action</Button>}
      secondaryAction={<Button variant="text">Secondary Action</Button>}
    />`;
};

export const playground = {
  type: "playground",
  controls: {
    variant: {
      type: "select",
      initialValue: "empty1",
      options: ["empty1", "empty2"]
    },
    heading: {
      type: "text",
      initialValue: "No Data Available"
    },
    subHeading: {
      type: "text",
      initialValue: "Try adjusting your filters."
    },
    icon: {
      type: "icon",
      initialValue: "<X size={16} />"
    }
  },
  getCode,
};

export const variantsDemo = {
  type: "code",
  code: `
  <Flex gap="large">
    <EmptyState
      variant="empty1"
      icon={<BellIcon />}
      heading="No notifications yet"
      subHeading="When you have notifications, they will appear here"
      primaryAction={
        <Button>Enable notifications</Button>
      }
      secondaryAction={
        <Button variant="ghost">Learn more</Button>
      }
    />
    <EmptyState
      variant="empty2"
      icon={<BellIcon />}
      heading="Organization"
      subHeading="An organization in Aurora is a shared workspace where teams manage projects, AOIs, and image orders. It streamlines collaboration, analysis, and decision-making across industries."
      primaryAction={
        <Button>Enable notifications</Button>
      }
      secondaryAction={
        <Button variant="ghost">Learn more</Button>
      }
    />
  </Flex>`,
}