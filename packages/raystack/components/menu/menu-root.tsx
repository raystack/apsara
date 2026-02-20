'use client';

import { Menu as MenuPrimitive } from '@base-ui/react';
import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState
} from 'react';

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
  onInputValueChange?: (value: string) => void;
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
  open: providedOpen,
  onOpenChange,
  defaultOpen = false,
  ...props
}: MenuRootProps) => {
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

  const handleOpenChange: MenuPrimitive.Root.Props['onOpenChange'] =
    useCallback(
      (value: boolean, eventDetails: MenuPrimitive.Root.ChangeEventDetails) => {
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
      <MenuPrimitive.Root
        open={open}
        onOpenChange={handleOpenChange}
        loopFocus={false}
        modal
        {...props}
      />
    </MenuContext.Provider>
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
  open: providedOpen,
  onOpenChange,
  defaultOpen = false,
  ...props
}: MenuSubMenuProps) => {
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

  const handleOpenChange: MenuPrimitive.Root.Props['onOpenChange'] =
    useCallback(
      (value: boolean, eventDetails: MenuPrimitive.Root.ChangeEventDetails) => {
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
      <MenuPrimitive.SubmenuRoot
        loopFocus={false}
        open={open}
        onOpenChange={handleOpenChange}
        {...props}
      />
    </MenuContext.Provider>
  );
};
MenuSubMenu.displayName = 'Menu.SubMenu';
