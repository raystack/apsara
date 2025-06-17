import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { VariantProps, cva, cx } from 'class-variance-authority';
import { CSSProperties, ReactNode, useId, useMemo } from 'react';
import { useMouse } from '~/hooks';
import { Text } from '../text';
import styles from './tooltip.module.css';
import { getTransformForPlacement } from './utils';

const tooltip = cva(styles.content, {
  variants: {
    side: {
      top: styles['side-top'],
      right: styles['side-right'],
      bottom: styles['side-bottom'],
      left: styles['side-left'],
      'top-left': styles['side-top-left'],
      'top-right': styles['side-top-right'],
      'bottom-left': styles['side-bottom-left'],
      'bottom-right': styles['side-bottom-right']
    }
  },
  defaultVariants: {
    side: 'top'
  }
});

interface TooltipProps extends VariantProps<typeof tooltip> {
  disabled?: boolean;
  children: ReactNode;
  message: ReactNode;
  classNames?: {
    trigger?: string;
    content?: string;
    arrow?: string;
  };
  triggerStyle?: CSSProperties;
  contentStyle?: CSSProperties;
  delayDuration?: number;
  skipDelayDuration?: number;
  'aria-label'?: string;
  asChild?: boolean;
  id?: string;
  showArrow?: boolean;
  followCursor?: boolean;
  sideOffset?: number;
  alignOffset?: number;
}
type TooltipSide = NonNullable<TooltipPrimitive.TooltipContentProps['side']>;
type TooltipAlign = NonNullable<TooltipPrimitive.TooltipContentProps['align']>;

export const Tooltip = ({
  children,
  message,
  disabled,
  side = 'top',
  classNames,
  triggerStyle,
  contentStyle,
  delayDuration = 200,
  skipDelayDuration = 200,
  'aria-label': ariaLabel,
  asChild = true,
  showArrow = true,
  id,
  followCursor = false,
  sideOffset = 4,
  alignOffset = 0
}: TooltipProps) => {
  const generatedId = useId();
  const tooltipId = id ?? generatedId;
  const {
    ref,
    value: mouseValue,
    reset
  } = useMouse<HTMLDivElement>({
    resetOnExit: false,
    enabled: followCursor
  });

  const computedSide = useMemo(
    () => (side?.split('-')[0] || 'top') as TooltipSide,
    [side]
  );
  const computedAlign = useMemo(
    () =>
      (side?.includes('-')
        ? side.split('-')[1] === 'left'
          ? 'start'
          : 'end'
        : 'center') as TooltipAlign,
    [side]
  );

  if (disabled) return children;

  return (
    <TooltipPrimitive.Provider
      delayDuration={delayDuration}
      skipDelayDuration={skipDelayDuration}
    >
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger
          aria-describedby={tooltipId}
          asChild={asChild}
          onFocus={followCursor ? reset : undefined}
        >
          <div
            ref={ref}
            className={cx(styles.trigger, classNames?.trigger)}
            style={triggerStyle}
          >
            {children}
          </div>
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            id={tooltipId}
            role='tooltip'
            aria-label={
              ariaLabel || (typeof message === 'string' ? message : undefined)
            }
            side={computedSide}
            align={computedAlign}
            alignOffset={alignOffset}
            sideOffset={sideOffset}
            className={tooltip({ side, className: classNames?.content })}
            data-follow-cursor={followCursor}
            style={{
              ...contentStyle,
              pointerEvents: followCursor ? 'none' : undefined,
              transform:
                followCursor && mouseValue
                  ? getTransformForPlacement(
                      computedSide,
                      computedAlign,
                      mouseValue
                    )
                  : undefined
            }}
          >
            {typeof message === 'string' ? <Text>{message}</Text> : message}
            {showArrow && (
              <TooltipPrimitive.Arrow
                className={cx(styles.arrow, classNames?.arrow)}
                width={7}
                height={7}
              />
            )}
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
};

Tooltip.displayName = 'Tooltip';

export const TooltipProvider = TooltipPrimitive.Provider;
