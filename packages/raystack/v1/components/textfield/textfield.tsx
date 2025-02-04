import { cva, cx, VariantProps } from "class-variance-authority";
import { forwardRef, InputHTMLAttributes, PropsWithChildren } from "react";

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

    hasLeadingElement: {
      true: styles["textfield-leading"],
    },
    hasTrailingElement: {
      true: styles["textfield-trailing"],
    },
  },
  defaultVariants: {
    size: "small",
  },
});

export type TextfieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size"
> &
  PropsWithChildren<VariantProps<typeof textfield>> & {
    leading?: React.ReactElement;
    trailing?: React.ReactElement;
    iconClass?: { leadingIcon?: string; trailingIcon?: string };
  };

export const TextField = forwardRef<HTMLInputElement, TextfieldProps>(
  (
    {
      leading,
      trailing,
      className,
      src,
      size,
      state,
      style,
      iconClass,
      ...props
    },
    ref
  ) => {
    const hasLeadingElement = Boolean(leading);
    const hasTrailingElement = Boolean(trailing);

    return (
      <Flex align="center" style={{ position: "relative", width: "100%" }}>
        {hasLeadingElement ? (
          <Flex
            style={{ left: "8px" }}
            className={cx(styles.leadingIcon, iconClass?.leadingIcon)}
          >
            {leading}
          </Flex>
        ) : null}

        <input
          className={cx(
            textfield({
              size,
              state,
              className,
              hasLeadingElement,
              hasTrailingElement,
            })
          )}
          {...props}
          ref={ref}
        />

        {hasTrailingElement ? (
          <Flex
            style={{ right: "8px" }}
            className={cx(styles.trailingIcon, iconClass?.trailingIcon)}
          >
            {trailing}
          </Flex>
        ) : null}
      </Flex>
    );
  }
);

TextField.displayName = "TextField";
