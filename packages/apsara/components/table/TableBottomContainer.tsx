import type { FC, ReactNode } from "react";
import React from "react";
import { Button } from "~/components/button";
import { useTable } from "./hooks/useTable";

export interface TableBottomContainerProps {
  children?: ReactNode;
}
export const TableBottomContainer: FC<TableBottomContainerProps> = ({
  children,
}) => {
  const { clearSelection } = useTable();
  return (
    <div>
      <Button onClick={clearSelection}>welcome</Button>
    </div>
  );
};
