import { cva, VariantProps } from "class-variance-authority";
import { HTMLAttributes, PropsWithChildren } from "react";
import styles from "./text.module.css";

const text = cva(styles.text, {
  variants: {
    variant: {
      primary: styles["text-primary"],
      secondary: styles["text-secondary"],
      tertiary: styles["text-tertiary"],
      emphasis: styles["text-emphasis"],
      accent: styles["text-accent"],
      attention: styles["text-attention"],
      danger: styles["text-danger"],
      success: styles["text-success"],
    },
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
    variant: "primary",
    size: 2,
    weight: 400,
  },
});

export type TextProps = PropsWithChildren<VariantProps<typeof text>> &
  HTMLAttributes<HTMLSpanElement>;

export function Text({
  children,
  className,
  size,
  variant,
  weight,
  ...props
}: TextProps) {
  return (
    <span className={text({ size, className, weight, variant })} {...props}>
      {children}
    </span>
  );
}
