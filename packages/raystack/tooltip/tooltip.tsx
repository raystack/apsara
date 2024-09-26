import React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { Text } from "../text";
import styles from "./tooltip.module.css";
import clsx from "clsx";

type classes = {
  content?: string;
  trigger?: string;
};
interface TooltipProps {
  disabled?: boolean;
  children: React.ReactNode;
  message: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  classes?: classes;
}

export const Tooltip = ({
  children,
  message,
  disabled,
  side = "right",
  classes,
}: TooltipProps) => {
  return disabled ? (
    children
  ) : (
    <TooltipPrimitive.Provider>
      <TooltipPrimitive.Root disableHoverableContent={false}>
        <TooltipPrimitive.Trigger asChild>
          <div className={clsx(styles.trigger, classes?.trigger)}>
            {children}
          </div>
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={side}
            sideOffset={5}
            className={clsx(styles.content, classes?.content)}
          >
            {typeof message === "string" ? <Text>{message}</Text> : message}
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
};
