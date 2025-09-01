import { TooltipProvider } from './tooltip-provider';
import { TooltipRoot } from './tooltip-root';

export const Tooltip = Object.assign(TooltipRoot, {
  Provider: TooltipProvider
});
