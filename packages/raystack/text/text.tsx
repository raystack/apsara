import { cva, VariantProps } from "class-variance-authority";
import { HTMLAttributes, PropsWithChildren } from "react";
import styles from "./text.module.css";

const text = cva(styles.text, {
  variants: {
    size: {
      1: styles["text-1"],
      2: styles["text-2"],
      3: styles["text-3"],
      4: styles["text-4"],
      5: styles["text-5"],
      6: styles["text-6"],
      7: styles["text-7"],
      8: styles["text-8"],
      9: styles["text-9"],
      10: styles["text-10"],
    },
    weight: {
      bold: styles["text-weight-bold"],
      bolder: styles["text-weight-bolder"],
      normal: styles["text-weight-normal"],
      lighter: styles["text-weight-lighter"],
      100: styles["text-weight-100"],
      200: styles["text-weight-200"],
      300: styles["text-weight-300"],
      400: styles["text-weight-400"],
      500: styles["text-weight-500"],
      600: styles["text-weight-600"],
      700: styles["text-weight-700"],
      800: styles["text-weight-800"],
      900: styles["text-weight-900"],
    },
  },
  defaultVariants: {
    size: 2,
    weight: 400,
  },
});

export type TextProps = PropsWithChildren<VariantProps<typeof text>> &
  HTMLAttributes<HTMLSpanElement>;

/**
 * @deprecated Use Text from '@raystack/apsara/v1' instead.
 */
export function Text({
  children,
  className,
  size,
  weight,
  ...props
}: TextProps) {
  return (
    <span className={text({ size, className, weight })} {...props}>
      {children}
    </span>
  );
}
