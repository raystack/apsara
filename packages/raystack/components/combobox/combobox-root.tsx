'use client';

import { Combobox as ComboboxPrimitive } from '@base-ui/react';
import {
  createContext,
  RefObject,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState
} from 'react';

interface ComboboxContextValue<Value = string> {
  multiple: boolean;
  inputValue: string;
  hasItems: boolean;
  inputContainerRef: RefObject<HTMLDivElement | null>;
  value: Value | Value[] | null | undefined;
  onValueChange?: (value: Value | Value[] | null) => void;
}

const ComboboxContext = createContext<
  ComboboxContextValue<unknown> | undefined
>(undefined);

export const useComboboxContext = <
  Value = string
>(): ComboboxContextValue<Value> => {
  const context = useContext(ComboboxContext);
  if (!context) {
    throw new Error(
      'useComboboxContext must be used within a ComboboxProvider'
    );
  }
  return context as ComboboxContextValue<Value>;
};

export interface BaseComboboxRootProps<Value>
  extends Omit<
    ComboboxPrimitive.Root.Props<Value, boolean>,
    'onValueChange' | 'onInputValueChange' | 'onOpenChange' | 'multiple'
  > {
  onOpenChange?: (open: boolean) => void;
  onInputValueChange?: (inputValue: string) => void;
}

export interface SingleComboboxProps<Value = string>
  extends BaseComboboxRootProps<Value> {
  multiple?: false;
  value?: Value | null;
  defaultValue?: Value | null;
  onValueChange?: (value: Value | null) => void;
}

export interface MultipleComboboxProps<Value = string>
  extends BaseComboboxRootProps<Value> {
  multiple: true;
  value?: Value[];
  defaultValue?: Value[];
  onValueChange?: (value: Value[]) => void;
}

export type ComboboxRootProps<Value = string> =
  | SingleComboboxProps<Value>
  | MultipleComboboxProps<Value>;

export const ComboboxRoot = <Value extends unknown | unknown[]>({
  multiple = false,
  children,
  onValueChange,
  onInputValueChange,
  onOpenChange,
  value: providedValue,
  defaultValue,
  items,
  ...props
}: ComboboxRootProps<Value>) => {
  const [inputValue, setInputValue] = useState('');
  const [internalValue, setInternalValue] = useState<
    Value | Value[] | null | undefined
  >(defaultValue ?? null);
  const inputContainerRef = useRef<HTMLDivElement>(null);

  const computedValue = providedValue ?? internalValue;

  const handleInputValueChange = useCallback(
    (
      value: string,
      eventDetails: ComboboxPrimitive.Root.ChangeEventDetails
    ) => {
      setInputValue(value);
      onInputValueChange?.(value);
    },
    [onInputValueChange]
  );

  const handleValueChange = useCallback(
    (
      value: Value | Value[] | null,
      eventDetails: ComboboxPrimitive.Root.ChangeEventDetails
    ) => {
      setInternalValue(value);
      if (multiple) {
        (onValueChange as MultipleComboboxProps<Value>['onValueChange'])?.(
          value as Value[]
        );
      } else {
        (onValueChange as SingleComboboxProps<Value>['onValueChange'])?.(
          value as Value | null
        );
      }
    },
    [onValueChange, multiple]
  );

  const contextValue = useMemo(
    () => ({
      multiple,
      inputValue,
      hasItems: !!items,
      inputContainerRef,
      value: computedValue,
      onValueChange: handleValueChange
    }),
    [multiple, inputValue, items, computedValue, handleValueChange]
  );

  return (
    <ComboboxContext.Provider
      value={contextValue as ComboboxContextValue<unknown>}
    >
      <ComboboxPrimitive.Root
        multiple={multiple}
        onValueChange={handleValueChange}
        onInputValueChange={handleInputValueChange}
        items={items}
        value={providedValue}
        defaultValue={defaultValue}
        modal
        {...props}
      >
        {children}
      </ComboboxPrimitive.Root>
    </ComboboxContext.Provider>
  );
};
