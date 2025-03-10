"use client";

import { getPropsString } from "@/lib/utils";

export const getCode = (props: any) => {
  return `<Switch${getPropsString(props)}/>`;
};

export const playground = {
  type: "playground",
  controls: {
    defaultChecked: {
      type: "checkbox",
      defaultValue: false,
    },
    disabled: {
      type: "checkbox",
      defaultValue: false,
    },
  },
  getCode,
};

export const stateDemo = {
  type: "code",
  code: `
  <Flex gap="large" align="center">
    <Switch />
    <Switch defaultChecked />
    <Switch disabled />
    <Switch disabled defaultChecked />
    <Switch required />
  </Flex>`,
};
export const controlDemo = {
  type: "code",
  code: `
  function ControlledSwitch() {
  const [checked, setChecked] = React.useState(false);
  return (
    <Switch 
      checked={checked}
      onCheckedChange={setChecked}
    />
  );
}`,
};
