import { VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";
import { Flex } from "~/flex";

import styles from "./datatable.module.css";
import clsx from "clsx";

type DataTableToolbarProps<TData> = VariantProps<typeof Flex> & {
  children?: ReactNode;
  className?: string;
};

export function DataTableToolbar<TData>({
  children,
  className,
  ...props
}: DataTableToolbarProps<TData>) {
  return (
    <Flex
      direction="column"
      className={clsx(styles.toolbar, className)}
      {...props}
    >
      {children}
    </Flex>
  );
}
