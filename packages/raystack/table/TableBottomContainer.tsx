import type { FC, ReactNode } from "react";

export interface TableBottomContainerProps {
  children?: ReactNode;
}
export const TableBottomContainer: FC<TableBottomContainerProps> = ({
  children,
}) => {
  // const { clearSelection } = useTable();
  return <div>{children}</div>;
};
