import {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
  useRef,
} from "react";
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
  const comboboxRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);
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
              // ref={inputRef}
              autoSelect
              autoFocus
              placeholder="Search..."
              className={styles.comboboxInput}
              onBlurCapture={event => {
                event.preventDefault();
                event.stopPropagation();
              }}
              // onMouseOver={event => {
              //   if (document.activeElement !== inputRef.current)
              //     inputRef.current?.focus();
              // }}
            />
            <ComboboxList className={styles.comboboxContent} ref={listboxRef}>
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
>(({ className, children, ...props }, ref) => {
  const { autocomplete } = useDropdownContext();
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.SubContent
        ref={ref}
        className={cx(
          styles.content,
          autocomplete && styles.comboboxContainer,
          className,
        )}
        {...props}>
        {autocomplete ? (
          <>
            <Combobox
              ref={inputRef}
              autoSelect
              // autoFocus
              placeholder="Search..."
              className={styles.comboboxInput}
              onBlurCapture={event => {
                console.log("blur");
                event.preventDefault();
                event.stopPropagation();
              }}
              onMouseOver={event => {
                if (document.activeElement !== inputRef.current)
                  inputRef.current?.focus();
              }}
            />
            <ComboboxList className={styles.comboboxContent}>
              {children}
            </ComboboxList>
          </>
        ) : (
          children
        )}
      </DropdownMenuPrimitive.SubContent>
    </DropdownMenuPrimitive.Portal>
  );
});
DropdownMenuSubMenuContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName;
