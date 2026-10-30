'use client';

import { Menu as MenuPrimitive } from '@base-ui/react';
import { useControlled } from '@base-ui/utils/useControlled';
import { createContext, ReactNode, useCallback, useContext } from 'react';

interface CommonProps {
  autocomplete?: boolean;
  autocompleteMode?: 'auto' | 'manual';
  inputValue?: string;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  contentRef?: React.RefObject<HTMLDivElement | null>;
  isInitialRender?: React.RefObject<boolean>;
  open?: boolean;
}

interface MenuContextValue {
  autocomplete?: boolean;
  autocompleteMode?: 'auto' | 'manual';
  inputValue?: string;
  parent?: MenuContextValue;
}

interface UseMenuContextReturn extends MenuContextValue {
  shouldFilter?: boolean;
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
    context.autocomplete &&
    context.autocompleteMode === 'auto' &&
    context.inputValue?.length
  );

  return { ...context, shouldFilter };
};

/**
 * Tracks the search value of a menu or submenu.
 * @remarks Only for internal usage.
 */
export function useMenuInputValue({
  inputValue,
  defaultInputValue,
  onInputValueChange,
  name
}: {
  inputValue?: string;
  defaultInputValue: string;
  onInputValueChange?: (value: string) => void;
  name: string;
}) {
  const [value, setValueUnwrapped] = useControlled({
    controlled: inputValue,
    default: defaultInputValue,
    name,
    state: 'inputValue'
  });

  const setValue = useCallback(
    (next: string) => {
      setValueUnwrapped(next);
      onInputValueChange?.(next);
    },
    [onInputValueChange, setValueUnwrapped]
  );

  return [value, setValue] as const;
}

/**
 * Provides the menu context and, in autocomplete mode, wraps the root in Base UI's filter provider.
 * @remarks Only for internal usage.
 */
export function MenuFilter({
  autocomplete,
  autocompleteMode,
  inputValue,
  onInputValueChange,
  parent,
  children
}: MenuContextValue & {
  onInputValueChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <MenuContext value={{ autocomplete, autocompleteMode, inputValue, parent }}>
      {autocomplete ? (
        <MenuPrimitive.FilterProvider
          value={inputValue}
          onValueChange={value => onInputValueChange(value)}
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
}

export interface AutocompleteMenuRootProps
  extends MenuPrimitive.Root.Props,
    CommonProps {
  autocomplete: true;
  onInputValueChange?: (value: string) => void;
  defaultInputValue?: string;
}

export type MenuRootProps = NormalMenuRootProps | AutocompleteMenuRootProps;

export const MenuRoot = ({
  autocomplete,
  autocompleteMode = 'auto',
  inputValue: providedInputValue,
  onInputValueChange,
  defaultInputValue = '',
  ...props
}: MenuRootProps) => {
  const [inputValue, setInputValue] = useMenuInputValue({
    inputValue: providedInputValue,
    defaultInputValue,
    onInputValueChange,
    name: 'Menu'
  });

  return (
    <MenuFilter
      autocomplete={autocomplete}
      autocompleteMode={autocompleteMode}
      inputValue={inputValue}
      onInputValueChange={setInputValue}
    >
      <MenuPrimitive.Root loopFocus={false} modal {...props} />
    </MenuFilter>
  );
};
MenuRoot.displayName = 'Menu';

export interface NormalMenuSubMenuProps
  extends MenuPrimitive.SubmenuRoot.Props {
  autocomplete?: false;
  autocompleteMode?: never;
  inputValue?: never;
  onInputValueChange?: never;
  defaultInputValue?: never;
}

export interface AutocompleteMenuSubMenuProps
  extends MenuPrimitive.SubmenuRoot.Props {
  autocomplete: true;
  autocompleteMode?: 'auto' | 'manual';
  inputValue?: string;
  onInputValueChange?: (value: string) => void;
  defaultInputValue?: string;
}

export type MenuSubMenuProps =
  | NormalMenuSubMenuProps
  | AutocompleteMenuSubMenuProps;

export const MenuSubMenu = ({
  autocomplete,
  autocompleteMode = 'auto',
  inputValue: providedInputValue,
  onInputValueChange,
  defaultInputValue = '',
  ...props
}: MenuSubMenuProps) => {
  const [inputValue, setInputValue] = useMenuInputValue({
    inputValue: providedInputValue,
    defaultInputValue,
    onInputValueChange,
    name: 'Menu.Submenu'
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
      <MenuPrimitive.SubmenuRoot loopFocus={false} {...props} />
    </MenuFilter>
  );
};
MenuSubMenu.displayName = 'Menu.Submenu';
