import { forwardRef, HTMLAttributes, ReactNode } from "react";
import { cx } from "class-variance-authority";
import styles from "./cell.module.css";

export type CellBaseProps = {
  type?: "checkbox" | "radio" | "item";
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
};
export type CellProps = HTMLAttributes<HTMLDivElement> & CellBaseProps;

export const Cell = forwardRef<HTMLDivElement, CellProps>(
  (
    { className, children, leadingIcon, trailingIcon, type = "item", ...props },
    ref,
  ) => (
    <div ref={ref} {...props} className={cx(styles.cell, className)}>
      {leadingIcon && <span className={styles.leadingIcon}>{leadingIcon}</span>}
      {children}
      {trailingIcon && (
        <span className={styles.trailingIcon}>{trailingIcon}</span>
      )}
    </div>
  ),
);
