'use client';

import { ContextMenu as ContextMenuPrimitive } from '@base-ui/react';
import { useCallback, useRef, useState } from 'react';
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
  onInputValueChange?: (value: string) => void;
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
  const [internalInputValue, setInternalInputValue] =
    useState(defaultInputValue);

  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = providedOpen ?? internalOpen;
  const inputRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isInitialRender = useRef(true);

  const inputValue = providedInputValue ?? internalInputValue;

  const setValue = useCallback(
    (value: string) => {
      setInternalInputValue(value);
      onInputValueChange?.(value);
    },
    [onInputValueChange]
  );

  const handleOpenChange: ContextMenuPrimitive.Root.Props['onOpenChange'] =
    useCallback(
      (
        value: boolean,
        eventDetails: ContextMenuPrimitive.Root.ChangeEventDetails
      ) => {
        if (!value && autocomplete) {
          setValue('');
          isInitialRender.current = true;
        }
        setInternalOpen(value);
        onOpenChange?.(value, eventDetails);
      },
      [onOpenChange, setValue, autocomplete]
    );

  return (
    <MenuContext.Provider
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
    </MenuContext.Provider>
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
  onInputValueChange?: (value: string) => void;
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
  const [internalInputValue, setInternalInputValue] =
    useState(defaultInputValue);
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = providedOpen ?? internalOpen;
  const parentContext = useMenuContext();
  const inputRef = useRef<HTMLInputElement>(null);
  const isInitialRender = useRef(true);
  const contentRef = useRef<HTMLDivElement>(null);
  const inputValue = providedInputValue ?? internalInputValue;

  const setValue = useCallback(
    (value: string) => {
      setInternalInputValue(value);
      onInputValueChange?.(value);
    },
    [onInputValueChange]
  );

  const handleOpenChange: ContextMenuPrimitive.SubmenuRoot.Props['onOpenChange'] =
    useCallback(
      (
        value: boolean,
        eventDetails: ContextMenuPrimitive.SubmenuRoot.ChangeEventDetails
      ) => {
        if (!value && autocomplete) {
          setValue('');
          isInitialRender.current = true;
        }
        setInternalOpen(value);
        onOpenChange?.(value, eventDetails);
      },
      [onOpenChange, setValue, autocomplete]
    );

  return (
    <MenuContext.Provider
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
    </MenuContext.Provider>
  );
};
ContextMenuSubMenu.displayName = 'ContextMenu.SubMenu';
