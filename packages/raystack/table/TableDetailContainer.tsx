import type { FC, ReactNode } from "react";
import { Flex } from "~/flex";

export interface TableDetailContainerProps {
  children?: ReactNode;
}

export const TableDetailContainer: FC<TableDetailContainerProps> = ({
  children,
}) => {
  return <Flex>{children}</Flex>;
};
