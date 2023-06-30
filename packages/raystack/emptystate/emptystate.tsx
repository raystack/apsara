import { cva, VariantProps } from "class-variance-authority";
import { HTMLAttributes, PropsWithChildren } from "react";
import styles from "./emptystate.module.css";

const emptystate = cva(styles.emptystate);

type EmptystateProps = PropsWithChildren<VariantProps<typeof emptystate>> &
  HTMLAttributes<HTMLElement>;

export function EmptyState({ children, className, ...props }: EmptystateProps) {
  return (
    <div className={emptystate({ className })} {...props}>
      {children}
    </div>
  );
}
