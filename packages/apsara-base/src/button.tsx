import React from "react";

export interface ButtonProps {}
export const Button = ({ children, onClick }: any) => {
  return <button onClick={onClick}>{children}</button>;
};
