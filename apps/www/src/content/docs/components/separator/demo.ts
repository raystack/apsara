"use client";

import { getPropsString } from "@/lib/utils";

export const getCode = (props: any) => {
  return `<Separator${getPropsString(props)}/>`;
};

export const playground = {
  type: "playground",
  controls: {
    size: {
      type: "select",
      options: ["small", "half", "full"],
      defaultValue: "full",
    },
    color: {
      type: "select",
      options: ["primary", "secondary", "tertiary"],
      defaultValue: "primary",
    },
    orientation: {
      type: "select",
      options: ["horizontal", "vertical"],
      defaultValue: "horizontal",
    },
  },
  getCode,
};
export const sizeDemo = {
  type: "code",
  code: `
  <Flex direction="column" gap="large" align="center" style={{width:"400px"}}>
    <Separator size="small" />
    <Separator size="half" />
    <Separator size="full" />
  </Flex>`,
};

export const colorDemo = {
  type: "code",
  code: `
  <Flex direction="column" gap="large" align="center" style={{width:"400px"}}>
    <Separator color="primary" />
    <Separator color="secondary" />
    <Separator color="tertiary" />
  </Flex>`,
};
export const orientationDemo = {
  type: "code",
  code: `
  <Flex gap="extra-large" align="center" justify="center" style={{width:"400px",height:"150px"}}>
    <Separator size="half" />
    <Separator orientation="vertical" />
  </Flex>`,
};
