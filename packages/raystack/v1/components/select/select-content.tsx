import { Combobox, ComboboxList } from '@ariakit/react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Slot } from '@radix-ui/react-slot';
import { cx } from 'class-variance-authority';
import { ElementRef, forwardRef } from 'react';
import { useSelectContext } from './select-root';
import styles from './select.module.css';

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
      position = 'popper',
      searchPlaceholder = 'Search...',
      sideOffset = 4,
      asChild,
      ...props
    },
    ref
  ) => {
    const { autocomplete } = useSelectContext();

    return (
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          role={autocomplete ? 'dialog' : undefined}
          ref={ref}
          position={position}
          sideOffset={sideOffset}
          className={cx(styles.content, className)}
          {...props}
        >
          <SelectPrimitive.Viewport
            className={cx(
              styles.viewport,
              autocomplete && styles.comboboxViewport
            )}
            asChild={!autocomplete ? asChild : undefined}
          >
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
                <ComboboxList
                  className={styles.comboboxContent}
                  render={asChild ? <Slot /> : undefined}
                >
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
  }
);
SelectContent.displayName = SelectPrimitive.Content.displayName;
