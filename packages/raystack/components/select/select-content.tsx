import { Combobox, ComboboxList } from '@ariakit/react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Slot } from '@radix-ui/react-slot';
import { cx } from 'class-variance-authority';
import { ElementRef, forwardRef, useCallback } from 'react';
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
      onEscapeKeyDown: providedOnEscapeKeyDown,
      onPointerDownOutside: providedOnPointerDownOutside,
      ...props
    },
    ref
  ) => {
    const { autocomplete, multiple, updateSelectionInProgress } =
      useSelectContext();

    const onPointerDownOutside = useCallback<
      NonNullable<SelectContentProps['onPointerDownOutside']>
    >(
      event => {
        updateSelectionInProgress(false);
        providedOnPointerDownOutside?.(event);
      },
      [updateSelectionInProgress, providedOnPointerDownOutside]
    );

    const onEscapeKeyDown = useCallback<
      NonNullable<SelectContentProps['onEscapeKeyDown']>
    >(
      event => {
        updateSelectionInProgress(false);
        providedOnEscapeKeyDown?.(event);
      },
      [updateSelectionInProgress, providedOnEscapeKeyDown]
    );

    return (
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          ref={ref}
          position={position}
          sideOffset={sideOffset}
          className={cx(styles.content, className)}
          onEscapeKeyDown={multiple ? onEscapeKeyDown : providedOnEscapeKeyDown}
          onPointerDownOutside={
            multiple ? onPointerDownOutside : providedOnPointerDownOutside
          }
          role={autocomplete ? 'dialog' : 'listbox'}
          aria-multiselectable={!autocomplete && multiple ? true : undefined}
          data-multiselectable={multiple ? true : undefined}
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
                  aria-multiselectable={multiple ? true : undefined}
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
