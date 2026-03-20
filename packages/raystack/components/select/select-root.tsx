'use client';

import {
  Combobox as ComboboxPrimitive,
  Select as SelectPrimitive
} from '@base-ui/react';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState
} from 'react';
import { ItemType } from './types';

interface CommonProps {
  autocomplete?: boolean;
  autocompleteMode?: 'auto' | 'manual';
  searchValue?: string;
  onSearch?: (value: string) => void;
  defaultSearchValue?: string;
}

interface SelectContextValue extends CommonProps {
  value?: string | string[];
  registerItem: (item: ItemType) => void;
  unregisterItem: (value: string) => void;
  multiple: boolean;
  items: Record<string, ItemType>;
  hasItems?: boolean;
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

interface BaseSelectProps extends CommonProps {
  children?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  items?: string[];
}

export interface SingleSelectProps extends BaseSelectProps {
  multiple?: false;
  value?: string;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
}

export interface MultipleSelectProps extends BaseSelectProps {
  multiple: true;
  value?: string[];
  onValueChange?: (value: string[]) => void;
  defaultValue?: string[];
}

export type SelectRootProps = SingleSelectProps | MultipleSelectProps;

export const SelectRoot = (props: SelectRootProps) => {
  const {
    children,
    value: providedValue,
    onValueChange,
    defaultValue,
    autocomplete,
    autocompleteMode = 'auto',
    searchValue: providedSearchValue,
    onSearch,
    defaultSearchValue = '',
    open: providedOpen,
    defaultOpen = false,
    onOpenChange,
    multiple = false,
    disabled,
    required,
    name,
    items: itemsProp,
    ...rest
  } = props;

  const [internalValue, setInternalValue] = useState<
    string | string[] | undefined
  >(defaultValue);
  const [internalSearchValue, setInternalSearchValue] =
    useState(defaultSearchValue);
  const [registeredItems, setRegisteredItems] = useState<
    SelectContextValue['items']
  >({});

  const computedValue = providedValue ?? internalValue;
  const searchValue = providedSearchValue ?? internalSearchValue;

  const handleValueChange = useCallback(
    (value: any, _eventDetails?: any) => {
      setInternalValue(value);
      if (multiple) {
        (onValueChange as MultipleSelectProps['onValueChange'])?.(
          value as string[]
        );
      } else {
        (onValueChange as SingleSelectProps['onValueChange'])?.(
          value as string
        );
      }
    },
    [multiple, onValueChange]
  );

  const handleSearchValueChange = useCallback(
    (value: string, _eventDetails?: any) => {
      setInternalSearchValue(value);
      onSearch?.(value);
    },
    [onSearch]
  );

  const handleOpenChange = useCallback(
    (open: boolean, _eventDetails?: any) => {
      onOpenChange?.(open);
    },
    [onOpenChange]
  );

  const registerItem = useCallback<SelectContextValue['registerItem']>(item => {
    setRegisteredItems(prev => ({ ...prev, [item.value]: item }));
  }, []);

  const unregisterItem = useCallback<SelectContextValue['unregisterItem']>(
    value => {
      setRegisteredItems(prev => {
        const { [value]: _, ...rest } = prev;
        return rest;
      });
    },
    []
  );

  const contextValue = useMemo(
    () => ({
      value: computedValue,
      registerItem,
      unregisterItem,
      autocomplete,
      autocompleteMode,
      searchValue,
      multiple,
      items: registeredItems,
      hasItems: !!itemsProp
    }),
    [
      computedValue,
      registerItem,
      unregisterItem,
      autocomplete,
      autocompleteMode,
      searchValue,
      multiple,
      registeredItems,
      itemsProp
    ]
  );

  const commonProps = {
    value: providedValue as any,
    defaultValue: defaultValue as any,
    onValueChange: handleValueChange,
    open: providedOpen,
    defaultOpen,
    onOpenChange: handleOpenChange,
    multiple: multiple as any,
    disabled,
    modal: true as const,
    ...rest
  };

  if (autocomplete) {
    return (
      <SelectContext.Provider value={contextValue}>
        <ComboboxPrimitive.Root
          {...commonProps}
          onInputValueChange={handleSearchValueChange}
          filter={itemsProp ? undefined : null}
          items={itemsProp}
          loopFocus={false}
          // @ts-ignore BaseUI types are not up to date
          autoHighlight='always'
        >
          {children}
        </ComboboxPrimitive.Root>
      </SelectContext.Provider>
    );
  }

  return (
    <SelectContext.Provider value={contextValue}>
      <SelectPrimitive.Root {...commonProps} required={required} name={name}>
        {children}
      </SelectPrimitive.Root>
    </SelectContext.Provider>
  );
};
