import { cva, VariantProps } from "class-variance-authority";
import { HTMLAttributes, PropsWithChildren } from "react";
import styles from "./flex.module.css";

const flex = cva(styles.flex, {
  variants: {
    direction: {
      row: styles["direction-row"],
      column: styles["direction-column"],
      rowReverse: styles["direction-rowReverse"],
      columnReverse: styles["direction-columnReverse"],
    },
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
    wrap: {
      noWrap: styles["wrap-noWrap"],
      wrap: styles["wrap-wrap"],
      wrapReverse: styles["wrap-wrapReverse"],
    },
    gap: {
      xs: styles["gap-xs"],
      sm: styles["gap-sm"],
      md: styles["gap-md"],
      lg: styles["gap-lg"],
      xl: styles["gap-xl"],
    },
  },
  defaultVariants: {
    direction: "row",
    align: "stretch",
    justify: "start",
    wrap: "noWrap",
  },
});

type BoxProps = PropsWithChildren<VariantProps<typeof flex>> &
  HTMLAttributes<HTMLElement>;

export function Flex({
  children,
  direction,
  align,
  justify,
  wrap,
  gap,
  className,
  ...props
}: BoxProps) {
  return (
    <div
      className={flex({ direction, align, justify, wrap, gap, className })}
      {...props}
    >
      {children}
    </div>
  );
}
