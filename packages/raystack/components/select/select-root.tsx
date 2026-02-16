'use client';

import {
  Combobox as ComboboxPrimitive,
  Select as SelectPrimitive
} from '@base-ui/react';
import {
  createContext,
  RefObject,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState
} from 'react';
import { ItemType } from './types';

type SelectMode = 'select' | 'combobox';

interface SelectContextValue {
  mode: SelectMode;
  multiple: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
  inputValue: string;
  hasItems: boolean;
  items: Record<string, ItemType>;
  triggerRef: RefObject<HTMLElement | null>;
  registerItem: (item: ItemType) => void;
  unregisterItem: (value: string) => void;
  shouldFilter: boolean;
}

const SelectContext = createContext<SelectContextValue | undefined>(undefined);

export const useSelectContext = (): SelectContextValue => {
  const context = useContext(SelectContext);
  if (!context) {
    throw new Error('useSelectContext must be used within a SelectProvider');
  }
  return context;
};

// Conditional type: single mode returns Value, multiple mode returns Value[]
type SelectValueType<
  Value,
  Multiple extends boolean | undefined
> = Multiple extends true ? Value[] : Value;

export type SelectRootProps<
  Value = any, // eslint-disable-line @typescript-eslint/no-explicit-any
  Multiple extends boolean | undefined = false
> = {
  children?: React.ReactNode;
  multiple?: Multiple;
  value?: SelectValueType<Value, Multiple> | null;
  defaultValue?: SelectValueType<Value, Multiple> | null;
  onValueChange?: (value: SelectValueType<Value, Multiple>) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  items?: Value[];
  autocomplete?: boolean;
  autocompleteMode?: 'auto' | 'manual';
  searchValue?: string;
  onSearch?: (value: string) => void;
  defaultSearchValue?: string;
};

export function SelectRoot<
  Value = any, // eslint-disable-line @typescript-eslint/no-explicit-any
  Multiple extends boolean | undefined = false
>(props: SelectRootProps<Value, Multiple>) {
  const {
    children,
    value: providedValue,
    onValueChange,
    defaultValue,
    autocomplete = false,
    autocompleteMode = 'auto',
    searchValue: providedSearchValue,
    onSearch,
    defaultSearchValue = '',
    open: providedOpen,
    defaultOpen,
    onOpenChange,
    multiple = false as Multiple,
    items: itemsProp,
    disabled,
    required,
    name,
    ...rest
  } = props;

  const [internalValue, setInternalValue] = useState<any>(defaultValue ?? null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [internalSearchValue, setInternalSearchValue] =
    useState(defaultSearchValue);
  const [registeredItems, setRegisteredItems] = useState<
    Record<string, ItemType>
  >({});
  const triggerRef = useRef<HTMLElement>(null);

  const computedValue = providedValue ?? internalValue;
  const searchValue = providedSearchValue ?? internalSearchValue;
  const mode: SelectMode = autocomplete ? 'combobox' : 'select';

  const handleInputValueChange = useCallback(
    (
      value: string,
      _eventDetails: ComboboxPrimitive.Root.ChangeEventDetails
    ) => {
      setInternalSearchValue(value);
      onSearch?.(value);
    },
    [onSearch]
  );

  const handleSelectValueChange = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (value: any) => {
      setInternalValue(value);
      onValueChange?.(value);
    },
    [onValueChange]
  );

  const handleComboboxValueChange = useCallback(
    (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      value: any,
      _eventDetails: ComboboxPrimitive.Root.ChangeEventDetails
    ) => {
      setInternalValue(value);
      onValueChange?.(value);
    },
    [onValueChange]
  );

  const handleOpenChange = useCallback(
    (open: boolean) => {
      onOpenChange?.(open);
    },
    [onOpenChange]
  );

  const registerItem = useCallback((item: ItemType) => {
    setRegisteredItems(prev => ({ ...prev, [String(item.value)]: item }));
  }, []);

  const unregisterItem = useCallback((value: string) => {
    setRegisteredItems(prev => {
      const { [value]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  const shouldFilter =
    mode === 'combobox' &&
    autocompleteMode === 'auto' &&
    !itemsProp &&
    searchValue.length > 0;

  const contextValue = useMemo(
    () => ({
      mode,
      multiple: !!multiple,
      value: computedValue,
      inputValue: searchValue,
      hasItems: !!itemsProp,
      items: registeredItems,
      triggerRef,
      registerItem,
      unregisterItem,
      shouldFilter
    }),
    [
      mode,
      multiple,
      computedValue,
      searchValue,
      itemsProp,
      registeredItems,
      registerItem,
      unregisterItem,
      shouldFilter
    ]
  );

  if (mode === 'combobox') {
    return (
      <SelectContext.Provider value={contextValue}>
        <ComboboxPrimitive.Root
          multiple={multiple as boolean}
          onValueChange={handleComboboxValueChange}
          onInputValueChange={handleInputValueChange}
          items={itemsProp}
          value={providedValue as any} // eslint-disable-line @typescript-eslint/no-explicit-any
          defaultValue={defaultValue as any} // eslint-disable-line @typescript-eslint/no-explicit-any
          open={providedOpen}
          defaultOpen={defaultOpen}
          onOpenChange={handleOpenChange}
          modal
          {...rest}
        >
          {children}
        </ComboboxPrimitive.Root>
      </SelectContext.Provider>
    );
  }

  return (
    <SelectContext.Provider value={contextValue}>
      <SelectPrimitive.Root
        multiple={multiple as boolean}
        onValueChange={handleSelectValueChange}
        value={providedValue as any} // eslint-disable-line @typescript-eslint/no-explicit-any
        defaultValue={defaultValue as any} // eslint-disable-line @typescript-eslint/no-explicit-any
        open={providedOpen}
        defaultOpen={defaultOpen}
        onOpenChange={handleOpenChange}
        disabled={disabled}
        required={required}
        name={name}
        {...rest}
      >
        {children}
      </SelectPrimitive.Root>
    </SelectContext.Provider>
  );
}
