'use client';

import {
  ContextMenu as ContextMenuPrimitive,
  Menu as MenuPrimitive
} from '@base-ui/react';
import {
  MenuFilter,
  useMenuContext,
  useMenuInputValue
} from '../menu/menu-root';

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
    eventDetails: MenuPrimitive.FilterProvider.ChangeEventDetails
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
  ...props
}: ContextMenuRootProps) => {
  const search = useMenuInputValue({
    inputValue: providedInputValue,
    defaultInputValue,
    onInputValueChange,
    name: 'ContextMenu',
    open: props.open,
    onOpenChange: props.onOpenChange,
    onOpenChangeComplete: props.onOpenChangeComplete
  });

  return (
    <MenuFilter
      autocomplete={autocomplete}
      autocompleteMode={autocompleteMode}
      inputValue={search.inputValue}
      shownInputValue={search.shownInputValue}
      openedByHover={search.openedByHover}
      onInputValueChange={search.setInputValue}
    >
      <ContextMenuPrimitive.Root
        loopFocus={false}
        {...props}
        onOpenChange={search.onOpenChange}
        onOpenChangeComplete={search.onOpenChangeComplete}
      />
    </MenuFilter>
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
    eventDetails: MenuPrimitive.FilterProvider.ChangeEventDetails
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
  ...props
}: ContextMenuSubMenuProps) => {
  const search = useMenuInputValue({
    inputValue: providedInputValue,
    defaultInputValue,
    onInputValueChange,
    name: 'ContextMenu.SubMenu',
    open: props.open,
    onOpenChange: props.onOpenChange,
    onOpenChangeComplete: props.onOpenChangeComplete
  });
  const parent = useMenuContext();

  return (
    <MenuFilter
      autocomplete={autocomplete}
      autocompleteMode={autocompleteMode}
      inputValue={search.inputValue}
      shownInputValue={search.shownInputValue}
      openedByHover={search.openedByHover}
      onInputValueChange={search.setInputValue}
      parent={parent}
    >
      <ContextMenuPrimitive.SubmenuRoot
        loopFocus={false}
        {...props}
        onOpenChange={search.onOpenChange}
        onOpenChangeComplete={search.onOpenChangeComplete}
      />
    </MenuFilter>
  );
};
ContextMenuSubMenu.displayName = 'ContextMenu.SubMenu';
