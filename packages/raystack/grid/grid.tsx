import { cva, VariantProps } from "class-variance-authority";
import { HTMLAttributes, PropsWithChildren } from "react";
import styles from "./grid.module.css";

const grid = cva(styles.grid, {
  variants: {
    align: {
      start: styles["align-start"],
      center: styles["align-center"],
      end: styles["align-end"],
      stretch: styles["align-stretch"],
      baseline: styles["align-baseline"],
    },
    justify: {
      start: styles["justify-start"],
      center: styles["justify-center"],
      end: styles["justify-end"],
      between: styles["justify-between"],
    },

    flow: {
      row: styles["flow-row"],
      column: styles["flow-column"],
      dense: styles["flow-dense"],
      rowDense: styles["flow-rowDense"],
      columnDense: styles["flow-columnDense"],
    },

    columns: {
      1: styles["columns-1"],
      2: styles["columns-2"],
      3: styles["columns-3"],
      4: styles["columns-4"],
    },

    gap: {
      xs: styles["gap-xs"],
      sm: styles["gap-sm"],
      md: styles["gap-md"],
      lg: styles["gap-lg"],
      xl: styles["gap-xl"],
    },
    gapX: {
      xs: styles["gapX-xs"],
      sm: styles["gapX-sm"],
      md: styles["gapX-md"],
      lg: styles["gapX-lg"],
      xl: styles["gapX-xl"],
    },
    gapY: {
      xs: styles["gapY-xs"],
      sm: styles["gapY-sm"],
      md: styles["gapY-md"],
      lg: styles["gapY-lg"],
      xl: styles["gapY-xl"],
    },
  },
});

type BoxProps = PropsWithChildren<VariantProps<typeof grid>> &
  HTMLAttributes<HTMLElement>;

export function Grid({
  children,
  align,
  justify,
  flow,
  columns,
  gap,
  gapX,
  gapY,
  className,
  ...props
}: BoxProps) {
  return (
    <div
      className={grid({
        align,
        justify,
        flow,
        columns,
        gap,
        gapX,
        gapY,
        className,
      })}
      {...props}
    >
      {children}
    </div>
  );
}
