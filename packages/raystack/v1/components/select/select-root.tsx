import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";

import * as SelectPrimitive from "@radix-ui/react-select";

type IconType = Record<string, ReactNode>;
type ValueType = {
  value?: string;
  icon?: ReactNode;
};
type SelectContextValue = {
  value: ValueType;
  registerIcon: (value: string, icon: ReactNode) => void;
  unregisterIcon: (value: string) => void;
};

/*
Root context to manage the Select control
@remarks Only for internal usage.
*/
const SelectContext = createContext<SelectContextValue | undefined>(undefined);

export const useSelectContext = () => {
  const context = useContext(SelectContext);
  if (!context) {
    throw new Error("useSelectContext must be used within a SelectProvider");
  }
  return context;
};

export const SelectRoot = ({
  children,
  value,
  onValueChange,
  defaultValue,
  ...props
}: SelectPrimitive.SelectProps) => {
  const [internalValue, setInternalValue] = useState<string | undefined>(
    defaultValue,
  );
  const icons = useRef<IconType>({});

  const computedValue = value ?? internalValue;
  const icon = computedValue && icons.current?.[computedValue];

  const setValue = (_value: string) => {
    onValueChange?.(_value);
    setInternalValue(_value);
  };

  const registerIcon = useCallback<SelectContextValue["registerIcon"]>(
    (value, icon) => {
      icons.current = { ...icons.current, [value]: icon };
    },
    [],
  );
  const unregisterIcon = useCallback<SelectContextValue["unregisterIcon"]>(
    value => {
      const { [value]: _, ...rest } = icons.current;
      icons.current = rest;
    },
    [],
  );

  return (
    <SelectContext.Provider
      value={{
        registerIcon,
        unregisterIcon,
        value: { value: computedValue, icon },
      }}>
      <SelectPrimitive.Root
        value={computedValue}
        onValueChange={setValue}
        {...props}>
        {children}
      </SelectPrimitive.Root>
    </SelectContext.Provider>
  );
};
