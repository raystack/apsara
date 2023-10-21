import { cva, VariantProps } from "class-variance-authority";
import { InputHTMLAttributes, PropsWithChildren } from "react";
import { Flex } from "../flex";
import { Label } from "../label";
import styles from "./inputfield.module.css";

const inputfield = cva(styles.inputfield, {
  variants: {
    size: {
      small: styles["inputfield-sm"],
      medium: styles["inputfield-md"],
    },

    state: {
      invalid: styles["inputfield-invalid"],
      valid: styles["inputfield-valid"],
    },
  },
  defaultVariants: {
    size: "small",
  },
});

type InputFieldProps = PropsWithChildren<VariantProps<typeof inputfield>> &
  InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    children?: React.ReactNode;
  };

export const InputField = ({ label, children, ...props }: InputFieldProps) => {
  return (
    <Flex direction="column" gap="extra-small" {...props}>
      {label && <Label className={styles.bold}>{label}</Label>}
      {children}
    </Flex>
  );
};

InputField.displayName = "InputField";
