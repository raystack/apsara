import { cva, VariantProps } from "class-variance-authority";
import { AnchorHTMLAttributes, PropsWithChildren } from "react";
import styles from "./link.module.css";

const link = cva(styles.link, {
  variants: {
    size: {
      small: styles["link-small"],
      medium: styles["link-medium"],
      large: styles["link-large"],
    },
  },
  defaultVariants: {
    size: "small",
  },
});

type LinkProps = PropsWithChildren<VariantProps<typeof link>> &
  AnchorHTMLAttributes<HTMLAnchorElement>;

export function Link({ children, className, ...props }: LinkProps) {
  return (
    <a className={link({ className })} {...props}>
      {children}
    </a>
  );
}
