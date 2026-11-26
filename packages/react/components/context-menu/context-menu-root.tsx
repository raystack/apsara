'use client';

import {
  ContextMenu as ContextMenuPrimitive,
  Menu as MenuPrimitive
} from '@base-ui/react';
import { MenuProvider } from '../menu/menu-root';

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
  inputValue,
  onInputValueChange,
  defaultInputValue,
  ...props
}: ContextMenuRootProps) => (
  <MenuProvider
    autocomplete={autocomplete}
    autocompleteMode={autocompleteMode}
    inputValue={inputValue}
    defaultInputValue={defaultInputValue}
    onInputValueChange={onInputValueChange}
  >
    <ContextMenuPrimitive.Root loopFocus={false} {...props} />
  </MenuProvider>
);
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
  inputValue,
  onInputValueChange,
  defaultInputValue,
  ...props
}: ContextMenuSubMenuProps) => (
  <MenuProvider
    autocomplete={autocomplete}
    autocompleteMode={autocompleteMode}
    inputValue={inputValue}
    defaultInputValue={defaultInputValue}
    onInputValueChange={onInputValueChange}
  >
    <ContextMenuPrimitive.SubmenuRoot loopFocus={false} {...props} />
  </MenuProvider>
);
ContextMenuSubMenu.displayName = 'ContextMenu.SubMenu';
