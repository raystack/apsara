import { cva, type VariantProps } from "class-variance-authority";
import { HTMLAttributes } from "react";

// Also used by link.tsx
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
  },
  defaultVariants: {
    variant: "primary",
    size: "regular",
    weight: "regular",
  },
});

export type TextProps = VariantProps<typeof text> & {
  as?: "span" | "p" | "div" | "label";
};

type TextComponentProps = TextProps &
  HTMLAttributes<
    HTMLParagraphElement | HTMLSpanElement | HTMLDivElement | HTMLLabelElement
  >;

export const Text = ({
  className,
  size,
  variant,
  weight,
  transform,
  align,
  as: Component = "span",
  ...rest
}: TextComponentProps) => (
  <Component
    className={text({
      size,
      className,
      weight,
      variant,
      transform,
      align,
    })}
    {...rest}
  />
);

Text.displayName = "Text";
