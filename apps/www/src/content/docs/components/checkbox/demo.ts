"use client";

import { getPropsString } from "@/lib/utils";

export const getCode = (props: any) => {
  if (props.checked === "false") props.checked = false;
  else if (props.checked === "true") props.checked = true;

  return `<Checkbox${getPropsString(props)}/>`;
};

export const playground = {
  type: "playground",
  controls: {
    checked: {
      type: "select",
      options: ["true", "false", "indeterminate"],
      initialValue: "true",
    },
    disabled: {
      type: "checkbox",
      defaultValue: false,
    },
  },
  getCode,
};

export const statesExamples = {
  type: "code",
  tabs: [
    {
      name: "Basic",
      code: `<Checkbox />`,
    },
    {
      name: "Checked",
      code: `<Checkbox checked={true} />`,
    },
    {
      name: "Indeterminate",
      code: `<Checkbox checked="indeterminate" />`,
    },
    {
      name: "Disabled",
      code: `<Checkbox disabled />`,
    },
  ],
};
