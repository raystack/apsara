"use client";
import { getPropsString } from "@/lib/utils";

export const getCode = (props: any) => {
  return `
    <Flex${getPropsString(props)} style={{width:"100%",height:"100%"}}>
      <Button>Button 1</Button>
      <Button>Button 2</Button>
      <Button>Button 3</Button>
    </Flex>`;
};
export const playground = {
  type: "playground",
  controls: {
    gap: {
      type: "select",
      options: ["extra-small", "small", "medium", "large", "extra-large"],
      initialValue: "small",
    },
    wrap: {
      type: "select",
      options: ["nowrap", "wrap", "wrap-reverse"],
      initialValue: "wrap",
    },
    justify: {
      type: "select",
      options: ["start", "end", "center", "between"],
      initialValue: "center",
    },
    align: {
      type: "select",
      options: ["start", "end", "center", "baseline", "stretch"],
      initialValue: "center",
    },
    direction: {
      type: "select",
      options: ["row", "rowReverse", "column", "columnReverse"],
      initialValue: "row",
    },
  },
  getCode,
};

export const preview = {
  type: "code",
  code: `
  <Flex gap="large">
    <Flex gap="medium" direction="column">
      <Button>Primary button</Button>
      <Button>Primary button</Button>
      <Button>Primary button</Button>
    </Flex>
    <Flex gap="medium" direction="column">
      <Button>Primary button</Button>
      <Button>Primary button</Button>
      <Button>Primary button</Button>
    </Flex>
  </Flex>`,
};
