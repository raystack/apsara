import { cva, cx, VariantProps } from "class-variance-authority";
import { InputHTMLAttributes, PropsWithChildren, forwardRef } from "react";
import { Flex } from "../flex";
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

    leading: {
      true: styles["textfield-leading"],
    },
  },
  defaultVariants: {
    size: "small",
  },
});

type TextfieldProps = PropsWithChildren<VariantProps<typeof textfield>> &
  InputHTMLAttributes<HTMLInputElement> & {
    leading?: React.ReactElement;
  };

export const TextField = forwardRef<HTMLInputElement, TextfieldProps>(
  ({ leading, className, src, size, state, style, ...props }, ref) => {
    return (
      <Flex align="center" style={{ position: "relative", width: "100%" }}>
        {leading ? (
          <Flex style={{ position: "absolute", left: "8px" }}>{leading}</Flex>
        ) : null}
        <input
          className={cx(textfield({ size, state, className, leading }))}
          style={leading ? { paddingLeft: "32px" } : {}}
          {...props}
          ref={ref}
        />
      </Flex>
    );
  }
);

TextField.displayName = "TextField";
