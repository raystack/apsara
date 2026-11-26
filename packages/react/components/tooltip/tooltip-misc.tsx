'use client';

import { Tooltip as TooltipPrimitive } from '@base-ui/react';

export interface TooltipTriggerProps extends TooltipPrimitive.Trigger.Props {
  /**
   * How long to wait before opening the tooltip on hover. Specified in milliseconds.
   * @default 200
   */
  delay?: number;
}

export function TooltipTrigger(props: TooltipTriggerProps) {
  return (
    <TooltipPrimitive.Trigger
      delay={200}
      data-slot='tooltip-trigger'
      {...props}
    />
  );
}

TooltipTrigger.displayName = 'Tooltip.Trigger';

interface TooltipProviderProps extends TooltipPrimitive.Provider.Props {
  /**
   * How long to wait before opening a tooltip. Specified in milliseconds.
   * @default 200
   */
  delay?: number;
}

export const TooltipProvider = (props: TooltipProviderProps) => {
  return <TooltipPrimitive.Provider delay={200} {...props} />;
};

TooltipProvider.displayName = 'Tooltip.Provider';
