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
    disabled: { type: "checkbox", defaultValue: false },
    loading: { type: "checkbox", defaultValue: false },
    children: { type: "text", initialValue: "Click me" },
    loaderText: { type: "text", defaultValue: "" },
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

export const sizesDemo = {
  type: "code",
  tabs: [
    { name: "Normal", code: `<Button>Normal</Button>` },
    {
      name: "Small",
      code: `<Button size="small">Small</Button>`,
    },
  ],
};
