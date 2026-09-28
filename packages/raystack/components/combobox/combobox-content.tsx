'use client';

import { Combobox as ComboboxPrimitive } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import { type Radius, radiusStyle } from '../../shared/radius';
import { useThemeInjection } from '../theme/portal';
import styles from './combobox.module.css';
import { useComboboxContext } from './combobox-root';

export interface ComboboxContentProps
  extends Omit<
      ComboboxPrimitive.Positioner.Props,
      'render' | 'className' | 'style'
    >,
    ComboboxPrimitive.Popup.Props {
  /** Corner radius for this popup only. Overrides the theme's `radius`. */
  radius?: Radius;
}

export const ComboboxContent = ({
  ref,
  className,
  children,
  style,
  render,
  initialFocus,
  finalFocus,
  sideOffset = 4,
  radius,
  ...positionerProps
}: ComboboxContentProps) => {
  const { inputContainerRef } = useComboboxContext();
  const theme = useThemeInjection();
  return (
    <ComboboxPrimitive.Portal {...theme}>
      <ComboboxPrimitive.Positioner
        sideOffset={sideOffset}
        className={styles.positioner}
        anchor={inputContainerRef}
        data-slot='combobox-positioner'
        {...positionerProps}
      >
        <ComboboxPrimitive.Popup
          ref={ref}
          {...theme}
          className={cx(
            styles.content,
            theme?.className,
            radiusStyle({ radius }),
            className
          )}
          style={style}
          render={render}
          initialFocus={initialFocus}
          finalFocus={finalFocus}
          data-slot='combobox-content'
        >
          <ComboboxPrimitive.List
            className={styles.list}
            data-slot='combobox-list'
          >
            {children}
          </ComboboxPrimitive.List>
        </ComboboxPrimitive.Popup>
      </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
  );
};
ComboboxContent.displayName = 'Combobox.Content';
