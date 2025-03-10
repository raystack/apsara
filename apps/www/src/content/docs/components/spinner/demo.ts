"use client";

import { getPropsString } from "@/lib/utils";

export const getCode = (props: any) => {
  const { color } = props;
  if (color === "inverted")
    return `
  <Flex style={{ backgroundColor: 'black', padding:"20px" }}>
    <Spinner${getPropsString(props)}/>
  </Flex>`;
  return `<Spinner${getPropsString(props)}/>`;
};

export const playground = {
  type: "playground",
  controls: {
    size: {
      type: "number",
      options: [1, 2, 3, 4, 5, 6],
      defaultValue: 1,
      initialValue: 4,
      min: 1,
      max: 6,
    },
    color: {
      type: "select",
      options: ["default", "inverted"],
      defaultValue: "default",
    },
  },
  getCode,
};

export const sizeDemo = {
  type: "code",
  code: `
  <Flex gap="medium" align="center">
    <Spinner size={1} />
    <Spinner size={2} />
    <Spinner size={3} />
    <Spinner size={4} />
    <Spinner size={5} />
    <Spinner size={6} />
  </Flex>`,
};
export const colorDemo = {
  type: "code",
  code: `
  <Flex gap="large" align="center">
    <Spinner size={4}/>
    <Flex style={{ backgroundColor: 'black', padding:"20px" }}>
    <Spinner size={4} color="inverted" />
    </Flex>
  </Flex>`,
};
