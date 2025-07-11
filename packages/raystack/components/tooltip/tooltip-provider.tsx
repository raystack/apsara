import { Tooltip as TooltipPrimitive } from 'radix-ui';
import { createContext, useContext } from 'react';

interface TooltipProviderContextValue
  extends Omit<TooltipPrimitive.TooltipProviderProps, 'children'> {}

const TooltipProviderContext = createContext<
  TooltipProviderContextValue | undefined
>(undefined);

export const useTooltipProvider = () => {
  return useContext(TooltipProviderContext);
};

export interface TooltipProviderProps
  extends TooltipPrimitive.TooltipProviderProps {}

export const TooltipProvider = ({
  delayDuration = 200,
  skipDelayDuration = 200,
  ...props
}: TooltipProviderProps) => {
  return (
    <TooltipProviderContext.Provider
      value={{ delayDuration, skipDelayDuration, ...props }}
    >
      <TooltipPrimitive.Provider
        delayDuration={delayDuration}
        skipDelayDuration={skipDelayDuration}
        {...props}
      />
    </TooltipProviderContext.Provider>
  );
};
