import { forwardRef, HTMLAttributes } from "react";
import { cx } from "class-variance-authority";
import styles from "./docs-body.module.css";

export const DocsBody = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>((props, ref) => (
  <div ref={ref} {...props} className={cx(styles.content, props.className)}>
    {props.children}
  </div>
));

export default DocsBody;
