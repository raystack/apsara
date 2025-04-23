"use client";

import { getPropsString } from "@/lib/utils";

export const getCode = (props: any) => {
  const { children, ...rest } = props;
  return `<Link${getPropsString(rest)}>${children}</Link>`;
};

export const playground = {
  type: "playground",
  controls: {
    href: { type: "text", initialValue: "https://apsara.raystack.org/" },
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
      defaultValue: "accent",
    },
    size: {
      type: "select",
      options: ["micro", "mini", "small", "regular", "large"],
      defaultValue: "small",
    },
    weight: {
      type: "select",
      options: ["regular", "medium"],
      defaultValue: "regular",
    },
    underline: { type: "checkbox", defaultValue: false },
    external: { type: "checkbox", defaultValue: false },
    download: { type: "checkbox", defaultValue: false },
    children: { type: "text", initialValue: "My Link" },
  },
  getCode,
};

export const variantDemo = {
  type: "code",
  code: `
  <Flex gap="medium" align="center">
    <Link href="#" variant="primary">Primary Link</Link>
    <Link href="#" variant="secondary">Secondary Link</Link>
    <Link href="#" variant="tertiary">Tertiary Link</Link>
    <Link href="#" variant="accent">Accent Link</Link>
    <Link href="#" variant="attention">Attention Link</Link>
    <Link href="#" variant="danger">Danger Link</Link>
    <Link href="#" variant="success">Success Link</Link>
  </Flex>`,
};
export const sizeDemo = {
  type: "code",
  code: `
  <Flex gap="large" align="center">
     <Link href="#" size="micro">This is a text</Link> 
    <Link href="#" size="mini">This is a text</Link> 
    <Link href="#" size="small">This is a text</Link> 
    <Link href="#" size="regular">This is a text</Link> 
    <Link href="#" size="large">This is a text</Link> 
  </Flex>`,
};
export const weightDemo = {
  type: "code",
  code: `
  <Flex gap="large" align="center">
    <Link href="#" weight="regular">This is a text</Link>
    <Link href="#" weight="medium">This is a text</Link>
  </Flex>`,
};
export const styleDemo = {
  type: "code",
  code: `
  <Flex gap="medium" align="end">
    <Link href="#" variant="primary" underline>Underlined Link</Link>
    <Link href="https://example.com" external>External Link</Link>
    <Link href="/assets/logo.svg" download>Download File</Link>
  </Flex>`,
};
