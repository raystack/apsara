import { cva, type VariantProps } from "class-variance-authority";
import { ComponentPropsWithoutRef, forwardRef } from "react";

// Also used by link.tsx
import styles from "./text.module.css";
import * as Slot from "@radix-ui/react-slot";

const textVariants = cva(styles.text, {
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
    },
    weight: {
      regular: styles["text-weight-regular"],
      medium: styles["text-weight-medium"],
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
    size: "regular",
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

export type TextProps = VariantProps<typeof textVariants> & {
  as?: "span" | "p" | "div" | "label";
};

type TextSpanProps = { as?: "span" } & ComponentPropsWithoutRef<"span">;
type TextDivProps = { as: "div" } & ComponentPropsWithoutRef<"div">;
type TextLabelProps = { as: "label" } & ComponentPropsWithoutRef<"label">;
type TextPProps = { as: "p" } & ComponentPropsWithoutRef<"p">;
type TextComponentProps = TextProps &
  (TextSpanProps | TextDivProps | TextLabelProps | TextPProps);
type TextRef =
  | HTMLSpanElement
  | HTMLParagraphElement
  | HTMLDivElement
  | HTMLLabelElement;

export const Text = forwardRef<TextRef, TextComponentProps>(
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
