import { VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";
import { Flex } from "~/flex";

import styles from "./datatable.module.css";

type DataTableFooterProps<TData> = VariantProps<typeof Flex> & {
  children?: ReactNode;
};

export function DataTableFooter<TData>({
  children,
}: DataTableFooterProps<TData>) {
  return (
    <Flex direction="column" className={styles.toolbar}>
      {children}
    </Flex>
  );
}
