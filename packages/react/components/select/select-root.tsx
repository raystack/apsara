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
import { useFieldContext } from '../field';
import { SelectItems } from './types';

interface CommonProps {
  autocomplete?: boolean;
  autocompleteMode?: 'auto' | 'manual';
  searchValue?: string;
  onSearch?: (value: string) => void;
  defaultSearchValue?: string;
}

interface SelectContextValue extends CommonProps {
  value?: string | string[];
  multiple: boolean;
  hasItems: boolean;
  getLabel: (value: string) => ReactNode;
}

interface UseSelectContext extends SelectContextValue {
  shouldFilter?: boolean;
}

/*
Root context to manage the Select control
@remarks Only for internal usage.
*/
const SelectContext = createContext<SelectContextValue | undefined>(undefined);

/** Values that match the search in autocomplete mode with `items`. */
const FilteredValuesContext = createContext<Set<string> | null>(null);

export const useFilteredValues = () => useContext(FilteredValuesContext);

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

function FilteredValuesProvider({ children }: { children: ReactNode }) {
  const filteredItems = ComboboxPrimitive.useFilteredItems<string>();
  const filteredValues = useMemo(() => new Set(filteredItems), [filteredItems]);
  return (
    <FilteredValuesContext value={filteredValues}>
      {children}
    </FilteredValuesContext>
  );
}

const toLabelMap = (items?: SelectItems) => {
  const map = new Map<string, ReactNode>();
  if (!items) return map;
  if (Array.isArray(items)) {
    for (const item of items) map.set(item.value, item.label);
  } else {
    for (const [value, label] of Object.entries(items)) map.set(value, label);
  }
  return map;
};

export interface BaseSelectProps extends CommonProps {
  children?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  /**
   * Labels for each value, as `{ value, label }[]` or a value-to-label record.
   * `Select.Value` uses them to show the label of the selected value.
   */
  items?: SelectItems;
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
    items,
    ...rest
  } = props;

  const fieldContext = useFieldContext();
  const resolvedRequired = required ?? fieldContext?.required;

  const [internalValue, setInternalValue] = useState<
    string | string[] | undefined
  >(defaultValue);
  const [internalSearchValue, setInternalSearchValue] =
    useState(defaultSearchValue);

  const computedValue = providedValue ?? internalValue;
  const searchValue = providedSearchValue ?? internalSearchValue;
  const hasItems = !!items;

  const labels = useMemo(() => toLabelMap(items), [items]);
  const itemValues = useMemo(() => Array.from(labels.keys()), [labels]);

  const getLabel = useCallback(
    (value: string) => (labels.has(value) ? labels.get(value) : value),
    [labels]
  );

  const itemToStringLabel = useCallback(
    (value: string) => {
      const label = labels.get(value);
      return typeof label === 'string' || typeof label === 'number'
        ? String(label)
        : value;
    },
    [labels]
  );

  const handleValueChange = useCallback(
    (value: string | string[] | null) => {
      setInternalValue(value ?? undefined);
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
    (value: string) => {
      setInternalSearchValue(value);
      onSearch?.(value);
    },
    [onSearch]
  );

  const handleOpenChange = useCallback(
    (open: boolean) => {
      onOpenChange?.(open);
    },
    [onOpenChange]
  );

  const contextValue = useMemo(
    () => ({
      value: computedValue,
      autocomplete,
      autocompleteMode,
      searchValue,
      multiple,
      hasItems,
      getLabel
    }),
    [
      computedValue,
      autocomplete,
      autocompleteMode,
      searchValue,
      multiple,
      hasItems,
      getLabel
    ]
  );

  const commonProps = {
    value: providedValue,
    defaultValue,
    onValueChange: handleValueChange,
    open: providedOpen,
    defaultOpen,
    onOpenChange: handleOpenChange,
    multiple,
    disabled,
    modal: true as const,
    ...rest,
    required: resolvedRequired,
    name
  };

  if (autocomplete) {
    const filterByLabel = hasItems && autocompleteMode === 'auto';
    return (
      <SelectContext value={contextValue}>
        <ComboboxPrimitive.Root<string, boolean>
          {...commonProps}
          onInputValueChange={handleSearchValueChange}
          filter={filterByLabel ? undefined : null}
          items={hasItems ? itemValues : undefined}
          itemToStringLabel={itemToStringLabel}
          loopFocus={false}
          // @ts-ignore @base-ui/react@1.3.0 ComboboxRootProps types `autoHighlight` as `boolean | undefined`, but the runtime accepts `always | input-change`. Remove when upstream types are corrected.
          autoHighlight='always'
        >
          {filterByLabel ? (
            <FilteredValuesProvider>{children}</FilteredValuesProvider>
          ) : (
            children
          )}
        </ComboboxPrimitive.Root>
      </SelectContext>
    );
  }

  return (
    <SelectContext value={contextValue}>
      <SelectPrimitive.Root<string, boolean> {...commonProps} items={items}>
        {children}
      </SelectPrimitive.Root>
    </SelectContext>
  );
};

SelectRoot.displayName = 'Select';
