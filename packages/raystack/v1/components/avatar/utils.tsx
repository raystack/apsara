import { isValidElement, ReactElement } from "react";
import { Avatar } from "./avatar";

import { AvatarProps } from "./avatar";

export const COLORS = [
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
] as const;

export type AVATAR_COLORS = typeof COLORS[number];

export function getAvatarColor(str: string): AVATAR_COLORS {
  const hash = str.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const index = hash % COLORS.length;
  return COLORS[index];
}

/*
 * @desc Recursively get the avatar props even if it's
 * wrapped in another component like Tooltip, Flex, etc.
 */ 
export const getAvatarProps = (element: ReactElement): AvatarProps => {
  if (element.type === Avatar) {
    return element.props;
  }
  
  if (element.props.children) {
    if (isValidElement(element.props.children)) {
      return getAvatarProps(element.props.children);
    }
  }
  return {};
};