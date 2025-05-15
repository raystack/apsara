import { ElementRef, forwardRef } from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Combobox, ComboboxList } from "@ariakit/react";
import { cx } from "class-variance-authority";
import styles from "./select.module.css";
import { useSelectContext } from "./select-root";

export interface SelectContentProps extends SelectPrimitive.SelectContentProps {
  searchPlaceholder?: string;
}

export const SelectContent = forwardRef<
  ElementRef<typeof SelectPrimitive.Content>,
  SelectContentProps
>(
  (
    {
      className,
      children,
      position = "popper",
      searchPlaceholder = "Search...",
      ...props
    },
    ref,
  ) => {
    const { autocomplete } = useSelectContext();

    return (
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          role={autocomplete ? "dialog" : undefined}
          ref={ref}
          className={cx(
            styles.content,
            autocomplete && styles.comboboxContainer,
            className,
          )}
          position={position}
          {...props}>
          <SelectPrimitive.Viewport>
            {autocomplete ? (
              <>
                <Combobox
                  autoSelect
                  placeholder={searchPlaceholder}
                  className={styles.comboboxInput}
                  onBlurCapture={event => {
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
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    );
  },
);
SelectContent.displayName = SelectPrimitive.Content.displayName;
