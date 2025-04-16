import {
  ComponentProps,
  createContext,
  ElementRef,
  forwardRef,
  useContext,
  useState,
} from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { ComboboxProvider } from "@ariakit/react";

interface DropdownContextValue {
  autocomplete?: boolean;
  parentHasAutocomplete?: boolean;
  searchValue?: string;
  parentSearchValue?: string;
}

interface DropdownState {
  open: boolean;
  searchValue: string;
}

interface UseDropdownStateProps {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultSearchValue?: string;
}

const useDropdownState = ({
  defaultOpen = false,
  open,
  onOpenChange,
  defaultSearchValue = "",
}: UseDropdownStateProps) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [searchValue, setSearchValue] = useState(defaultSearchValue);

  const computedOpen = open ?? internalOpen;

  const setOpen = (value: boolean) => {
    if (typeof onOpenChange === "function") onOpenChange(value);
    else setInternalOpen(value);
  };

  return {
    open: computedOpen,
    setOpen,
    searchValue,
    setSearchValue,
  };
};

/*
Root context to manage the Dropdown control
@remarks Only for internal usage.
*/
export const DropdownContext = createContext<DropdownContextValue | undefined>(
  undefined,
);

export const useDropdownContext = () => {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error(
      "useDropdownContext must be used within a DropdownMenuProvider",
    );
  }
  return context;
};

/*
Context to determine the level of Menu
@remarks Only for internal usage.
*/
export const MenuLevelContext = createContext(1);

export const useMenuLevel = () => useContext(MenuLevelContext);

type DropdownCommonProps = {
  autocomplete?: boolean;
};

type DropdownMenuProps = ComponentProps<typeof DropdownMenuPrimitive.Root> &
  DropdownCommonProps;

export function DropdownMenuRoot({
  children,
  autocomplete = false,
  defaultOpen = false,
  open,
  onOpenChange,
  ...props
}: DropdownMenuProps) {
  const {
    open: computedOpen,
    setOpen,
    searchValue,
    setSearchValue,
  } = useDropdownState({
    defaultOpen,
    open,
    onOpenChange,
  });

  return (
    <DropdownContext.Provider
      value={{ autocomplete, searchValue, parentHasAutocomplete: false }}>
      <DropdownMenuPrimitive.Root
        {...props}
        open={computedOpen}
        onOpenChange={setOpen}>
        <MenuLevelContext.Provider value={1}>
          {autocomplete ? (
            <ComboboxProvider
              open={computedOpen}
              setOpen={setOpen}
              resetValueOnHide
              includesBaseElement={false}
              setValue={setSearchValue}>
              {children}
            </ComboboxProvider>
          ) : (
            children
          )}
        </MenuLevelContext.Provider>
      </DropdownMenuPrimitive.Root>
    </DropdownContext.Provider>
  );
}

type DropdownSubMenuProps = Omit<
  ComponentProps<typeof DropdownMenuPrimitive.Sub>,
  "ref"
> &
  DropdownCommonProps;

export const DropdownMenuSubMenu = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.Sub>,
  DropdownSubMenuProps
>(
  (
    {
      children,
      autocomplete = false,
      defaultOpen = false,
      open,
      onOpenChange,
      ...props
    },
    ref,
  ) => {
    const menuLevel = useMenuLevel();
    const {
      autocomplete: parentHasAutocomplete,
      searchValue: parentSearchValue,
    } = useDropdownContext();

    const {
      open: computedOpen,
      setOpen,
      searchValue,
      setSearchValue,
    } = useDropdownState({
      defaultOpen,
      open,
      onOpenChange,
    });

    return (
      <DropdownContext.Provider
        value={{
          autocomplete,
          searchValue,
          parentHasAutocomplete,
          parentSearchValue,
        }}>
        <DropdownMenuPrimitive.Sub
          {...props}
          ref={ref}
          open={computedOpen}
          onOpenChange={setOpen}>
          <MenuLevelContext.Provider value={menuLevel + 1}>
            {autocomplete ? (
              <ComboboxProvider
                open={computedOpen}
                setOpen={setOpen}
                resetValueOnHide
                includesBaseElement={false}
                setValue={setSearchValue}>
                {children}
              </ComboboxProvider>
            ) : (
              children
            )}
          </MenuLevelContext.Provider>
        </DropdownMenuPrimitive.Sub>
      </DropdownContext.Provider>
    );
  },
);

DropdownMenuSubMenu.displayName = DropdownMenuPrimitive.Sub.displayName;
