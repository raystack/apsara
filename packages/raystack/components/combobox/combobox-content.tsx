'use client';

import { Combobox as ComboboxPrimitive } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import { ElementRef, forwardRef } from 'react';
import styles from './combobox.module.css';
import { useComboboxContext } from './combobox-root';

export interface ComboboxContentProps
  extends Omit<
      ComboboxPrimitive.Positioner.Props,
      'render' | 'className' | 'style'
    >,
    ComboboxPrimitive.Popup.Props {}

export const ComboboxContent = forwardRef<
  ElementRef<typeof ComboboxPrimitive.Popup>,
  ComboboxContentProps
>(
  (
    {
      className,
      children,
      style,
      render,
      initialFocus,
      finalFocus,
      sideOffset = 4,
      ...positionerProps
    },
    ref
  ) => {
    const { inputContainerRef } = useComboboxContext();
    return (
      <ComboboxPrimitive.Portal>
        <ComboboxPrimitive.Positioner
          sideOffset={sideOffset}
          className={styles.positioner}
          anchor={inputContainerRef}
          {...positionerProps}
        >
          <ComboboxPrimitive.Popup
            ref={ref}
            className={cx(styles.content, className)}
            style={style}
            render={render}
            initialFocus={initialFocus}
            finalFocus={finalFocus}
          >
            <ComboboxPrimitive.List className={styles.list}>
              {children}
            </ComboboxPrimitive.List>
          </ComboboxPrimitive.Popup>
        </ComboboxPrimitive.Positioner>
      </ComboboxPrimitive.Portal>
    );
  }
);
ComboboxContent.displayName = 'Combobox.Content';
