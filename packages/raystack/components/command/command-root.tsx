'use client';

import { Autocomplete as AutocompletePrimitive } from '@base-ui/react/autocomplete';
import { cx } from 'class-variance-authority';
import {
  createContext,
  type RefObject,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState
} from 'react';
import styles from './command.module.css';

interface CommandContextValue {
  inputValue: string;
  hasItems: boolean;
  inputContainerRef: RefObject<HTMLDivElement | null>;
}

const CommandContext = createContext<CommandContextValue | undefined>(
  undefined
);

export const useCommandContext = (): CommandContextValue => {
  const context = useContext(CommandContext);
  if (!context) {
    throw new Error('useCommandContext must be used within a Command');
  }
  return context;
};

export interface CommandRootProps
  extends Omit<AutocompletePrimitive.Root.Props<unknown>, 'items'> {
  /**
   * Items to be displayed and filtered by Base UI internally.
   * When provided, the auto-search fallback is disabled and filtering is
   * delegated to Base UI's built-in logic (or the user's custom `filter`).
   */
  items?: readonly unknown[];
  /** Additional CSS class for the panel wrapper. */
  className?: string;
}

export const CommandRoot = ({
  value: providedValue,
  defaultValue,
  onValueChange,
  items,
  inline = true,
  open = true,
  autoHighlight = 'always',
  keepHighlight = true,
  className,
  children,
  ...props
}: CommandRootProps) => {
  const [internalValue, setInternalValue] = useState<string>(
    typeof defaultValue === 'string' ? defaultValue : ''
  );
  const inputContainerRef = useRef<HTMLDivElement>(null);

  const computedValue =
    typeof providedValue === 'string' ? providedValue : internalValue;

  const handleValueChange = useCallback(
    (
      value: string,
      eventDetails: AutocompletePrimitive.Root.ChangeEventDetails
    ) => {
      setInternalValue(value);
      onValueChange?.(value, eventDetails);
    },
    [onValueChange]
  );

  const contextValue = useMemo(
    () => ({
      inputValue: computedValue,
      hasItems: !!items,
      inputContainerRef
    }),
    [computedValue, items]
  );

  return (
    <CommandContext.Provider value={contextValue}>
      <AutocompletePrimitive.Root
        inline={inline}
        open={open}
        autoHighlight={autoHighlight}
        keepHighlight={keepHighlight}
        value={providedValue}
        defaultValue={defaultValue}
        onValueChange={handleValueChange}
        items={items}
        {...props}
      >
        <div className={cx(styles.panel, className)}>{children}</div>
      </AutocompletePrimitive.Root>
    </CommandContext.Provider>
  );
};

CommandRoot.displayName = 'Command';
