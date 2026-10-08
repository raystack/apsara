'use client';

import { Tooltip as TooltipPrimitive } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import { ArrowSvg, arrowClassName } from '../../shared/arrow';
import { type Radius, radiusStyle } from '../../shared/radius';
import { Text } from '../text';
import { useThemeInjection } from '../theme/portal';
import styles from './tooltip.module.css';

export interface TooltipContentProps
  extends Omit<
      TooltipPrimitive.Positioner.Props,
      'className' | 'style' | 'render' | 'ref'
    >,
    TooltipPrimitive.Popup.Props {
  /**
   * Controls whether to show the arrow
   * `@default` false
   */
  showArrow?: boolean;
  /** Corner radius for this tooltip only. Overrides the theme's `radius`. */
  radius?: Radius;
}

export function TooltipContent({
  ref,
  className,
  children,
  showArrow = false,
  style,
  render,
  radius,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...positionerProps
}: TooltipContentProps) {
  const theme = useThemeInjection();
  return (
    <TooltipPrimitive.Portal {...theme}>
      <TooltipPrimitive.Positioner
        side='top'
        align='center'
        sideOffset={showArrow ? 10 : 4}
        className={styles.positioner}
        data-slot='tooltip-positioner'
        {...positionerProps}
      >
        <TooltipPrimitive.Popup
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
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          data-slot='tooltip-content'
        >
          {typeof children === 'string' ? (
            <Text size='mini' weight='medium' data-slot='tooltip-text'>
              {children}
            </Text>
          ) : (
            children
          )}
          {showArrow && (
            <TooltipPrimitive.Arrow
              className={arrowClassName}
              data-slot='tooltip-arrow'
            >
              <ArrowSvg />
            </TooltipPrimitive.Arrow>
          )}
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  );
}

TooltipContent.displayName = 'Tooltip.Content';
