'use client';

import { ComboboxProvider, ComboboxProviderProps } from '@ariakit/react';
import { Popover as PopoverPrimitive } from 'radix-ui';
import {
  createContext,
  RefObject,
  useCallback,
  useContext,
  useRef,
  useState
} from 'react';

interface ComboboxContextValue {
  setValue: (value: string | string[]) => void;
  value?: string | string[];
  inputValue?: string;
  setInputValue: (inputValue: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  inputRef: RefObject<HTMLInputElement | null>;
  multiple: boolean;
  listRef: RefObject<HTMLDivElement | null>;
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
export interface BaseComboboxRootProps
  extends Omit<
    ComboboxProviderProps,
    | 'value'
    | 'setValue'
    | 'selectedValue'
    | 'setSelectedValue'
    | 'defaultSelectedValue'
    | 'defaultValue'
    | 'resetValueOnHide'
    | 'resetValueOnSelect'
  > {
  onOpenChange?: (open: boolean) => void;
  modal?: boolean;
  inputValue?: string;
  onInputValueChange?: (inputValue: string) => void;
  defaultInputValue?: string;
}
export interface SingleComboboxProps extends BaseComboboxRootProps {
  multiple?: false;
  value?: string;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
}
export interface MultipleComboboxProps extends BaseComboboxRootProps {
  multiple: true;
  value?: string[];
  onValueChange?: (value: string[]) => void;
  defaultValue?: string[];
}
export type ComboboxRootProps = SingleComboboxProps | MultipleComboboxProps;

export const ComboboxRoot = ({
  modal = false,
  multiple = false,
  children,
  value: providedValue,
  defaultValue = multiple ? [] : undefined,
  onValueChange,
  inputValue: providedInputValue,
  onInputValueChange,
  defaultInputValue,
  open: providedOpen,
  defaultOpen = false,
  onOpenChange,
  ...props
}: ComboboxRootProps) => {
  const [internalValue, setInternalValue] = useState<
    string | string[] | undefined
  >(defaultValue);
  const [internalInputValue, setInternalInputValue] =
    useState(defaultInputValue);
  const [internalOpen, setInternalOpen] = useState(defaultOpen);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const value = providedValue ?? internalValue;
  const inputValue = providedInputValue ?? internalInputValue;
  const open = providedOpen ?? internalOpen;

  const setValue = useCallback(
    (newValue: string | string[] | undefined) => {
      if (multiple) {
        const formattedValue = newValue
          ? Array.isArray(newValue)
            ? newValue
            : [newValue]
          : [];
        setInternalValue(formattedValue);
        (onValueChange as MultipleComboboxProps['onValueChange'])?.(
          formattedValue
        );
      } else {
        setInternalValue(String(newValue));
        (onValueChange as SingleComboboxProps['onValueChange'])?.(
          String(newValue)
        );
      }
    },
    [onValueChange, multiple]
  );

  const setInputValue = useCallback(
    (newValue: string) => {
      if (!multiple && newValue.length === 0) setValue('');
      setInternalInputValue(newValue);
      onInputValueChange?.(newValue);
    },
    [onInputValueChange, setValue, multiple]
  );

  const setOpen = useCallback(
    (newOpen: boolean) => {
      setInternalOpen(newOpen);
      onOpenChange?.(newOpen);
    },
    [onOpenChange]
  );

  return (
    <ComboboxContext.Provider
      value={{
        setValue,
        value,
        inputValue,
        setInputValue,
        open,
        setOpen,
        inputRef,
        multiple,
        listRef
      }}
    >
      <PopoverPrimitive.Root open={open} onOpenChange={setOpen} modal={modal}>
        <ComboboxProvider
          open={open}
          setOpen={setOpen}
          value={inputValue}
          setValue={setInputValue}
          selectedValue={value}
          setSelectedValue={setValue}
          focusLoop={false}
          includesBaseElement={false}
          resetValueOnHide={multiple}
          resetValueOnSelect={multiple}
          {...props}
        >
          {children}
        </ComboboxProvider>
      </PopoverPrimitive.Root>
    </ComboboxContext.Provider>
  );
};
