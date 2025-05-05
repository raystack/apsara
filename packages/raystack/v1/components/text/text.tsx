import { cva, type VariantProps } from "class-variance-authority";
import { ComponentPropsWithoutRef, forwardRef } from "react";
import * as Slot from "@radix-ui/react-slot";
import styles from "./text.module.css";

export const textVariants = cva(styles.text, {
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
      micro: styles["text-micro"],
      mini: styles["text-mini"],
      small: styles["text-small"],
      regular: styles["text-regular"],
      large: styles["text-large"],
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
      regular: styles["text-weight-regular"],
      medium: styles["text-weight-medium"],
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
    transform: {
      capitalize: styles["text-transform-capitalize"],
      uppercase: styles["text-transform-uppercase"],
      lowercase: styles["text-transform-lowercase"],
    },
    align: {
      center: styles["text-align-center"],
      start: styles["text-align-start"],
      end: styles["text-align-end"],
      justify: styles["text-align-justify"],
    },
    lineClamp: {
      1: [styles["text-line-clamp"], styles["text-line-clamp-1"]],
      2: [styles["text-line-clamp"], styles["text-line-clamp-2"]],
      3: [styles["text-line-clamp"], styles["text-line-clamp-3"]],
      4: [styles["text-line-clamp"], styles["text-line-clamp-4"]],
      5: [styles["text-line-clamp"], styles["text-line-clamp-5"]],
    },
    underline: {
      true: styles["text-underline"],
    },
    strikeThrough: {
      true: styles["text-strike-through"],
    },
    italic: {
      true: styles["text-italic"],
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "small",
    weight: "regular",
  },
  compoundVariants: [
    {
      strikeThrough: true,
      underline: true,
      className: styles["text-italic-strike-through"],
    },
  ],
});

export type TextBaseProps = VariantProps<typeof textVariants> & {
  /**
   * @remarks Use "micro" | "mini" | "small" | "regular" | "large"
   */
  size?:
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | 10
    | "micro"
    | "mini"
    | "small"
    | "regular"
    | "large";
  /**
   * @remarks Use "regular" | "medium"
   */
  weight?:
    | "regular"
    | "medium"
    | "bold"
    | "bolder"
    | "normal"
    | "lighter"
    | 100
    | 200
    | 300
    | 400
    | 500
    | 600
    | 700
    | 800
    | 900;
};

type TextSpanProps = { as?: "span" } & ComponentPropsWithoutRef<"span">;
type TextDivProps = { as: "div" } & ComponentPropsWithoutRef<"div">;
type TextLabelProps = { as: "label" } & ComponentPropsWithoutRef<"label">;
type TextPProps = { as: "p" } & ComponentPropsWithoutRef<"p">;
type TextAProps = { as: "a" } & ComponentPropsWithoutRef<"a">;
export type TextProps = TextBaseProps &
  (TextSpanProps | TextDivProps | TextLabelProps | TextPProps | TextAProps);
type TextRef =
  | HTMLSpanElement
  | HTMLParagraphElement
  | HTMLDivElement
  | HTMLLabelElement
  | HTMLAnchorElement;

export const Text = forwardRef<TextRef, TextProps>(
  (
    {
      className,
      size,
      variant,
      weight,
      transform,
      align,
      lineClamp,
      underline,
      strikeThrough,
      italic,
      as: Component = "span",
      children,
      ...rest
    },
    ref,
  ) => (
    <Slot.Root
      ref={ref}
      className={textVariants({
        size,
        className,
        weight,
        variant,
        transform,
        align,
        lineClamp,
        underline,
        strikeThrough,
        italic,
      })}
      {...rest}>
      <Component>{children}</Component>
    </Slot.Root>
  ),
);

Text.displayName = "Text";
