"use client";

import { getPropsString } from "@/lib/utils";

export const getCode = (props: any) => {
  const { children, ...rest } = props;
  return `<Headline${getPropsString(rest)}>${children}</Headline>`;
};

export const playground = {
  type: "playground",
  controls: {
    size: {
      type: "select",
      options: ["small", "medium", "large"],
      defaultValue: "small",
    },
    as: {
      type: "select",
      options: ["h1", "h2", "h3", "h4", "h5", "h6"],
      defaultValue: "h2",
    },
    align: {
      type: "select",
      options: ["left", "center", "right"],
      defaultValue: "left",
      initialValue: "center",
    },
    truncate: { type: "checkbox", defaultValue: false },
    children: { type: "text", initialValue: "This is a Headline" },
  },
  getCode,
};

export const alignDemo = {
  type: "code",
  code: `
  <Flex direction="column" style={{width:"100%"}} gap="large">
    <Headline size="small" align="left">Left Aligned</Headline>
    <Headline size="small" align="center">Center Aligned</Headline>
    <Headline size="small" align="right">Right Aligned</Headline>
  </Flex>`,
};
export const truncateDemo = {
  type: "code",
  code: `
  <Flex style={{ width: "200px" }}>
    <Headline size="small" truncate>
      This is a very long headline that will be truncated with an ellipsis
    </Headline>
  </Flex>`,
};
