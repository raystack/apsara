'use client';

import {
  Autocomplete as AutocompletePrimitive,
  ContextMenu as ContextMenuPrimitive
} from '@base-ui/react';
import { createChangeEventDetails } from '@base-ui/react/internals/createBaseUIEventDetails';
import { REASONS } from '@base-ui/react/internals/reasons';
import { useControlled } from '@base-ui/utils/useControlled';
import { useCallback, useRef } from 'react';
import { MenuContext, useMenuContext } from '../menu/menu-root';

export interface NormalContextMenuRootProps
  extends ContextMenuPrimitive.Root.Props {
  autocomplete?: false;
  autocompleteMode?: never;
  inputValue?: never;
  onInputValueChange?: never;
  defaultInputValue?: never;
  /**
   * Whether the arrow keys move focus from the last item back to the first.
   * @default false
   */
  loopFocus?: boolean;
}

export interface AutocompleteContextMenuRootProps
  extends ContextMenuPrimitive.Root.Props {
  /**
   * Whether the menu has a search input that filters the items.
   * @default false
   */
  autocomplete: true;
  /**
   * How the search filters the items. `"auto"` filters them as the user types. With `"manual"`, you filter them in `onInputValueChange`.
   * @default "auto"
   */
  autocompleteMode?: 'auto' | 'manual';
  /** The search text when `autocomplete` is set. */
  inputValue?: string;
  /** Called when the search text changes. The menu clears the text when it closes. */
  onInputValueChange?: (
    value: string,
    eventDetails: AutocompletePrimitive.Root.ChangeEventDetails
  ) => void;
  /**
   * The search text on first render when `inputValue` is not set.
   * @default ""
   */
  defaultInputValue?: string;
  /**
   * Whether the arrow keys move focus from the last item back to the first.
   * @default false
   */
  loopFocus?: boolean;
}

export type ContextMenuRootProps =
  | NormalContextMenuRootProps
  | AutocompleteContextMenuRootProps;

