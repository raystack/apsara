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
    eventDetails: MenuPrimitive.FilterProvider.ChangeEventDetails
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
    eventDetails: MenuPrimitive.FilterProvider.ChangeEventDetails
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
