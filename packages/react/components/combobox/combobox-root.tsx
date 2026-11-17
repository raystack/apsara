'use client';

import { Combobox as ComboboxPrimitive } from '@base-ui/react';
import { useControlled } from '@base-ui/utils/useControlled';
import {
  createContext,
  ReactNode,
  RefObject,
  useCallback,
  useContext,
  useId,
  useMemo,
  useRef
} from 'react';
import { useFieldContext } from '../field';

interface ComboboxContextValue<Value = string> {
  multiple: boolean;
  inputValue: string;
  hasItems: boolean;
  inputId: string;
  inputContainerRef: RefObject<HTMLDivElement | null>;
  value: Value | Value[] | null | undefined;
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
  /** The combobox's parts, such as `Combobox.Input` and `Combobox.Content`. */
  children?: ReactNode;
  /** The `id` of the input. `Combobox.Label` points to it. */
  id?: string;
  /**
   * Whether the popup locks page scroll and blocks pointer interaction outside it.
   * @default true
   */
  modal?: boolean;
  /** Converts a value to the text shown in the input and the chips. A value shaped `{ value, label }` uses its `label` without it. */
  itemToStringLabel?: (itemValue: Value) => string;
  /** Called when the input text changes. */
  onInputValueChange?: (
    inputValue: string,
    eventDetails: ComboboxPrimitive.Root.ChangeEventDetails
  ) => void;
}

export interface SingleComboboxProps<Value = string, Item = Value>
  extends BaseComboboxRootProps<Value, Item> {
  /**
   * Whether the user can select more than one item. `value`, `defaultValue`, and `onValueChange` then use an array.
   * @default false
   */
  multiple?: false;
  /** The selected value. An array when `multiple` is set. */
  value?: Value | null;
  /** The value selected on first render when `value` is not set. An array when `multiple` is set. */
  defaultValue?: Value | null;
  /** Called when the selection changes. Receives an array when `multiple` is set. */
  onValueChange?: (
    value: Value | null,
    eventDetails: ComboboxPrimitive.Root.ChangeEventDetails
  ) => void;
}

export interface MultipleComboboxProps<Value = string, Item = Value>
  extends BaseComboboxRootProps<Value, Item> {
  /** Whether the user can select more than one item. `value`, `defaultValue`, and `onValueChange` then use an array. */
  multiple: true;
  /** The selected value. An array when `multiple` is set. */
  value?: Value[];
  /** The value selected on first render when `value` is not set. An array when `multiple` is set. */
  defaultValue?: Value[];
  /** Called when the selection changes. Receives an array when `multiple` is set. */
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
  id: idProp,
  ...props
}: ComboboxRootProps<Value, Item>) => {
  const generatedId = useId();
  const id = idProp ?? generatedId;
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
      inputId: id,
      inputContainerRef,
      value: computedValue,
      getLabel
    }),
    [multiple, inputValue, items, id, computedValue, getLabel]
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
        id={id}
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
