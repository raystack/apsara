"use client";

import { getPropsString } from "@/lib/utils";

export const getCode = (props: any) => {
  return `<Badge${getPropsString(props)}/>`;
};

export const playground = {
  type: "playground",
  controls: {
    variant: {
      type: "select",
      options: [
        "accent",
        "warning",
        "danger",
        "success",
        "neutral",
        "gradient",
      ],
      defaultValue: "accent",
    },
    size: {
      type: "select",
      options: ["micro", "small", "regular"],
      defaultValue: "small",
    },
    icon: {
      type: "icon",
    },
    screenReaderText: {
      type: "text",
      initialValue: "Notification badge",
    },
    children: {
      type: "text",
      initialValue: "New Badge",
    },
  },
  getCode,
};

export const variantDemo = {
  type: "code",
  code: `
  <Flex gap="medium">
    <Badge variant="accent">Accent</Badge>
    <Badge variant="warning">Warning</Badge>
    <Badge variant="danger">Danger</Badge>
    <Badge variant="success">Success</Badge>
    <Badge variant="neutral">Neutral</Badge>
    <Badge variant="gradient">Gradient</Badge>
  </Flex>`,
};

export const sizesDemo = {
  type: "code",
  code: `
  <Flex gap="medium">
    <Badge size="micro">Micro</Badge>
    <Badge size="small">Small</Badge>
    <Badge size="regular">Regular</Badge>
  </Flex>`,
};

export const iconDemo = {
  type: "code",
  code: `
  <Flex gap="medium">
    <Badge icon={<Home size="16"/>}>Badge</Badge>
    <Badge icon={<Laugh size="16"/>}>Badge</Badge>
    <Badge icon="🔥">Badge</Badge>
  </Flex>`,
};

export const screenReaderTextDemo = {
  type: "code",
  code: `
  <Badge screenReaderText="New updates available">
    Updates
  </Badge>`,
};
