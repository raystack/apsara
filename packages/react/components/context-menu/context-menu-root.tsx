'use client';

import { ContextMenu as ContextMenuPrimitive } from '@base-ui/react';
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
  ...props
}: ContextMenuRootProps) => {
  const [inputValue, setInputValue] = useMenuInputValue({
    inputValue: providedInputValue,
    defaultInputValue,
    onInputValueChange,
    name: 'ContextMenu'
  });

  return (
    <MenuFilter
      autocomplete={autocomplete}
      autocompleteMode={autocompleteMode}
      inputValue={inputValue}
      onInputValueChange={setInputValue}
    >
      <ContextMenuPrimitive.Root loopFocus={false} {...props} />
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
  ...props
}: ContextMenuSubMenuProps) => {
  const [inputValue, setInputValue] = useMenuInputValue({
    inputValue: providedInputValue,
    defaultInputValue,
    onInputValueChange,
    name: 'ContextMenu.SubMenu'
  });
  const parent = useMenuContext();

  return (
    <MenuFilter
      autocomplete={autocomplete}
      autocompleteMode={autocompleteMode}
      inputValue={inputValue}
      onInputValueChange={setInputValue}
      parent={parent}
    >
      <ContextMenuPrimitive.SubmenuRoot loopFocus={false} {...props} />
    </MenuFilter>
  );
};
ContextMenuSubMenu.displayName = 'ContextMenu.SubMenu';
