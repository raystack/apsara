import type { FC, ReactNode } from "react";
import { Flex } from "~/flex";

export interface TableTopContainerProps {
  children?: ReactNode;
}

export const TableTopContainer: FC<TableTopContainerProps> = ({ children }) => {
  return <Flex>{children}</Flex>;
};
