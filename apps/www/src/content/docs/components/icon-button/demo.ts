"use client";

import { getPropsString } from "@/lib/utils";

export const getCode = (props: any) => {
  const { children, ...rest } = props;
  return `<IconButton${getPropsString(rest)}>${children}</Headline>`;
};

export const playground = {
  type: "playground",
  controls: {
    size: {
      type: "select",
      options: [1, 2, 3, 4],
      defaultValue: 2,
      initialValue: 4,
    },
    disabled: { type: "checkbox", defaultValue: false },
    children: {
      type: "icon",
      initialValue: "<Info size={16} />",
    },
  },
  getCode,
};

export const sizeDemo = {
  type: "code",
  code: `
  <Flex gap="large" align="center">
    <IconButton size={1}><Info size={16} /></IconButton>
    <IconButton size={2}><Info size={16} /></IconButton>
    <IconButton size={3}><Info size={16} /></IconButton>
    <IconButton size={4}><Info size={16} /></IconButton>
  </Flex>`,
};
export const stateDemo = {
  type: "code",
  code: `
  <Flex gap="large">
    <IconButton size={4}><Info size={16} /></IconButton>
    <IconButton size={4} disabled><Info size={16} /></IconButton>
  </Flex>`,
};
