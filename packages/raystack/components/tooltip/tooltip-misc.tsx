'use client';

import { Tooltip as TooltipPrimitive } from '@base-ui/react';

export interface TooltipTriggerProps extends TooltipPrimitive.Trigger.Props {}

export function TooltipTrigger(props: TooltipPrimitive.Trigger.Props) {
  return <TooltipPrimitive.Trigger delay={200} {...props} />;
}

TooltipTrigger.displayName = 'Tooltip.Trigger';

export const TooltipProvider = (props: TooltipPrimitive.Provider.Props) => {
  return <TooltipPrimitive.Provider delay={200} {...props} />;
};

TooltipProvider.displayName = 'Tooltip.Provider';
