'use client';

import {
  Autocomplete as AutocompletePrimitive,
  Menu as MenuPrimitive
} from '@base-ui/react';
import { createChangeEventDetails } from '@base-ui/react/internals/createBaseUIEventDetails';
import { REASONS } from '@base-ui/react/internals/reasons';
import { useControlled } from '@base-ui/utils/useControlled';
import { createContext, useCallback, useContext, useRef } from 'react';

interface CommonProps {
  autocomplete?: boolean;
  autocompleteMode?: 'auto' | 'manual';
  inputValue?: string;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  contentRef?: React.RefObject<HTMLDivElement | null>;
  isInitialRender?: React.RefObject<boolean>;
  open?: boolean;
}

interface MenuContextValue extends CommonProps {
  parent?: CommonProps;
  onInputValueChange?: (
    value: string,
    eventDetails: AutocompletePrimitive.Root.ChangeEventDetails
  ) => void;
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
    context?.inputValue?.length
  );

  const shouldFilterParent = !!(
    context?.parent?.autocomplete &&
    context?.parent?.autocompleteMode === 'auto' &&
    context?.parent?.inputValue?.length
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
  inputValue?: never;
  onInputValueChange?: never;
  defaultInputValue?: never;
}

export interface AutocompleteMenuRootProps
  extends MenuPrimitive.Root.Props,
    CommonProps {
  autocomplete: true;
  onInputValueChange?: (
    value: string,
    eventDetails: AutocompletePrimitive.Root.ChangeEventDetails
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
  open: providedOpen,
  onOpenChange,
  defaultOpen = false,
  ...props
}: MenuRootProps) => {
  const [inputValue, setInputValueUnwrapped] = useControlled({
    controlled: providedInputValue,
    default: defaultInputValue,
    name: 'Menu',
    state: 'inputValue'
  });
  const [open, setOpenUnwrapped] = useControlled({
    controlled: providedOpen,
    default: defaultOpen,
    name: 'Menu',
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
      setInputValueUnwrapped(value);
      onInputValueChange?.(value, eventDetails);
    },
    [onInputValueChange, setInputValueUnwrapped]
  );

  const handleOpenChange: MenuPrimitive.Root.Props['onOpenChange'] =
    useCallback(
      (value: boolean, eventDetails: MenuPrimitive.Root.ChangeEventDetails) => {
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
      <MenuPrimitive.Root
        open={open}
        onOpenChange={handleOpenChange}
        loopFocus={false}
        modal
        {...props}
      />
    </MenuContext>
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
    eventDetails: AutocompletePrimitive.Root.ChangeEventDetails
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
  open: providedOpen,
  onOpenChange,
  defaultOpen = false,
  ...props
}: MenuSubMenuProps) => {
  const [inputValue, setInputValueUnwrapped] = useControlled({
    controlled: providedInputValue,
    default: defaultInputValue,
    name: 'Menu.Submenu',
    state: 'inputValue'
  });
  const [open, setOpenUnwrapped] = useControlled({
    controlled: providedOpen,
    default: defaultOpen,
    name: 'Menu.Submenu',
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
      setInputValueUnwrapped(value);
      onInputValueChange?.(value, eventDetails);
    },
    [onInputValueChange, setInputValueUnwrapped]
  );

  const handleOpenChange: MenuPrimitive.Root.Props['onOpenChange'] =
    useCallback(
      (value: boolean, eventDetails: MenuPrimitive.Root.ChangeEventDetails) => {
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
      <MenuPrimitive.SubmenuRoot
        loopFocus={false}
        open={open}
        onOpenChange={handleOpenChange}
        {...props}
      />
    </MenuContext>
  );
};
MenuSubMenu.displayName = 'Menu.Submenu';
