'use client';

import { Menu as MenuPrimitive } from '@base-ui/react';
import { createContext, ReactNode, useContext } from 'react';

interface MenuContextValue {
  autocomplete?: boolean;
  autocompleteMode?: 'auto' | 'manual';
}

/**
 Root context to manage the Menu control
 @remarks Only for internal usage.
 */
export const MenuContext = createContext<MenuContextValue | undefined>(
  undefined
);

export const useMenuContext = (): MenuContextValue =>
  useContext(MenuContext) ?? {};

/**
 * Provides the menu context and, in autocomplete mode, wraps the menu or submenu root in Base UI's filter provider.
 * @remarks Only for internal usage.
 */
export function MenuProvider({
  autocomplete,
  autocompleteMode,
  inputValue,
  defaultInputValue,
  onInputValueChange,
  children
}: MenuContextValue & {
  inputValue?: string;
  defaultInputValue?: string;
  onInputValueChange?: (
    value: string,
    eventDetails: MenuPrimitive.FilterProvider.ChangeEventDetails
  ) => void;
  children: ReactNode;
}) {
  return (
    <MenuContext value={{ autocomplete, autocompleteMode }}>
      {autocomplete ? (
        <MenuPrimitive.FilterProvider
          value={inputValue}
          defaultValue={defaultInputValue}
          onValueChange={onInputValueChange}
          filter={autocompleteMode === 'manual' ? null : undefined}
          autoHighlight='always'
        >
          {children}
        </MenuPrimitive.FilterProvider>
      ) : (
        children
      )}
    </MenuContext>
  );
}

export interface MenuRootBaseProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: MenuPrimitive.Root.Props['onOpenChange'];
  modal?: boolean;
  loopFocus?: boolean;
}

export interface NormalMenuRootProps extends MenuPrimitive.Root.Props {
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

export interface AutocompleteMenuRootProps extends MenuPrimitive.Root.Props {
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

export type MenuRootProps = NormalMenuRootProps | AutocompleteMenuRootProps;

export const MenuRoot = ({
  autocomplete,
  autocompleteMode = 'auto',
  inputValue,
  onInputValueChange,
  defaultInputValue,
  ...props
}: MenuRootProps) => (
  <MenuProvider
    autocomplete={autocomplete}
    autocompleteMode={autocompleteMode}
    inputValue={inputValue}
    defaultInputValue={defaultInputValue}
    onInputValueChange={onInputValueChange}
  >
    <MenuPrimitive.Root loopFocus={false} modal {...props} />
  </MenuProvider>
);
MenuRoot.displayName = 'Menu';

export interface NormalMenuSubMenuProps
  extends MenuPrimitive.SubmenuRoot.Props {
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

export interface AutocompleteMenuSubMenuProps
  extends MenuPrimitive.SubmenuRoot.Props {
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

export type MenuSubMenuProps =
  | NormalMenuSubMenuProps
  | AutocompleteMenuSubMenuProps;

export const MenuSubMenu = ({
  autocomplete,
  autocompleteMode = 'auto',
  inputValue,
  onInputValueChange,
  defaultInputValue,
  ...props
}: MenuSubMenuProps) => (
  <MenuProvider
    autocomplete={autocomplete}
    autocompleteMode={autocompleteMode}
    inputValue={inputValue}
    defaultInputValue={defaultInputValue}
    onInputValueChange={onInputValueChange}
  >
    <MenuPrimitive.SubmenuRoot loopFocus={false} {...props} />
  </MenuProvider>
);
MenuSubMenu.displayName = 'Menu.Submenu';
