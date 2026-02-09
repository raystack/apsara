'use client';

import { Tooltip as TooltipPrimitive } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import { type ElementRef, forwardRef } from 'react';
import { Text } from '../text';
import styles from './tooltip.module.css';

export interface TooltipContentProps
  extends Omit<
      TooltipPrimitive.Positioner.Props,
      'className' | 'style' | 'render'
    >,
    TooltipPrimitive.Popup.Props {
  /**
   * Controls whether to show the arrow
   * @default true
   */
  showArrow?: boolean;
}

export const TooltipContent = forwardRef<
  ElementRef<typeof TooltipPrimitive.Popup>,
  TooltipContentProps
>(
  (
    {
      className,
      children,
      showArrow = false,
      style,
      render,
      ...positionerProps
    },
    ref
  ) => {
    return (
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Positioner
          side='top'
          align='center'
          sideOffset={showArrow ? 10 : 4}
          className={styles.positioner}
          {...positionerProps}
        >
          <TooltipPrimitive.Popup
            ref={ref}
            className={cx(styles.content, className)}
            style={style}
            render={render}
          >
            {typeof children === 'string' ? <Text>{children}</Text> : children}
            {showArrow && (
              <TooltipPrimitive.Arrow className={styles.arrow}>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='6'
                  height='7'
                  viewBox='0 0 6 7'
                  fill='none'
                >
                  <path
                    d='M2.90809 6.78553L0 0H6L3.09191 6.78553C3.05728 6.86634 2.94272 6.86634 2.90809 6.78553Z'
                    fill='currentColor'
                  />
                </svg>
              </TooltipPrimitive.Arrow>
            )}
          </TooltipPrimitive.Popup>
        </TooltipPrimitive.Positioner>
      </TooltipPrimitive.Portal>
    );
  }
);

TooltipContent.displayName = 'Tooltip.Content';
