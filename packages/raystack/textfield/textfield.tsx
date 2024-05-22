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
    hasTailingElement: {
      true: styles["textfield-tailing"],
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
    tailing?: React.ReactElement;
  };

export const TextField = forwardRef<HTMLInputElement, TextfieldProps>(
  ({ leading, tailing, className, src, size, state, style, ...props }, ref) => {
    const hasLeadingElement = Boolean(leading);
    const hasTailingElement = Boolean(tailing);

    return (
      <Flex align="center" style={{ position: "relative", width: "100%" }}>
        {hasLeadingElement ? (
          <Flex style={{ position: "absolute", left: "8px" }}>{leading}</Flex>
        ) : null}
        <input
          className={cx(
            textfield({
              size,
              state,
              className,
              hasLeadingElement,
              hasTailingElement,
            })
          )}
          {...props}
          ref={ref}
        />
        {hasTailingElement ? (
          <Flex style={{ position: "absolute", right: "8px" }}>{tailing}</Flex>
        ) : null}
      </Flex>
    );
  }
);

TextField.displayName = "TextField";
