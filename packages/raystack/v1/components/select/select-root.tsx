import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { ComboboxProvider } from "@ariakit/react";
import * as SelectPrimitive from "@radix-ui/react-select";

type IconType = Record<string, ReactNode>;
type ValueType = {
  value?: string;
  icon?: ReactNode;
};

interface CommonProps {
  autocomplete?: boolean;
  autocompleteMode?: "auto" | "manual";
  searchValue?: string;
  onSearch?: (value: string) => void;
  defaultSearchValue?: string;
}

interface SelectContextValue extends CommonProps {
  value: ValueType;
  registerIcon: (value: string, icon: ReactNode) => void;
  unregisterIcon: (value: string) => void;
}

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

export interface NormalSelectRootProps extends SelectPrimitive.SelectProps {
  autocomplete?: false;
  autocompleteMode?: never;
  searchValue?: never;
  onSearch?: never;
  defaultSearchValue?: never;
}

export interface AutocompleteSelectRootProps
  extends SelectPrimitive.SelectProps,
    CommonProps {
  autocomplete: true;
}

export type BaseSelectRootProps =
  | NormalSelectRootProps
  | AutocompleteSelectRootProps;

export type SelectRootProps = Omit<BaseSelectRootProps, "autoComplete"> & {
  htmlAutoComplete?: string;
};

export const SelectRoot = ({
  children,
  value,
  onValueChange,
  defaultValue,
  autocomplete,
  autocompleteMode = "auto",
  searchValue: providedSearchValue,
  onSearch,
  defaultSearchValue = "",
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  htmlAutoComplete,
  ...props
}: SelectRootProps) => {
  const [internalValue, setInternalValue] = useState<string | undefined>(
    defaultValue,
  );
  const [internalSearchValue, setInternalSearchValue] =
    useState(defaultSearchValue);
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const icons = useRef<IconType>({});

  const computedValue = value ?? internalValue;
  const icon = computedValue && icons.current?.[computedValue];
  const searchValue = providedSearchValue ?? internalSearchValue;
  const open = controlledOpen ?? internalOpen;

  const setValue = useCallback(
    (_value: string) => {
      onValueChange?.(_value);
      setInternalValue(_value);
    },
    [onValueChange],
  );

  const setSearchValue = useCallback(
    (value: string) => {
      setInternalSearchValue(value);
      onSearch?.(value);
    },
    [onSearch],
  );

  const handleOpenChange = useCallback(
    (value: boolean) => {
      setInternalOpen(value);
      onOpenChange?.(value);
    },
    [onOpenChange],
  );

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

  const element = (
    <ComboboxProvider
      resetValueOnHide
      focusLoop={false}
      includesBaseElement={false}
      value={searchValue}
      setValue={setSearchValue}
      open={open}
      setOpen={handleOpenChange}>
      {children}
    </ComboboxProvider>
  );

  return (
    <SelectContext.Provider
      value={{
        registerIcon,
        unregisterIcon,
        value: { value: computedValue, icon },
        autocomplete,
        autocompleteMode,
        searchValue,
      }}>
      <SelectPrimitive.Root
        autoComplete={htmlAutoComplete}
        value={computedValue}
        onValueChange={setValue}
        open={open}
        onOpenChange={handleOpenChange}
        {...props}>
        {autocomplete ? element : children}
      </SelectPrimitive.Root>
    </SelectContext.Provider>
  );
};
