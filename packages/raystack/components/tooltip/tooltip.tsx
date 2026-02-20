import { Tooltip as TooltipPrimitive } from '@base-ui/react';
import { TooltipContent } from './tooltip-content';
import { TooltipProvider, TooltipTrigger } from './tooltip-misc';

export const Tooltip = Object.assign(TooltipPrimitive.Root, {
  Provider: TooltipProvider,
  Trigger: TooltipTrigger,
  Content: TooltipContent
});
