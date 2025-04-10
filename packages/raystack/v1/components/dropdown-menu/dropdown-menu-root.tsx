import {
  ComponentProps,
  createContext,
  forwardRef,
  useContext,
  useState,
} from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { ComboboxProvider } from "@ariakit/react";

interface DropdownContextValue {
  autocomplete?: boolean;
  searchValue?: string;
}
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

type DropdownMenuProps = ComponentProps<typeof DropdownMenuPrimitive.Root> & {
  autocomplete?: boolean;
};

export function DropdownMenuRoot({
  children,
  autocomplete = false,
  defaultOpen = false,
  open,
  onOpenChange,
  ...props
}: DropdownMenuProps) {
  const [searchValue, setSearchValue] = useState("");
  const [internalOpen, setInternalOpen] = useState(defaultOpen);

  const computedOpen = open ?? internalOpen;

  const setOpen = (value: boolean) => {
    if (typeof onOpenChange === "function") onOpenChange(value);
    else setInternalOpen(value);
  };

  return (
    <DropdownContext.Provider value={{ autocomplete, searchValue }}>
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

export const DropdownMenuSubMenu = forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Sub>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Sub>
>(({ children, ...props }, ref) => {
  const menuLevel = useMenuLevel();
  return (
    <DropdownMenuPrimitive.Sub {...props}>
      <MenuLevelContext.Provider value={menuLevel + 1}>
        {children}
      </MenuLevelContext.Provider>
    </DropdownMenuPrimitive.Sub>
  );
});
DropdownMenuSubMenu.displayName = DropdownMenuPrimitive.Sub.displayName;
