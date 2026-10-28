'use client';

import { Combobox as ComboboxPrimitive } from '@base-ui/react';
import { useControlled } from '@base-ui/utils/useControlled';
import {
  createContext,
  RefObject,
  useCallback,
  useContext,
  useMemo,
  useRef
} from 'react';
import { useFieldContext } from '../field';

interface ComboboxContextValue<Value = string> {
  multiple: boolean;
  inputValue: string;
  hasItems: boolean;
  inputContainerRef: RefObject<HTMLDivElement | null>;
  value: Value | Value[] | null | undefined;
  onValueChange?: (
    value: Value | Value[] | null,
    eventDetails: ComboboxPrimitive.Root.ChangeEventDetails
  ) => void;
  getLabel: (value: Value) => string;
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

export interface BaseComboboxRootProps<Value, Item = Value>
  extends Omit<
    ComboboxPrimitive.Root.Props<Value, boolean, Item>,
    'onValueChange' | 'onInputValueChange' | 'multiple'
  > {
  onInputValueChange?: (
    inputValue: string,
    eventDetails: ComboboxPrimitive.Root.ChangeEventDetails
  ) => void;
}

export interface SingleComboboxProps<Value = string, Item = Value>
  extends BaseComboboxRootProps<Value, Item> {
  multiple?: false;
  value?: Value | null;
  defaultValue?: Value | null;
  onValueChange?: (
    value: Value | null,
    eventDetails: ComboboxPrimitive.Root.ChangeEventDetails
  ) => void;
}

export interface MultipleComboboxProps<Value = string, Item = Value>
  extends BaseComboboxRootProps<Value, Item> {
  multiple: true;
  value?: Value[];
  defaultValue?: Value[];
  onValueChange?: (
    value: Value[],
    eventDetails: ComboboxPrimitive.Root.ChangeEventDetails
  ) => void;
}

export type ComboboxRootProps<Value = string, Item = Value> =
  | SingleComboboxProps<Value, Item>
  | MultipleComboboxProps<Value, Item>;

export const ComboboxRoot = <Value extends unknown | unknown[], Item = Value>({
  multiple = false,
  children,
  onValueChange,
  onInputValueChange,
  inputValue: providedInputValue,
  defaultInputValue,
  value: providedValue,
  defaultValue,
  items,
  required,
  itemToStringLabel,
  ...props
}: ComboboxRootProps<Value, Item>) => {
  const fieldContext = useFieldContext();
  const resolvedRequired = required ?? fieldContext?.required;

  const [inputValue, setInputValueUnwrapped] = useControlled({
    controlled:
      providedInputValue === undefined ? undefined : String(providedInputValue),
    default: defaultInputValue === undefined ? '' : String(defaultInputValue),
    name: 'Combobox',
    state: 'inputValue'
  });
  const [computedValue, setValueUnwrapped] = useControlled<
    Value | Value[] | null
  >({
    controlled: providedValue,
    default: defaultValue ?? null,
    name: 'Combobox',
    state: 'value'
  });
  const inputContainerRef = useRef<HTMLDivElement>(null);

  const handleInputValueChange = useCallback(
    (
      value: string,
      eventDetails: ComboboxPrimitive.Root.ChangeEventDetails
    ) => {
      onInputValueChange?.(value, eventDetails);
      if (eventDetails.isCanceled) return;
      setInputValueUnwrapped(value);
    },
    [onInputValueChange, setInputValueUnwrapped]
  );

  const handleValueChange = useCallback(
    (
      value: Value | Value[] | null,
      eventDetails: ComboboxPrimitive.Root.ChangeEventDetails
    ) => {
      if (multiple) {
        (onValueChange as MultipleComboboxProps<Value>['onValueChange'])?.(
          value as Value[],
          eventDetails
        );
      } else {
        (onValueChange as SingleComboboxProps<Value>['onValueChange'])?.(
          value as Value | null,
          eventDetails
        );
      }
      if (eventDetails.isCanceled) return;
      setValueUnwrapped(value);
    },
    [onValueChange, multiple, setValueUnwrapped]
  );

  // Same fallback order that Base UI uses for the input text.
  const getLabel = useCallback(
    (value: Value) => {
      if (itemToStringLabel) return itemToStringLabel(value);
      if (typeof value !== 'object' || value === null)
        return String(value ?? '');
      if ('label' in value && value.label != null) return String(value.label);
      if ('value' in value) return String(value.value);
      return JSON.stringify(value);
    },
    [itemToStringLabel]
  );

  const contextValue = useMemo(
    () => ({
      multiple,
      inputValue,
      hasItems: !!items,
      inputContainerRef,
      value: computedValue,
      onValueChange: handleValueChange,
      getLabel
    }),
    [multiple, inputValue, items, computedValue, handleValueChange, getLabel]
  );

  return (
    <ComboboxContext value={contextValue as ComboboxContextValue<unknown>}>
      <ComboboxPrimitive.Root
        multiple={multiple}
        onValueChange={handleValueChange}
        onInputValueChange={handleInputValueChange}
        inputValue={providedInputValue}
        defaultInputValue={defaultInputValue}
        items={items}
        itemToStringLabel={itemToStringLabel}
        value={providedValue}
        defaultValue={defaultValue}
        required={resolvedRequired}
        modal
        {...props}
      >
        {children}
      </ComboboxPrimitive.Root>
    </ComboboxContext>
  );
};

ComboboxRoot.displayName = 'Combobox';
