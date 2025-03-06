"use client";

import { getPropsString } from "@/lib/utils";

export const getCode = (props: any) => {
  return `<Avatar${getPropsString(props)}/>`;
};

export const playground = {
  type: "playground",
  controls: {
    variant: {
      type: "select",
      options: ["solid", "soft"],
      defaultValue: "soft",
    },
    radius: {
      type: "select",
      options: ["small", "full"],
      defaultValue: "small",
    },
    color: {
      type: "select",
      options: [
        "indigo",
        "orange",
        "mint",
        "neutral",
        "sky",
        "lime",
        "grass",
        "cyan",
        "iris",
        "purple",
        "pink",
        "crimson",
        "gold",
      ],
      defaultValue: "indigo",
    },
    size: { type: "number", defaultValue: 3, min: 1, max: 13 },
    src: {
      type: "text",
      initialValue:
        "https://images.unsplash.com/photo-1511485977113-f34c92461ad9",
    },
    fallback: { type: "text", initialValue: "RC" },
  },
  getCode,
};
