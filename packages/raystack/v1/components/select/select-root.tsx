import { ComboboxProvider } from '@ariakit/react';
import * as SelectPrimitive from '@radix-ui/react-select';
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useRef,
  useState
} from 'react';

// type IconType = Record<string, { icon: ReactNode; children: ReactNode }>;
type ItemType = { leadingIcon?: ReactNode; children: ReactNode; value: string };

type ValueType = {
  value?: string;
  item?: ItemType;
};

interface CommonProps {
  autocomplete?: boolean;
  autocompleteMode?: 'auto' | 'manual';
  searchValue?: string;
  onSearch?: (value: string) => void;
  defaultSearchValue?: string;
}

interface SelectContextValue extends CommonProps {
  value: ValueType;
  // registerIcon: (value: string, icon: ReactNode, children: ReactNode) => void;
  registerItem: (item: ItemType) => void;
  unregisterItem: (value: string) => void;
  // unregisterIcon: (value: string) => void;
}

interface UseSelectContext extends SelectContextValue {
  shouldFilter?: boolean;
}

/*
Root context to manage the Select control
@remarks Only for internal usage.
*/
const SelectContext = createContext<SelectContextValue | undefined>(undefined);

export const useSelectContext = (): UseSelectContext => {
  const context = useContext(SelectContext);
  if (!context) {
    throw new Error('useSelectContext must be used within a SelectProvider');
  }
  const shouldFilter = !!(
    context?.autocomplete &&
    context?.autocompleteMode === 'auto' &&
    context?.searchValue?.length
  );
  return {
    ...context,
    shouldFilter
  };
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

export type SelectRootProps = Omit<BaseSelectRootProps, 'autoComplete'> & {
  htmlAutoComplete?: string;
};

export const SelectRoot = ({
  children,
  value,
  onValueChange,
  defaultValue,
  autocomplete,
  autocompleteMode = 'auto',
  searchValue: providedSearchValue,
  onSearch,
  defaultSearchValue = '',
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  htmlAutoComplete,
  ...props
}: SelectRootProps) => {
  const [internalValue, setInternalValue] = useState<string | undefined>(
    defaultValue
  );
  const [internalSearchValue, setInternalSearchValue] =
    useState(defaultSearchValue);
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  // const [items, setItems] = useState<Record<string, ItemType>>({});
  /*
   * icons ref needs to be reactive for inital render when value or defaultValue is set
   */
  // const icons = useRef<IconType>({});
  const items = useRef<Record<string, ItemType>>({});

  const computedValue = value ?? internalValue;
  // const icon = computedValue ? icons.current?.[computedValue] : undefined;
  const searchValue = providedSearchValue ?? internalSearchValue;
  const open = controlledOpen ?? internalOpen;

  const itemValue = computedValue ? items.current[computedValue] : undefined;

  const setValue = useCallback(
    (_value: string) => {
      onValueChange?.(_value);
      setInternalValue(_value);
    },
    [onValueChange]
  );

  const setSearchValue = useCallback(
    (value: string) => {
      setInternalSearchValue(value);
      onSearch?.(value);
    },
    [onSearch]
  );

  const handleOpenChange = useCallback(
    (value: boolean) => {
      setInternalOpen(value);
      onOpenChange?.(value);
    },
    [onOpenChange]
  );

  // const registerIcon = useCallback<SelectContextValue['registerIcon']>(
  //   (value, icon, children) => {
  //     icons.current = { ...icons.current, [value]: { icon, children } };
  //   },
  //   []
  // );
  // const unregisterIcon = useCallback<SelectContextValue['unregisterIcon']>(
  //   value => {
  //     const { [value]: _, ...rest } = icons.current;
  //     icons.current = rest;
  //   },
  //   []
  // );
  const registerItem = useCallback<SelectContextValue['registerItem']>(item => {
    items.current = { ...items.current, [item.value]: item };
  }, []);
  const unregisterItem = useCallback<SelectContextValue['unregisterItem']>(
    value => {
      const { [value]: _, ...rest } = items.current;
      items.current = rest;
    },
    []
  );

  const element = (
    <ComboboxProvider
      resetValueOnHide
      focusLoop={false}
      includesBaseElement={false}
      value={searchValue}
      setValue={setSearchValue}
      open={open}
      setOpen={handleOpenChange}
    >
      {children}
    </ComboboxProvider>
  );

  return (
    <SelectContext.Provider
      value={{
        // registerIcon,
        // unregisterIcon,
        // value: { value: computedValue, icon },
        value: { value: computedValue, item: itemValue },
        registerItem,
        unregisterItem,
        autocomplete,
        autocompleteMode,
        searchValue
      }}
    >
      <SelectPrimitive.Root
        autoComplete={htmlAutoComplete}
        value={computedValue}
        onValueChange={setValue}
        open={open}
        onOpenChange={handleOpenChange}
        {...props}
      >
        {autocomplete ? element : children}
      </SelectPrimitive.Root>
    </SelectContext.Provider>
  );
};
