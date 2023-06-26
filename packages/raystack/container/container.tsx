import { cva, VariantProps } from "class-variance-authority";
import { HTMLAttributes, PropsWithChildren } from "react";
import styles from "./container.module.css";

const container = cva(styles.container, {
  variants: {
    size: {
      small: styles["container-small"],
      medium: styles["container-medium"],
      large: styles["container-large"],
      none: styles["container-none"],
    },
  },
  defaultVariants: {
    size: "none",
  },
});

type ContainerProps = PropsWithChildren<VariantProps<typeof container>> &
  HTMLAttributes<HTMLElement>;

export function Container({
  children,
  size,
  className,
  ...props
}: ContainerProps) {
  return (
    <div className={container({ size, className })} {...props}>
      {children}
    </div>
  );
}
