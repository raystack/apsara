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
      sideOffset = 4,
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
          position={position}
          sideOffset={sideOffset}
          className={cx(styles.content, className)}
          {...props}>
          <SelectPrimitive.Viewport
            className={cx(
              styles.viewport,
              autocomplete && styles.comboboxViewport,
            )}>
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
