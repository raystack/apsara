'use client';

import { Menu as MenuPrimitive } from '@base-ui/react';
import { REASONS } from '@base-ui/react/internals/reasons';
import { useControlled } from '@base-ui/utils/useControlled';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState
} from 'react';

interface MenuContextValue {
  autocomplete?: boolean;
  autocompleteMode?: 'auto' | 'manual';
  inputValue?: string;
  openedByHover?: boolean;
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
    context.inputValue?.trim().length
  );

  return { ...context, shouldFilter };
};

/**
 * Tracks the search value of a menu or submenu.
 * @remarks Only for internal usage.
 */
export function useMenuInputValue<
  OpenChangeDetails extends { isCanceled: boolean; reason: string }
>({
  inputValue,
  defaultInputValue,
  onInputValueChange,
  name,
  open,
  onOpenChange,
  onOpenChangeComplete
}: {
  inputValue?: string;
  defaultInputValue: string;
  onInputValueChange?: (
    value: string,
    eventDetails: MenuPrimitive.FilterProvider.ChangeEventDetails
  ) => void;
  name: string;
  open?: boolean;
  onOpenChange?: (open: boolean, eventDetails: OpenChangeDetails) => void;
  onOpenChangeComplete?: (open: boolean) => void;
}) {
  const [value, setValueUnwrapped] = useControlled({
    controlled: inputValue,
    default: defaultInputValue,
    name,
    state: 'inputValue'
  });
  // Base UI keeps showing the cleared query until the popup finishes closing.
  const [closingValue, setClosingValue] = useState<string | null>(null);
  const [openedByHover, setOpenedByHover] = useState(false);

  const setValue = useCallback(
    (
      next: string,
      eventDetails: MenuPrimitive.FilterProvider.ChangeEventDetails
    ) => {
      if (eventDetails.reason === REASONS.popupClose) setClosingValue(value);
      onInputValueChange?.(next, eventDetails);
      if (eventDetails.isCanceled) return;
      setValueUnwrapped(next);
    },
    [value, onInputValueChange, setValueUnwrapped]
  );

  const handleOpenChange = useCallback(
    (nextOpen: boolean, eventDetails: OpenChangeDetails) => {
      onOpenChange?.(nextOpen, eventDetails);
      if (eventDetails.isCanceled) return;
      setOpenedByHover(
        nextOpen && eventDetails.reason === REASONS.triggerHover
      );
      if (nextOpen) setClosingValue(null);
    },
    [onOpenChange]
  );

  const handleOpenChangeComplete = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) setClosingValue(null);
      onOpenChangeComplete?.(nextOpen);
    },
    [onOpenChangeComplete]
  );

  return {
    inputValue: value,
    setInputValue: setValue,
    shownInputValue: open || closingValue === null ? value : closingValue,
    openedByHover,
    onOpenChange: handleOpenChange,
    onOpenChangeComplete: handleOpenChangeComplete
  };
}

/**
 * Provides the menu context and, in autocomplete mode, wraps the root in Base UI's filter provider.
 * @remarks Only for internal usage.
 */
export function MenuFilter({
  autocomplete,
  autocompleteMode,
  inputValue,
  shownInputValue,
  openedByHover,
  onInputValueChange,
  parent,
  children
}: MenuContextValue & {
  shownInputValue?: string;
  onInputValueChange: (
    value: string,
    eventDetails: MenuPrimitive.FilterProvider.ChangeEventDetails
  ) => void;
  children: ReactNode;
}) {
  return (
    <MenuContext
      value={{
        autocomplete,
        autocompleteMode,
        inputValue: shownInputValue,
        openedByHover,
        parent
      }}
    >
      {autocomplete ? (
        <MenuPrimitive.FilterProvider
          value={inputValue}
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
}

export interface AutocompleteMenuRootProps extends MenuPrimitive.Root.Props {
  autocomplete: true;
  autocompleteMode?: 'auto' | 'manual';
  inputValue?: string;
  onInputValueChange?: (
    value: string,
    eventDetails: MenuPrimitive.FilterProvider.ChangeEventDetails
  ) => void;
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
  const search = useMenuInputValue({
    inputValue: providedInputValue,
    defaultInputValue,
    onInputValueChange,
    name: 'Menu',
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
      <MenuPrimitive.Root
        loopFocus={false}
        modal
        {...props}
        onOpenChange={search.onOpenChange}
        onOpenChangeComplete={search.onOpenChangeComplete}
      />
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
  onInputValueChange?: (
    value: string,
    eventDetails: MenuPrimitive.FilterProvider.ChangeEventDetails
  ) => void;
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
  const search = useMenuInputValue({
    inputValue: providedInputValue,
    defaultInputValue,
    onInputValueChange,
    name: 'Menu.Submenu',
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
      <MenuPrimitive.SubmenuRoot
        loopFocus={false}
        {...props}
        onOpenChange={search.onOpenChange}
        onOpenChangeComplete={search.onOpenChangeComplete}
      />
    </MenuFilter>
  );
};
MenuSubMenu.displayName = 'Menu.Submenu';