export const ContextMenuRoot = ({
  autocomplete,
  autocompleteMode = 'auto',
  inputValue: providedInputValue,
  onInputValueChange,
  defaultInputValue = '',
  open: providedOpen,
  onOpenChange,
  defaultOpen = false,
  ...props
}: ContextMenuRootProps) => {
  const [inputValue, setInputValueUnwrapped] = useControlled({
    controlled: providedInputValue,
    default: defaultInputValue,
    name: 'ContextMenu',
    state: 'inputValue'
  });
  const [open, setOpenUnwrapped] = useControlled({
    controlled: providedOpen,
    default: defaultOpen,
    name: 'ContextMenu',
    state: 'open'
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isInitialRender = useRef(true);

  const setValue = useCallback(
    (
      value: string,
      eventDetails: AutocompletePrimitive.Root.ChangeEventDetails
    ) => {
      onInputValueChange?.(value, eventDetails);
      if (eventDetails.isCanceled) return;
      setInputValueUnwrapped(value);
    },
    [onInputValueChange, setInputValueUnwrapped]
  );

  const handleOpenChange: ContextMenuPrimitive.Root.Props['onOpenChange'] =
    useCallback(
      (
        value: boolean,
        eventDetails: ContextMenuPrimitive.Root.ChangeEventDetails
      ) => {
        if (!value && autocomplete) {
          setValue(
            '',
            createChangeEventDetails(REASONS.inputClear, eventDetails.event)
          );
          isInitialRender.current = true;
        }
        setOpenUnwrapped(value);
        onOpenChange?.(value, eventDetails);
      },
      [onOpenChange, setValue, autocomplete, setOpenUnwrapped]
    );

  return (
    <MenuContext
      value={{
        autocomplete,
        inputRef,
        autocompleteMode,
        inputValue,
        onInputValueChange: setValue,
        open: open,
        isInitialRender,
        contentRef
      }}
    >
      <ContextMenuPrimitive.Root
        open={open}
        onOpenChange={handleOpenChange}
        loopFocus={false}
        {...props}
      />
    </MenuContext>
  );
};
ContextMenuRoot.displayName = 'ContextMenu';

export interface NormalContextMenuSubMenuProps
  extends ContextMenuPrimitive.SubmenuRoot.Props {
  autocomplete?: false;
  autocompleteMode?: never;
  inputValue?: never;
  onInputValueChange?: never;
  defaultInputValue?: never;
  /**
   * Whether the arrow keys move focus from the last item back to the first.
   * @default false
   */
  loopFocus?: boolean;
}

export interface AutocompleteContextMenuSubMenuProps
  extends ContextMenuPrimitive.SubmenuRoot.Props {
  /**
   * Whether the submenu has a search input that filters the items.
   * @default false
   */
  autocomplete: true;
  /**
   * How the search filters the items. `"auto"` filters them as the user types. With `"manual"`, you filter them in `onInputValueChange`.
   * @default "auto"
   */
  autocompleteMode?: 'auto' | 'manual';
  /** The search text when `autocomplete` is set. */
  inputValue?: string;
  /** Called when the search text changes. The submenu clears the text when it closes. */
  onInputValueChange?: (
    value: string,
    eventDetails: AutocompletePrimitive.Root.ChangeEventDetails
  ) => void;
  /**
   * The search text on first render when `inputValue` is not set.
   * @default ""
   */
  defaultInputValue?: string;
  /**
   * Whether the arrow keys move focus from the last item back to the first.
   * @default false
   */
  loopFocus?: boolean;
}

export type ContextMenuSubMenuProps =
  | NormalContextMenuSubMenuProps
  | AutocompleteContextMenuSubMenuProps;

export const ContextMenuSubMenu = ({
  autocomplete,
  autocompleteMode = 'auto',
  inputValue: providedInputValue,
  onInputValueChange,
  defaultInputValue = '',
  open: providedOpen,
  onOpenChange,
  defaultOpen = false,
  ...props
}: ContextMenuSubMenuProps) => {
  const [inputValue, setInputValueUnwrapped] = useControlled({
    controlled: providedInputValue,
    default: defaultInputValue,
    name: 'ContextMenu.SubMenu',
    state: 'inputValue'
  });
  const [open, setOpenUnwrapped] = useControlled({
    controlled: providedOpen,
    default: defaultOpen,
    name: 'ContextMenu.SubMenu',
    state: 'open'
  });
  const parentContext = useMenuContext();
  const inputRef = useRef<HTMLInputElement>(null);
  const isInitialRender = useRef(true);
  const contentRef = useRef<HTMLDivElement>(null);

  const setValue = useCallback(
    (
      value: string,
      eventDetails: AutocompletePrimitive.Root.ChangeEventDetails
    ) => {
      onInputValueChange?.(value, eventDetails);
      if (eventDetails.isCanceled) return;
      setInputValueUnwrapped(value);
    },
    [onInputValueChange, setInputValueUnwrapped]
  );

  const handleOpenChange: ContextMenuPrimitive.SubmenuRoot.Props['onOpenChange'] =
    useCallback(
      (
        value: boolean,
        eventDetails: ContextMenuPrimitive.SubmenuRoot.ChangeEventDetails
      ) => {
        if (!value && autocomplete) {
          setValue(
            '',
            createChangeEventDetails(REASONS.inputClear, eventDetails.event)
          );
          isInitialRender.current = true;
        }
        setOpenUnwrapped(value);
        onOpenChange?.(value, eventDetails);
      },
      [onOpenChange, setValue, autocomplete, setOpenUnwrapped]
    );

  return (
    <MenuContext
      value={{
        autocomplete,
        inputRef,
        parent: parentContext,
        autocompleteMode,
        inputValue,
        onInputValueChange: setValue,
        open: open,
        isInitialRender,
        contentRef
      }}
    >
      <ContextMenuPrimitive.SubmenuRoot
        loopFocus={false}
        open={open}
        onOpenChange={handleOpenChange}
        {...props}
      />
    </MenuContext>
  );
};
ContextMenuSubMenu.displayName = 'ContextMenu.SubMenu';
