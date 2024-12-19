import React from "react";
import { cva, VariantProps } from "class-variance-authority";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { Text } from "../text";
import styles from "./tooltip.module.css";

const tooltip = cva(styles.content, {
  variants: {
    side: {
      top: styles["side-top"],
      right: styles["side-right"],
      bottom: styles["side-bottom"],
      left: styles["side-left"],
      "top-left": styles["side-top-left"],
      "top-right": styles["side-top-right"],
      "bottom-left": styles["side-bottom-left"],
      "bottom-right": styles["side-bottom-right"],
    }
  },
  defaultVariants: {
    side: "top"
  }
});

interface TooltipProps extends VariantProps<typeof tooltip> {
  disabled?: boolean;
  children: React.ReactNode;
  message: React.ReactNode;
  className?: string;
  delayDuration?: number;
  skipDelayDuration?: number;
}

export const Tooltip = ({
  children,
  message,
  disabled,
  side = "top",
  className,
  delayDuration = 200,
  skipDelayDuration = 200,
}: TooltipProps) => {
  return disabled ? (
    children
  ) : (
    <TooltipPrimitive.Provider delayDuration={delayDuration} skipDelayDuration={skipDelayDuration}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>
          <div className={styles.trigger}>
            {children}
          </div>
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={side.split('-')[0] as TooltipPrimitive.TooltipContentProps['side']}
            align={side.includes('-') ? side.split('-')[1] : undefined}
            sideOffset={4}
            className={tooltip({ side, className })}
          >
            {typeof message === "string" ? (
              <Text size="small">{message}</Text>
            ) : (
              message
            )}
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
};
