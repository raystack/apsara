import { cva, VariantProps } from "class-variance-authority";
import React, {
  ForwardRefRenderFunction,
  HTMLAttributes,
  PropsWithChildren,
} from "react";

import styles from "./badge.module.css";

type BadgeProps = PropsWithChildren<VariantProps<typeof badge>> &
  HTMLAttributes<HTMLElement>;

const badge = cva(styles.badge, {
  variants: {
    color: {},
  },
});

const Badge: ForwardRefRenderFunction<unknown, BadgeProps> = (props, ref) => {
  const { color, className, children } = props;

  return <span className={badge({ color, className })}>{children}</span>;
};

export default React.forwardRef<unknown, BadgeProps>(Badge);
