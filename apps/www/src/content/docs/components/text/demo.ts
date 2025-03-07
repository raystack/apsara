"use client";

import { getPropsString } from "@/lib/utils";

export const getCode = (props: any) => {
  return `<Text${getPropsString(props)}/>`;
};

export const playground = {
  type: "playground",
  controls: {
    variant: {
      type: "select",
      options: [
        "primary",
        "secondary",
        "tertiary",
        "emphasis",
        "accent",
        "attention",
        "danger",
        "success",
      ],
      defaultValue: "primary",
    },
    size: {
      type: "number",
      min: 1,
      max: 10,
      defaultValue: 2,
    },
    weight: {
      type: "select",
      options: [
        "bold",
        "bolder",
        "normal",
        "lighter",
        100,
        200,
        300,
        400,
        500,
        600,
        700,
        800,
        900,
      ],
      defaultValue: 400,
    },
    children: {
      type: "text",
      initialValue: "This is a text",
    },
  },
  getCode,
};

export const variantDemo = {
  type: "code",
  code: `
  <Flex gap="medium" align="center">
    <Text variant="primary">primary</Text>
    <Text variant="secondary">secondary</Text>
    <Text variant="tertiary">tertiary</Text>
    <div
      style={{
        backgroundColor: "var(--rs-color-background-neutral-tertiary)",
        padding: "var(--rs-space-3)",
      }}
    >
      <Text variant="emphasis">emphasis</Text>
    </div>
    <Text variant="accent">accent</Text>
    <Text variant="attention">attention</Text>
    <Text variant="danger">danger</Text>
    <Text variant="success">success</Text>
  </Flex>`,
};
export const sizeDemo = {
  type: "code",
  code: `
  <Flex gap="large" align="center">
     <Text size="1">This is a text</Text> 
    <Text size="2">This is a text</Text> 
    <Text size="3">This is a text</Text> 
    <Text size="4">This is a text</Text> 
    <Text size="5">This is a text</Text> 
  </Flex>`,
};
export const weightDemo = {
  type: "code",
  code: `
  <Flex gap="small" align="center" direction="column">
    <Text weight="100">This is a text</Text> 
    <Text weight="200">This is a text</Text> 
    <Text weight="300">This is a text</Text> 
    <Text weight="400">This is a text</Text> 
    <Text weight="500">This is a text</Text> 
    <Text weight="600">This is a text</Text> 
    <Text weight="700">This is a text</Text> 
    <Text weight="800">This is a text</Text> 
    <Text weight="900">This is a text</Text>
  </Flex>`,
};
