'use client';

import { Combobox as ComboboxPrimitive } from '@base-ui/react';
import {
  createContext,
  RefObject,
  useCallback,
  useContext,
  useId,
  useMemo,
  useRef,
  useState
} from 'react';
import { useFieldContext } from '../field';
import { getItemLabel } from './combobox-items';

interface ComboboxContextValue<Value = string> {
  multiple: boolean;
  inputValue: string;
  hasItems: boolean;
  inputId: string;
  inputContainerRef: RefObject<HTMLDivElement | null>;
  value: Value | Value[] | null | undefined;
  onValueChange?: (value: Value | Value[] | null) => void;
  getLabel: (value: Value) => string;
  /** Counts the items that match the input when `items` is not set. */
  registerMatch: () => () => void;
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

const MatchCountContext = createContext(0);

/** Number of rendered items that match the input when `items` is not set. */
export const useMatchCount = () => useContext(MatchCountContext);

export interface BaseComboboxRootProps<Value, Item = Value>
  extends Omit<
    ComboboxPrimitive.Root.Props<Value, boolean, Item>,
    'onValueChange' | 'onInputValueChange' | 'multiple'
  > {
  onInputValueChange?: (inputValue: string) => void;
}

export interface SingleComboboxProps<Value = string, Item = Value>
  extends BaseComboboxRootProps<Value, Item> {
  multiple?: false;
  value?: Value | null;
  defaultValue?: Value | null;
  onValueChange?: (value: Value | null) => void;
}

export interface MultipleComboboxProps<Value = string, Item = Value>
  extends BaseComboboxRootProps<Value, Item> {
  multiple: true;
  value?: Value[];
  defaultValue?: Value[];
  onValueChange?: (value: Value[]) => void;
}

export type ComboboxRootProps<Value = string, Item = Value> =
  | SingleComboboxProps<Value, Item>
  | MultipleComboboxProps<Value, Item>;

export const ComboboxRoot = <Value extends unknown | unknown[], Item = Value>({
  multiple = false,
  children,
  onValueChange,
  onInputValueChange,
  value: providedValue,
  defaultValue,
  items,
  required,
  id: idProp,
  ...props
}: ComboboxRootProps<Value, Item>) => {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const fieldContext = useFieldContext();
  const resolvedRequired = required ?? fieldContext?.required;

  const [inputValue, setInputValue] = useState('');
  const [internalValue, setInternalValue] = useState<
    Value | Value[] | null | undefined
  >(defaultValue ?? (multiple ? [] : null));
  const [matchCount, setMatchCount] = useState(0);
  const inputContainerRef = useRef<HTMLDivElement>(null);

  // Base UI is always controlled, so a value set through the context (for
  // example by removing a chip that is hidden behind "+N") reaches it.
  const computedValue =
    providedValue === undefined ? internalValue : providedValue;

  const registerMatch = useCallback(() => {
    setMatchCount(count => count + 1);
    return () => setMatchCount(count => count - 1);
  }, []);

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
        (
          onValueChange as MultipleComboboxProps<Value, Item>['onValueChange']
        )?.(value as Value[]);
      } else {
        (onValueChange as SingleComboboxProps<Value, Item>['onValueChange'])?.(
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
      inputId: id,
      inputContainerRef,
      value: computedValue,
      onValueChange: handleValueChange,
      getLabel: (value: Value) => getItemLabel(items, value) ?? String(value),
      registerMatch
    }),
    [
      multiple,
      inputValue,
      items,
      id,
      computedValue,
      handleValueChange,
      registerMatch
    ]
  );

  return (
    <ComboboxContext value={contextValue as ComboboxContextValue<unknown>}>
      <ComboboxPrimitive.Root
        multiple={multiple}
        onValueChange={handleValueChange}
        onInputValueChange={handleInputValueChange}
        items={items}
        value={computedValue}
        id={id}
        required={resolvedRequired}
        modal
        {...props}
      >
        <MatchCountContext value={matchCount}>{children}</MatchCountContext>
      </ComboboxPrimitive.Root>
    </ComboboxContext>
  );
};

ComboboxRoot.displayName = 'Combobox';
