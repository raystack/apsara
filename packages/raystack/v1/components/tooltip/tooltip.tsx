import React, { ComponentRef } from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cva, VariantProps } from "class-variance-authority";
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
  'aria-label'?: string;
  asChild?: boolean;
}

export const Tooltip = ({ children, message, delayDuration = 700, skipDelayDuration, disabled, asChild, 'aria-label': ariaLabel, side, className, ref, ...props }: TooltipProps & { ref?: React.Ref<ComponentRef<typeof TooltipPrimitive.Root>> }) => {
  return disabled ? (
    children
  ) : (
    <TooltipPrimitive.Provider delayDuration={delayDuration} skipDelayDuration={skipDelayDuration}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild={asChild}>
          <div 
            className={styles.trigger}
            aria-describedby="tooltip"
          >
            {children}
          </div>
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            id="tooltip"
            role="tooltip"
            aria-label={ariaLabel || (typeof message === 'string' ? message : undefined)}
            side={side?.split('-')[0] as TooltipPrimitive.TooltipContentProps['side'] || 'top'}
            align={(side?.includes('-') ? (side.split('-')[1] === 'left' ? 'start' : 'end') : 'center') satisfies 'start' | 'end' | 'center'}
            sideOffset={4}
            className={tooltip({ side, className })}
          >
            {typeof message === "string" ? (
              <Text>{message}</Text>
            ) : (
              message
            )}
            <TooltipPrimitive.Arrow className={styles.arrow} width={12} height={6} />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
};

Tooltip.displayName = 'Tooltip';
