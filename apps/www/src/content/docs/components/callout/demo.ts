"use client";

import { getPropsString } from "@/lib/utils";

export const getCode = (props: any) => {
  const { children, ...rest } = props;
  return `<Callout${getPropsString(
    rest,
  )} onDismiss={() => alert("Dismissed")}>${children}</Callout>`;
};

export const playground = {
  type: "playground",
  controls: {
    type: {
      type: "select",
      options: [
        "grey",
        "success",
        "alert",
        "gradient",
        "accent",
        "attention",
        "normal",
      ],
      defaultValue: "grey",
      initialValue: "gradient",
    },
    children: {
      type: "text",
      initialValue: "A short message",
    },
    icon: {
      type: "icon",
    },
    outline: {
      type: "checkbox",
      defaultValue: false,
    },
    highContrast: {
      type: "checkbox",
      defaultValue: false,
    },
    dismissible: {
      type: "checkbox",
      defaultValue: false,
    },
    width: {
      type: "text",
    },
  },
  getCode,
};
export const typeDemo = {
  type: "code",
  code: `
  <Flex gap="medium" direction="column">
    <Callout type="grey">Default Callout</Callout>
    <Callout type="success">Success Callout</Callout>
    <Callout type="alert">Alert Callout</Callout>
    <Callout type="gradient">Gradient Callout</Callout>
    <Callout type="accent">Accent Callout</Callout>
    <Callout type="attention">Attention Callout</Callout>
    <Callout type="normal">Normal Callout</Callout>
  </Flex>`,
};

export const outlineDemo = {
  type: "code",
  code: `
  <Flex gap="medium" direction="column">
    <Callout type="success">Without Outline Callout</Callout>
    <Callout type="success" outline>With Outline Callout</Callout>
  </Flex>`,
};

export const highContrastDemo = {
  type: "code",
  code: `
  <Flex gap="medium" direction="column">
    <Callout type="alert">Normal Callout</Callout>
    <Callout type="alert" highContrast>High Contrast Callout</Callout>
  </Flex>`,
};

export const dismissibleDemo = {
  type: "code",
  code: `
  <Callout dismissible onDismiss={() => alert("Dismissed!")}>
    Dismissible Callout
  </Callout>`,
};

export const actionDemo = {
  type: "code",
  code: `
  <Callout type="success" action={<Button>Action</Button>}>
    A short message to attract user's attention
  </Callout>`,
};

export const widthDemo = {
  type: "code",
  code: `<Callout type="success" width={500}>A short message to attract user's attention</Callout>`,
};
