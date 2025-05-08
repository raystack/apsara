import { ReactNode } from "react";

export const getMatch = (
  value?: string,
  children?: ReactNode,
  search?: string,
) => {
  if (!search?.length) return true;
  const childrenValue = getChildrenValue(children)?.toLowerCase();

  return (
    value?.toLowerCase().includes(search.toLowerCase()) ||
    childrenValue?.includes(search.toLowerCase())
  );
};

export const getChildrenValue = (children?: ReactNode) => {
  if (typeof children === "string") return children;
  if (typeof children === "object" && children !== null) {
    return children.toString();
  }
  return null;
};
