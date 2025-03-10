"use client";

import { getPropsString } from "@/lib/utils";

export const getCode = (props: any) => {
  const { children, ...rest } = props;
  return `<Button${getPropsString(rest)}>${children}</Button>`;
};

export const playground = {
  type: "playground",
  controls: {
    variant: {
      type: "select",
      options: ["solid", "outline", "ghost", "text"],
      defaultValue: "solid",
    },
    color: {
      type: "select",
      options: ["accent", "danger", "neutral", "success"],
      defaultValue: "accent",
    },
    size: {
      type: "select",
      options: ["small", "normal"],
      defaultValue: "normal",
    },
    leadingIcon: { type: "icon" },
    trailingIcon: { type: "icon" },
    disabled: { type: "checkbox", defaultValue: false },
    loading: { type: "checkbox", defaultValue: false },
    children: { type: "text", initialValue: "Click me" },
    loaderText: { type: "text" },
  },
  getCode,
};

export const variantsDemo = {
  type: "code",
  code: `<Flex gap="large">
    <Button variant="solid">Solid</Button>
    <Button variant="outline">Outline</Button>
    <Button variant="ghost">Ghost</Button>
    <Button variant="text">Text</Button>
  </Flex>`,
};

export const colorsDemo = {
  type: "code",
  tabs: [
    {
      name: "Solid",
      code: `
      <Flex gap="large">
        <Button color="success">Accent</Button>
        <Button color="danger">Danger</Button>
        <Button color="neutral">Neutral</Button>
        <Button color="success">Success</Button>
      </Flex>`,
    },
    {
      name: "Outline",
      code: `
      <Flex gap="large">
        <Button variant="outline" color="success">Accent</Button>
        <Button variant="outline" color="danger">Danger</Button>
        <Button variant="outline" color="neutral">Neutral</Button>
        <Button variant="outline" color="success">Success</Button>
      </Flex>`,
    },
    {
      name: "Ghost",
      code: `
      <Flex gap="large">
        <Button variant="ghost" color="success">Accent</Button>
        <Button variant="ghost" color="danger">Danger</Button>
        <Button variant="ghost" color="neutral">Neutral</Button>
        <Button variant="ghost" color="success">Success</Button>
      </Flex>`,
    },
    {
      name: "Text",
      code: `
      <Flex gap="large">
        <Button variant="text" color="success">Accent</Button>
        <Button variant="text" color="danger">Danger</Button>
        <Button variant="text" color="neutral">Neutral</Button>
        <Button variant="text" color="success">Success</Button>
      </Flex>`,
    },
  ],
};

export const sizesDemo = {
  type: "code",
  code: `<Flex gap="large" align="center">
    <Button size="small">Small</Button>
    <Button size="normal">Normal</Button>
  </Flex>`,
};
export const disabledDemo = {
  type: "code",
  code: `<Flex gap="large">
    <Button variant="solid" disabled>Solid</Button>
    <Button variant="outline" disabled>Outline</Button>
    <Button variant="ghost" disabled>Ghost</Button>
    <Button variant="text" disabled>Text</Button>
  </Flex>`,
};
export const loadingDemo = {
  type: "code",
  code: `<Flex gap="large">
    <Button variant="solid" loading>Button</Button>
    <Button variant="solid" loading loaderText="Loading...">Button</Button>
    <Button variant="outline" loading loaderText="Loading...">Button</Button>
  </Flex>`,
};
export const iconsDemo = {
  type: "code",
  code: `<Flex gap="large">
    <Button variant="solid" color="accent" leadingIcon={<>I</>}>With leading icon</Button>
    <Button variant="solid" color="accent" trailingIcon={<>O</>}>With trailing icon</Button>
    <Button variant="solid" color="accent" leadingIcon={<>I</>} trailingIcon={<>O</>}>With both icons</Button>
  </Flex>`,
};
