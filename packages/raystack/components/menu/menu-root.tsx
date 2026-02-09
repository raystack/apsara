'use client';

import {
  Autocomplete as AutocompletePrimitive,
  Menu as MenuPrimitive
} from '@base-ui/react';
import { createContext, useCallback, useContext, useState } from 'react';

interface CommonProps {
  autocomplete?: boolean;
  autocompleteMode?: 'auto' | 'manual';
  searchValue?: string;
}

interface MenuContextValue extends CommonProps {
  parent?: CommonProps;
  // onSearch?: (value: string) => void;
}

interface UseMenuContextReturn extends MenuContextValue {
  shouldFilter?: boolean;
  parent?: CommonProps & {
    shouldFilter?: boolean;
  };
}

/**
 Root context to manage the Menu control
 @remarks Only for internal usage.
 */
export const MenuContext = createContext<MenuContextValue | undefined>(
  undefined
);

export const useMenuContext = (): UseMenuContextReturn => {
  const context = useContext(MenuContext);
  if (!context) return {};

  const shouldFilter = !!(
    context?.autocomplete &&
    context?.autocompleteMode === 'auto' &&
    context?.searchValue?.length
  );

  const shouldFilterParent = !!(
    context?.parent?.autocomplete &&
    context?.parent?.autocompleteMode === 'auto' &&
    context?.parent?.searchValue?.length
  );

  return {
    ...context,
    shouldFilter,
    parent: context?.parent && {
      ...context.parent,
      shouldFilter: shouldFilterParent
    }
  };
};

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
  searchValue?: never;
  onSearch?: never;
  defaultSearchValue?: never;
}

export interface AutocompleteMenuRootProps
  extends MenuPrimitive.Root.Props,
    CommonProps {
  autocomplete: true;
  onSearch?: (value: string) => void;
  defaultSearchValue?: string;
}

export type MenuRootProps = NormalMenuRootProps | AutocompleteMenuRootProps;

export const MenuRoot = ({
  autocomplete,
  autocompleteMode = 'auto',
  searchValue: providedSearchValue,
  onSearch,
  defaultSearchValue = '',
  ...props
}: MenuRootProps) => {
  const [internalSearchValue, setInternalSearchValue] =
    useState(defaultSearchValue);
  const parentContext = useMenuContext();

  const searchValue = providedSearchValue ?? internalSearchValue;

  const setValue = useCallback(
    (value: string) => {
      setInternalSearchValue(value);
      onSearch?.(value);
    },
    [onSearch]
  );

  const element = <MenuPrimitive.Root {...props} />;

  console.log('menu root');

  return (
    <MenuContext.Provider
      value={{
        autocomplete,
        parent: parentContext,
        autocompleteMode,
        searchValue
        // onSearch: setValue
      }}
    >
      {autocomplete ? (
        <AutocompletePrimitive.Root
          mode='none'
          value={searchValue}
          defaultValue={defaultSearchValue}
          onValueChange={(value: string) => setValue(value)}
          autoHighlight
        >
          {element}
        </AutocompletePrimitive.Root>
      ) : (
        element
      )}
    </MenuContext.Provider>
  );
};
MenuRoot.displayName = 'Menu';

export interface NormalMenuSubMenuProps
  extends MenuPrimitive.SubmenuRoot.Props {
  autocomplete?: false;
  autocompleteMode?: never;
  searchValue?: never;
  onSearch?: never;
  defaultSearchValue?: never;
}

export interface AutocompleteMenuSubMenuProps
  extends MenuPrimitive.SubmenuRoot.Props {
  autocomplete: true;
  autocompleteMode?: 'auto' | 'manual';
  searchValue?: string;
  onSearch?: (value: string) => void;
  defaultSearchValue?: string;
}

export type MenuSubMenuProps =
  | NormalMenuSubMenuProps
  | AutocompleteMenuSubMenuProps;

export const MenuSubMenu = ({
  autocomplete,
  autocompleteMode = 'auto',
  searchValue: providedSearchValue,
  onSearch,
  defaultSearchValue = '',
  ...props
}: MenuSubMenuProps) => {
  const [internalSearchValue, setInternalSearchValue] =
    useState(defaultSearchValue);
  const parentContext = useMenuContext();

  const searchValue = providedSearchValue ?? internalSearchValue;

  const setValue = useCallback(
    (value: string) => {
      setInternalSearchValue(value);
      onSearch?.(value);
    },
    [onSearch]
  );

  const element = <MenuPrimitive.SubmenuRoot {...props} />;

  return (
    <MenuContext.Provider
      value={{
        autocomplete,
        parent: parentContext,
        autocompleteMode,
        searchValue
        // onSearch: setValue
      }}
    >
      {autocomplete ? (
        <AutocompletePrimitive.Root
          mode='none'
          value={searchValue}
          defaultValue={defaultSearchValue}
          onValueChange={(value: string) => setValue(value)}
          autoHighlight
          open
        >
          {element}
        </AutocompletePrimitive.Root>
      ) : (
        element
      )}
    </MenuContext.Provider>
  );
};
MenuSubMenu.displayName = 'Menu.SubMenu';
