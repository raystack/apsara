'use client';

import { Tooltip as TooltipPrimitive } from '@base-ui/react';
import { forwardRef } from 'react';

export interface TooltipTriggerProps extends TooltipPrimitive.Trigger.Props {}

export const TooltipTrigger = forwardRef<
  HTMLButtonElement,
  TooltipPrimitive.Trigger.Props
>((props, ref) => {
  return <TooltipPrimitive.Trigger ref={ref} delay={200} {...props} />;
});

TooltipTrigger.displayName = 'Tooltip.Trigger';

export const TooltipProvider = (props: TooltipPrimitive.Provider.Props) => {
  return <TooltipPrimitive.Provider delay={200} {...props} />;
};

TooltipProvider.displayName = 'Tooltip.Provider';
