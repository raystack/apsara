import { ReactNode } from "react";

export const getMatch = (value: string, search?: string) => {
  if (!search?.length) return true;
  return value.toLowerCase().includes(search.toLowerCase());
};

export const getValue = (value?: string, children?: ReactNode) =>
  String(value ?? typeof children === "string" ? children : "") ?? "";
