import { cva, type VariantProps } from "class-variance-authority";
import { AnchorHTMLAttributes, forwardRef } from "react";

import textStyles from "../text/text.module.css";
import styles from "./link.module.css";

const link = cva([styles.link], {
  variants: {
    variant: {
      primary: textStyles["text-primary"],
      secondary: textStyles["text-secondary"],
      tertiary: textStyles["text-tertiary"],
      emphasis: textStyles["text-emphasis"],
      accent: textStyles["text-accent"],
      attention: textStyles["text-attention"],
      danger: textStyles["text-danger"],
      success: textStyles["text-success"],
    },
    size: {
      1: textStyles["text-1"],
      2: textStyles["text-2"],
      3: textStyles["text-3"],
      4: textStyles["text-4"],
      5: textStyles["text-5"],
      6: textStyles["text-6"],
      7: textStyles["text-7"],
      8: textStyles["text-8"],
      9: textStyles["text-9"],
      10: textStyles["text-10"],
    },
    weight: {
      bold: textStyles["text-weight-bold"],
      bolder: textStyles["text-weight-bolder"],
      normal: textStyles["text-weight-normal"],
      lighter: textStyles["text-weight-lighter"],
      100: textStyles["text-weight-100"],
      200: textStyles["text-weight-200"],
      300: textStyles["text-weight-300"],
      400: textStyles["text-weight-400"],
      500: textStyles["text-weight-500"],
      600: textStyles["text-weight-600"],
      700: textStyles["text-weight-700"],
      800: textStyles["text-weight-800"],
      900: textStyles["text-weight-900"],
    },
    underline: {
      true: styles["link-underline"],
    },
  },
  defaultVariants: {
    variant: "primary",
    size: 2,
    weight: 400,
    underline: false,
  },
});

export interface LinkProps
  extends AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof link> {
  href: string;
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      className,
      children,
      href,
      size,
      weight,
      variant,
      underline,
      ...props
    },
    ref
  ) => {
    return (
      <a
        ref={ref}
        className={link({ size, weight, variant, underline, className })}
        href={href}
        {...props}
      >
        {children}
      </a>
    );
  }
);

Link.displayName = "Link"; 