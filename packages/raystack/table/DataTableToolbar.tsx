import { VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";
import { Flex } from "~/flex";

import styles from "./datatable.module.css";

type DataTableToolbarProps<TData> = VariantProps<typeof Flex> & {
  children?: ReactNode;
};

export function DataTableToolbar<TData>({
  children,
  ...props
}: DataTableToolbarProps<TData>) {
  return (
    <Flex direction="column" className={styles.toolbar} {...props}>
      {children}
    </Flex>
  );
}
