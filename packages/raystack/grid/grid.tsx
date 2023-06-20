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
      "extra-small": styles["gap-xs"],
      small: styles["gap-sm"],
      medium: styles["gap-md"],
      large: styles["gap-lg"],
      "extra-large": styles["gap-xl"],
    },
    gapX: {
      "extra-small": styles["gapX-xs"],
      small: styles["gapX-sm"],
      medium: styles["gapX-md"],
      large: styles["gapX-lg"],
      "extra-large": styles["gapX-xl"],
    },
    gapY: {
      "extra-small": styles["gapY-xs"],
      small: styles["gapY-sm"],
      medium: styles["gapY-md"],
      large: styles["gapY-lg"],
      "extra-large": styles["gapY-xl"],
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
