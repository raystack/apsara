import { cva, VariantProps } from "class-variance-authority";
import { InputHTMLAttributes, PropsWithChildren } from "react";
import styles from "./textfield.module.css";

const textfield = cva(styles.textfield, {
  variants: {
    size: {
      small: styles["textfield-sm"],
      medium: styles["textfield-md"],
    },

    state: {
      invalid: styles["textfield-invalid"],
      valid: styles["textfield-valid"],
    },
  },
  defaultVariants: {
    size: "small",
  },
});

type TextfieldProps = PropsWithChildren<VariantProps<typeof textfield>> &
  InputHTMLAttributes<HTMLInputElement>;

export const TextField = ({
  className,
  src,
  size,
  state,
  style,
  ...props
}: TextfieldProps) => {
  return <input className={textfield({ size, state, className })} {...props} />;
};

TextField.displayName = "TextField";
