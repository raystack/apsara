import { AnchorHTMLAttributes, forwardRef } from "react";
import { cx } from "class-variance-authority";
import { Text, type TextBaseProps } from "../text";
import styles from "./link.module.css";

export interface LinkProps
  extends TextBaseProps,
    AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  external?: boolean;
  download?: boolean | string;
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      children,
      className,
      variant = "accent",
      size = "small",
      external,
      download,
      ...props
    },
    ref,
  ) => {
    const externalProps = external
      ? {
          target: "_blank",
          rel: "noopener noreferrer",
          "aria-label": `${children} (opens in new tab)`,
        }
      : {};

    const downloadProps = download
      ? {
          download: typeof download === "string" ? download : true,
          "aria-label": `${children} (download)`,
        }
      : {};

    return (
      <Text
        ref={ref}
        className={cx(styles.link, className)}
        variant={variant}
        size={size}
        role="link"
        {...externalProps}
        {...downloadProps}
        {...props}
        as="a">
        {children}
      </Text>
    );
  },
);

Link.displayName = "Link";
