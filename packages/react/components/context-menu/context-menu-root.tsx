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
}

export interface AutocompleteContextMenuRootProps
  extends ContextMenuPrimitive.Root.Props {
  autocomplete: true;
  autocompleteMode?: 'auto' | 'manual';
  inputValue?: string;
  onInputValueChange?: (
    value: string,
    eventDetails: AutocompletePrimitive.Root.ChangeEventDetails
  ) => void;
  defaultInputValue?: string;
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
}

export interface AutocompleteContextMenuSubMenuProps
  extends ContextMenuPrimitive.SubmenuRoot.Props {
  autocomplete: true;
  autocompleteMode?: 'auto' | 'manual';
  inputValue?: string;
  onInputValueChange?: (
    value: string,
    eventDetails: AutocompletePrimitive.Root.ChangeEventDetails
  ) => void;
  defaultInputValue?: string;
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
