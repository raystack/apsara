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
    as: {
      type: "select",
      options: ["span", "p", "div", "label"],
      defaultValue: "span",
    },
    size: {
      type: "select",
      options: ["micro", "mini", "small", "regular", "large"],
      defaultValue: "regular",
    },
    weight: {
      type: "select",
      options: ["regular", "medium"],
      defaultValue: "regular",
    },
    transform: {
      type: "select",
      options: [undefined, "capitalize", "uppercase", "lowercase"],
    },
    align: {
      type: "select",
      options: [undefined, "center", "start", "end", "justify"],
    },
    lineClamp: {
      type: "select",
      options: [undefined, 1, 2, 3, 4, 5],
    },
    underline: {
      type: "checkbox",
      defaultValue: false,
    },
    strikeThrough: {
      type: "checkbox",
      defaultValue: false,
    },
    italic: {
      type: "checkbox",
      defaultValue: false,
    },

    children: {
      type: "text",
      initialValue:
        "Nulla dolor velit adipisicing duis excepteur esse in duis nostrud occaecat mollit incididunt deserunt sunt. Ut ut sunt laborum ex occaecat eu tempor labore enim adipisicing minim ad. Est in quis eu dolore occaecat excepteur fugiat dolore nisi aliqua fugiat enim ut cillum. Labore enim duis nostrud eu. Est ut eiusmod consequat irure quis deserunt ex. Enim laboris dolor magna pariatur. Dolor et ad sint voluptate sunt elit mollit officia ad enim sit consectetur enim.",
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
     <Text size="micro">This is a text</Text> 
    <Text size="mini">This is a text</Text> 
    <Text size="small">This is a text</Text> 
    <Text size="regular">This is a text</Text> 
    <Text size="large">This is a text</Text> 
  </Flex>`,
};
export const weightDemo = {
  type: "code",
  code: `
  <Flex gap="large" align="center">
    <Text weight="regular">This is a text</Text> 
    <Text weight="medium">This is a text</Text>
  </Flex>`,
};
export const transformDemo = {
  type: "code",
  code: `
  <Flex gap="large" align="center">
    <Text transform="capitalize">This is a text</Text> 
    <Text transform="uppercase">This is a text</Text>
    <Text transform="lowercase">This is a text</Text>
  </Flex>`,
};
export const lineClampDemo = {
  type: "code",
  code: `
  <Flex gap="medium" align="center" direction="column">
    <Text lineClamp={1}>Nulla dolor velit adipisicing duis excepteur esse in duis nostrud occaecat mollit incididunt deserunt sunt. Ut ut sunt laborum ex occaecat eu tempor labore enim adipisicing minim ad. Est in quis eu dolore occaecat excepteur fugiat dolore nisi aliqua fugiat enim ut cillum. Labore enim duis nostrud eu. Est ut eiusmod consequat irure quis deserunt ex. Enim laboris dolor magna pariatur. Dolor et ad sint voluptate sunt elit mollit officia ad enim sit consectetur enim.</Text>
    <Text lineClamp={2}>Nulla dolor velit adipisicing duis excepteur esse in duis nostrud occaecat mollit incididunt deserunt sunt. Ut ut sunt laborum ex occaecat eu tempor labore enim adipisicing minim ad. Est in quis eu dolore occaecat excepteur fugiat dolore nisi aliqua fugiat enim ut cillum. Labore enim duis nostrud eu. Est ut eiusmod consequat irure quis deserunt ex. Enim laboris dolor magna pariatur. Dolor et ad sint voluptate sunt elit mollit officia ad enim sit consectetur enim.</Text>
  </Flex>`,
};
export const alignDemo = {
  type: "code",
  code: `
  <Flex gap="medium" align="center" direction="column" style={{width:"100%",maxWidth:400,alignItems:"stretch"}}>
    <Text align="start">This is a text</Text> 
    <Text align="center">This is a text</Text>
    <Text align="end">This is a text</Text>
    <Text align="justify">This is a text</Text>
  </Flex>`,
};
export const styleDemo = {
  type: "code",
  code: `
  <Flex gap="large" align="center">
    <Text italic>This is a text</Text> 
    <Text strikeThrough>This is a text</Text>
    <Text underline>This is a text</Text>
    <Text italic strikeThrough underline>This is a text</Text>
  </Flex>`,
};
