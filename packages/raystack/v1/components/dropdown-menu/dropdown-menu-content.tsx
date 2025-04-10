import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Combobox, ComboboxList } from "@ariakit/react";
import { cx } from "class-variance-authority";
import { useDropdownContext } from "./dropdown-menu-root";
import styles from "./dropdown-menu.module.css";

export const DropdownMenuContent = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.Content>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, children, sideOffset = 4, ...props }, ref) => {
  const { autocomplete } = useDropdownContext();
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cx(
          styles.content,
          autocomplete && styles.comboboxContainer,
          className,
        )}
        {...props}>
        {autocomplete ? (
          <>
            <Combobox
              autoSelect
              autoFocus
              placeholder="Search..."
              className={styles.comboboxInput}
              onBlurCapture={event => {
                event.preventDefault();
                event.stopPropagation();
              }}
              onMouseOver={event => {
                event.preventDefault();
                event.stopPropagation();
              }}
            />
            <ComboboxList className={styles.comboboxContent}>
              {children}
            </ComboboxList>
          </>
        ) : (
          children
        )}
      </DropdownMenuPrimitive.Content>
    </DropdownMenuPrimitive.Portal>
  );
});
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

export const DropdownMenuSubMenuContent = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.Content>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.SubContent
      ref={ref}
      className={cx(styles.content, className)}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
));
DropdownMenuSubMenuContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName;
