"use client";

import { getPropsString } from "@/lib/utils";

export const getCode = (props: any) => {
  const { children, ...rest } = props;
  return `<Indicator${getPropsString(rest)}>${children}</Indicator>`;
};

export const playground = {
  type: "playground",
  controls: {
    variant: {
      type: "select",
      options: ["accent", "warning", "danger", "success", "neutral"],
      defaultValue: "accent",
    },
    label: { type: "text", initialValue: "" },
    children: {
      type: "text",
      initialValue: "<Button color='neutral'>Notification</Button>",
    },
  },
  getCode,
};

export const variantDemo = {
  type: "code",
  code: `
  <Flex gap="large" align="center">
    <Indicator variant="accent">
      <Button color='neutral'>Notification</Button>
    </Indicator>
    <Indicator variant="warning">
      <Button color='neutral'>Notification</Button>
    </Indicator>
    <Indicator variant="danger">
      <Button color='neutral'>Notification</Button>
    </Indicator>
    <Indicator variant="success">
      <Button color='neutral'>Notification</Button>
    </Indicator>
    <Indicator variant="neutral">
      <Button color='neutral'>Notification</Button>
    </Indicator>
  </Flex>`,
};
export const labelDemo = {
  type: "code",
  code: `
  <Flex gap="large">
    <Indicator variant="accent" label="2 new">
      <Button color='neutral'>Notification</Button>
    </Indicator>
    <Indicator variant="accent">
      <Button color='neutral'>Notification</Button>
    </Indicator>
  </Flex>`,
};
