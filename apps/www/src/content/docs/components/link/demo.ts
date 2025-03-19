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
    size: { type: "number", min: 1, max: 10, defaultValue: 2 },
    weight: {
      type: "select",
      options: [100, 200, 300, 400, 500, 600, 700, 800, 900],
      defaultValue: 400,
    },
    underline: { type: "checkbox", defaultValue: false },
    external: { type: "checkbox", defaultValue: false },
    download: { type: "checkbox", defaultValue: false },
    children: { type: "text", initialValue: "Link" },
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
  <Flex gap="medium" align="end">
    <Link href="#" size={1}>Size 1</Link>
    <Link href="#" size={2}>Size 2</Link>
    <Link href="#" size={3}>Size 3</Link>
    <Link href="#" size={4}>Size 4</Link>
    <Link href="#" size={5}>Size 5</Link>
    <Link href="#" size={6}>Size 6</Link>
    <Link href="#" size={7}>Size 7</Link>
    <Link href="#" size={8}>Size 8</Link>
    <Link href="#" size={9}>Size 9</Link>
    <Link href="#" size={10}>Size 10</Link>
  </Flex>`,
};
export const weightDemo = {
  type: "code",
  code: `
  <Flex gap="medium" align="end">
    <Link href="#" weight="normal">Normal Weight</Link>
    <Link href="#" weight="bold">Bold Weight</Link>
    <Link href="#" weight={500}>Weight 500</Link>
  </Flex>`,
};
export const styleDemo = {
  type: "code",
  code: `
  <Flex gap="medium" align="end">
    <Link href="#" variant="primary" underline>Underlined Link</Link>
    <Link href="https://example.com" external>External Link</Link>
    <Link href="/file.pdf" download>Download File</Link>
  </Flex>`,
};
