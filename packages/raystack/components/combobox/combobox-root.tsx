'use client';

import { ComboboxProvider } from '@ariakit/react';
import { Popover as PopoverPrimitive } from 'radix-ui';
import {
  createContext,
  ReactNode,
  RefObject,
  useCallback,
  useContext,
  useRef,
  useState
} from 'react';
import { ComboboxItemType } from './types';

interface ComboboxContextValue {
  value?: string;
  onValueChange?: (value: string) => void;
  searchValue: string;
  onSearch?: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  inputRef: RefObject<HTMLInputElement | null>;
  listRef: RefObject<HTMLDivElement | null>;
  registerItem: (item: ComboboxItemType) => void;
  unregisterItem: (value: string) => void;
  items: Record<string, ComboboxItemType>;
}

const ComboboxContext = createContext<ComboboxContextValue | undefined>(
  undefined
);

export const useComboboxContext = (): ComboboxContextValue => {
  const context = useContext(ComboboxContext);
  if (!context) {
    throw new Error(
      'useComboboxContext must be used within a ComboboxProvider'
    );
  }
  return context;
};

export interface ComboboxRootProps {
  children: ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
  searchValue?: string;
  onSearch?: (value: string) => void;
  defaultSearchValue?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: boolean;
}

export const ComboboxRoot = (props: ComboboxRootProps) => {
  const {
    children,
    value,
    onValueChange,
    searchValue: providedSearchValue,
    onSearch,
    defaultSearchValue = '',
    open: providedOpen,
    defaultOpen = false,
    onOpenChange,
    modal = false
  } = props;

  const [internalSearchValue, setInternalSearchValue] =
    useState(defaultSearchValue);
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [items, setItems] = useState<ComboboxContextValue['items']>({});

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const searchValue = providedSearchValue ?? internalSearchValue;
  const open = providedOpen ?? internalOpen;

  const setSearchValue = useCallback(
    (newValue: string) => {
      setInternalSearchValue(newValue);
      onSearch?.(newValue);
    },
    [onSearch]
  );

  const setOpen = useCallback(
    (newOpen: boolean) => {
      setInternalOpen(newOpen);
      onOpenChange?.(newOpen);
    },
    [onOpenChange]
  );

  const registerItem = useCallback<ComboboxContextValue['registerItem']>(
    item => {
      setItems(prev => ({ ...prev, [item.value]: item }));
    },
    []
  );

  const unregisterItem = useCallback<ComboboxContextValue['unregisterItem']>(
    itemValue => {
      setItems(prev => {
        const { [itemValue]: _, ...rest } = prev;
        return rest;
      });
    },
    []
  );

  return (
    <ComboboxContext.Provider
      value={{
        value,
        onValueChange,
        searchValue,
        onSearch,
        open,
        setOpen,
        inputRef,
        listRef,
        registerItem,
        unregisterItem,
        items
      }}
    >
      <PopoverPrimitive.Root open={open} onOpenChange={setOpen} modal={modal}>
        <ComboboxProvider
          open={open}
          setOpen={setOpen}
          value={searchValue}
          setValue={setSearchValue}
          resetValueOnHide
        >
          {children}
        </ComboboxProvider>
      </PopoverPrimitive.Root>
    </ComboboxContext.Provider>
  );
};
