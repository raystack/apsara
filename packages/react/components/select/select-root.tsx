'use client';

import {
  Combobox as ComboboxPrimitive,
  Select as SelectPrimitive
} from '@base-ui/react';
import { useControlled } from '@base-ui/utils/useControlled';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState
} from 'react';
import { useFieldContext } from '../field';
import { ItemType } from './types';

interface CommonProps {
  /**
   * Whether the list has a search input that filters the items.
   * @default false
   */
  autocomplete?: boolean;
  /**
   * How the search filters the items. `"auto"` filters them as the user types. With `"manual"`, you filter them in `onInputValueChange`.
   * @default "auto"
   */
  autocompleteMode?: 'auto' | 'manual';
}

interface SelectContextValue extends CommonProps {
  value?: string | string[];
  inputValue?: string;
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
    context?.inputValue?.length
  );
  return {
    ...context,
    shouldFilter
  };
};

/** Base UI's `eventDetails`, from Combobox when `autocomplete` is set. */
export type SelectChangeEventDetails =
  | SelectPrimitive.Root.ChangeEventDetails
  | ComboboxPrimitive.Root.ChangeEventDetails;

export interface BaseSelectProps extends CommonProps {
  /** The search text when `autocomplete` is set. */
  inputValue?: string;
  /**
   * The search text on first render when `inputValue` is not set.
   * @default ""
   */
  defaultInputValue?: string;
  /** Called when the search text changes. */
  onInputValueChange?: (
    inputValue: string,
    eventDetails: ComboboxPrimitive.Root.ChangeEventDetails
  ) => void;
  /** The select's parts, such as `Select.Trigger` and `Select.Content`. */
  children?: ReactNode;
  /** Whether the list is open. */
  open?: boolean;
  /**
   * Whether the list is open on first render when `open` is not set.
   * @default false
   */
  defaultOpen?: boolean;
  /** Called when the list opens or closes. */
  onOpenChange?: (
    open: boolean,
    eventDetails: SelectChangeEventDetails
  ) => void;
  /**
   * Whether the select is disabled.
   * @default false
   */
  disabled?: boolean;
  /** Whether a value is required. Defaults to the `required` of the surrounding `Field`, otherwise `false`. */
  required?: boolean;
  /** Name of the field when the select is submitted with a form. */
  name?: string;
  /** All item values. With `autocomplete`, setting it turns off the filtering of the `Select.Item` children. It has no effect without `autocomplete`. */
  items?: string[];
}

export interface SingleSelectProps extends BaseSelectProps {
  /**
   * Whether the user can select more than one item. `value`, `defaultValue`, and `onValueChange` then use an array.
   * @default false
   */
  multiple?: false;
  /** The selected value. An array when `multiple` is set. */
  value?: string;
  /** Called when the selection changes. Receives an array when `multiple` is set. */
  onValueChange?: (
    value: string,
    eventDetails: SelectChangeEventDetails
  ) => void;
  /** The value selected on first render when `value` is not set. An array when `multiple` is set. */
  defaultValue?: string;
}

export interface MultipleSelectProps extends BaseSelectProps {
  /** Whether the user can select more than one item. `value`, `defaultValue`, and `onValueChange` then use an array. */
  multiple: true;
  /** The selected value. An array when `multiple` is set. */
  value?: string[];
  /** Called when the selection changes. Receives an array when `multiple` is set. */
  onValueChange?: (
    value: string[],
    eventDetails: SelectChangeEventDetails
  ) => void;
  /** The value selected on first render when `value` is not set. An array when `multiple` is set. */
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
    inputValue: providedInputValue,
    onInputValueChange,
    defaultInputValue = '',
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

  const fieldContext = useFieldContext();
  const resolvedRequired = required ?? fieldContext?.required;

  const [computedValue, setValueUnwrapped] = useControlled<
    string | string[] | undefined
  >({
    controlled: providedValue,
    default: defaultValue,
    name: 'Select',
    state: 'value'
  });
  const [inputValue, setInputValueUnwrapped] = useControlled({
    controlled: providedInputValue,
    default: defaultInputValue,
    name: 'Select',
    state: 'inputValue'
  });
  const [registeredItems, setRegisteredItems] = useState<
    SelectContextValue['items']
  >({});

  const handleValueChange = useCallback(
    (
      value: string | string[] | null,
      eventDetails: SelectChangeEventDetails
    ) => {
      if (multiple) {
        (onValueChange as MultipleSelectProps['onValueChange'])?.(
          value as string[],
          eventDetails
        );
      } else {
        (onValueChange as SingleSelectProps['onValueChange'])?.(
          value as string,
          eventDetails
        );
      }
      if (eventDetails.isCanceled) return;
      setValueUnwrapped(value ?? undefined);
    },
    [multiple, onValueChange, setValueUnwrapped]
  );

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
      inputValue,
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
      inputValue,
      multiple,
      registeredItems,
      itemsProp
    ]
  );

  const commonProps = {
    value: providedValue,
    defaultValue,
    onValueChange: handleValueChange,
    open: providedOpen,
    defaultOpen,
    onOpenChange,
    multiple,
    disabled,
    modal: true as const,
    ...rest,
    required: resolvedRequired,
    name
  };

  if (autocomplete) {
    return (
      <SelectContext value={contextValue}>
        <ComboboxPrimitive.Root
          {...commonProps}
          inputValue={providedInputValue}
          defaultInputValue={defaultInputValue}
          onInputValueChange={handleInputValueChange}
          filter={itemsProp ? undefined : null}
          items={itemsProp}
          loopFocus={false}
          // @ts-ignore @base-ui/react@1.3.0 ComboboxRootProps types `autoHighlight` as `boolean | undefined`, but the runtime accepts `always | input-change`. Remove when upstream types are corrected.
          autoHighlight='always'
        >
          {children}
        </ComboboxPrimitive.Root>
      </SelectContext>
    );
  }

  return (
    <SelectContext.Provider value={contextValue}>
      <SelectPrimitive.Root {...commonProps}>{children}</SelectPrimitive.Root>
    </SelectContext.Provider>
  );
};

SelectRoot.displayName = 'Select';
