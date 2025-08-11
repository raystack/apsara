'use client';

import { ComboboxProvider } from '@ariakit/react';
import { Select as SelectPrimitive } from 'radix-ui';
import {
  createContext,
  useCallback,
  useContext,
  useId,
  useMemo,
  useRef,
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
  updateSelectionInProgress: (value: boolean) => void;
  setValue: (value: string) => void;
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

interface NormalSelectRootProps extends SelectPrimitive.SelectProps {
  autocomplete?: false;
  autocompleteMode?: never;
  searchValue?: never;
  onSearch?: never;
  defaultSearchValue?: never;
}

interface AutocompleteSelectRootProps
  extends SelectPrimitive.SelectProps,
    CommonProps {
  autocomplete: true;
}

type BaseSelectProps = Omit<
  NormalSelectRootProps | AutocompleteSelectRootProps,
  'autoComplete' | 'value' | 'onValueChange' | 'defaultValue'
> & {
  htmlAutoComplete?: string;
};

interface SingleSelectProps extends BaseSelectProps {
  multiple?: false;
  value?: string;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
}

interface MultipleSelectProps extends BaseSelectProps {
  multiple: true;
  value?: string[];
  onValueChange?: (value: string[]) => void;
  defaultValue?: string[];
}

export type SelectRootProps = SingleSelectProps | MultipleSelectProps;

const SELECT_INTERNAL_VALUE = 'SELECT_INTERNAL_VALUE';

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
    htmlAutoComplete,
    multiple = false,
    ...rest
  } = props;

  const [internalValue, setInternalValue] = useState<
    string | string[] | undefined
  >(defaultValue);
  const [internalSearchValue, setInternalSearchValue] =
    useState(defaultSearchValue);
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [items, setItems] = useState<SelectContextValue['items']>({});
  const id = useId();
  const isSelectionInProgress = useRef(false);

  const computedValue = providedValue ?? internalValue;
  const searchValue = providedSearchValue ?? internalSearchValue;
  const open = providedOpen ?? internalOpen;

  const updateSelectionInProgress = useCallback((value: boolean) => {
    isSelectionInProgress.current = value;
  }, []);

  const setValue = useCallback(
    (value: string) => {
      /*
       * If the select is placed inside a form, onChange is called with an empty value
       * WORKAROUND FOR ISSUE https://github.com/radix-ui/primitives/issues/3135
       */
      if (value === '') return;

      if (multiple) {
        updateSelectionInProgress(true);
        const set = new Set<string>(
          Array.isArray(computedValue)
            ? computedValue
            : [computedValue ?? ''].filter(Boolean)
        );

        if (set.has(value)) set.delete(value);
        else set.add(value);

        const newValue = Array.from(set);

        setInternalValue(newValue);
        (onValueChange as MultipleSelectProps['onValueChange'])?.(newValue);
      } else {
        setInternalValue(value);
        (onValueChange as SingleSelectProps['onValueChange'])?.(value);
      }
    },
    [multiple, onValueChange, computedValue, updateSelectionInProgress]
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
      if (isSelectionInProgress.current) return;
      setInternalOpen(value);
      onOpenChange?.(value);
    },
    [onOpenChange]
  );

  const registerItem = useCallback<SelectContextValue['registerItem']>(item => {
    setItems(prev => ({ ...prev, [item.value]: item }));
  }, []);

  const unregisterItem = useCallback<SelectContextValue['unregisterItem']>(
    value => {
      setItems(prev => {
        const { [value]: _, ...rest } = prev;
        return rest;
      });
    },
    []
  );

  /*
   * Radix internally shows the placeholder when the value is empty.
   * This value is used to manage the internal value of Radix Select to make it work
   */
  const radixValue = useMemo(() => {
    if (!computedValue) return '';
    if (typeof computedValue === 'string') return computedValue;
    if (Array.isArray(computedValue) && computedValue.length)
      return `${SELECT_INTERNAL_VALUE}-${id}`;
    return String(computedValue) ?? '';
  }, [computedValue, id]);

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
        value: computedValue,
        registerItem,
        unregisterItem,
        autocomplete,
        autocompleteMode,
        searchValue,
        multiple,
        items,
        updateSelectionInProgress,
        setValue
      }}
    >
      <SelectPrimitive.Root
        autoComplete={htmlAutoComplete}
        value={radixValue}
        onValueChange={setValue}
        open={open}
        onOpenChange={handleOpenChange}
        {...rest}
      >
        {autocomplete ? element : children}
      </SelectPrimitive.Root>
    </SelectContext.Provider>
  );
};
