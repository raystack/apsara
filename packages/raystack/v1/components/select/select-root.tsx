import { ComboboxProvider } from '@ariakit/react';
import * as SelectPrimitive from '@radix-ui/react-select';
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useId,
  useState
} from 'react';

// type IconType = Record<string, { icon: ReactNode; children: ReactNode }>;
type ItemType = { leadingIcon?: ReactNode; children: ReactNode; value: string };

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

export type BaseSelectProps = Omit<
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

  const computedValue = providedValue ?? internalValue;
  const searchValue = providedSearchValue ?? internalSearchValue;
  const open = providedOpen ?? internalOpen;

  const setValue = useCallback(
    (value: string) => {
      console.log('setValue', value);
      if (multiple) {
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
    [multiple, onValueChange, computedValue]
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
        items
      }}
    >
      <SelectPrimitive.Root
        autoComplete={htmlAutoComplete}
        value={computedValue ? `${SELECT_INTERNAL_VALUE}-${id}` : ''}
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
