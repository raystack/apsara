import { forwardRef, HTMLAttributes, ReactNode } from "react";
import { cx } from "class-variance-authority";
import styles from "./cell.module.css";
import { Checkbox } from "../checkbox";

export type CellBaseProps = {
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
};
export type CellProps = HTMLAttributes<HTMLDivElement> &
  CellBaseProps & {
    type?: "select" | "item";
  };

export const Cell = forwardRef<HTMLDivElement, CellProps>(
  (
    { className, children, leadingIcon, trailingIcon, type = "item", ...props },
    ref,
  ) => (
    <div
      ref={ref}
      {...props}
      className={cx(styles.cell, styles.comboboxcell, className)}>
      {type == "select" && <Checkbox />}
      {leadingIcon && <span className={styles.leadingIcon}>{leadingIcon}</span>}
      {children}
      {trailingIcon && (
        <span className={styles.trailingIcon}>{trailingIcon}</span>
      )}
    </div>
  ),
);
