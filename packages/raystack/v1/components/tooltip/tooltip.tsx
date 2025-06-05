import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { VariantProps, cva, cx } from 'class-variance-authority';
import React, { useId } from 'react';
import { useMouse } from '~/v1/hooks';
import { Text } from '../text';
import styles from './tooltip.module.css';

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
  children: React.ReactNode;
  message: React.ReactNode;
  classNames?: {
    trigger?: string;
    content?: string;
    arrow?: string;
  };
  triggerStyle?: React.CSSProperties;
  contentStyle?: React.CSSProperties;
  delayDuration?: number;
  skipDelayDuration?: number;
  'aria-label'?: string;
  asChild?: boolean;
  showArrow?: boolean;
  followCursor?: boolean;
  sideOffset?: number;
  alignOffset?: number;
  id?: string;
}

interface MousePosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

type TooltipSide = NonNullable<TooltipPrimitive.TooltipContentProps['side']>;
type TooltipAlign = NonNullable<TooltipPrimitive.TooltipContentProps['align']>;
type Placement = `${TooltipSide}-${TooltipAlign}`;

const getTransformForPlacement = (
  placement: Placement,
  { x, y, width, height }: MousePosition
): string => {
  const [side, align] = placement.split('-') as [TooltipSide, TooltipAlign];

  const transforms: Record<TooltipSide, Record<TooltipAlign, string>> = {
    top: {
      start: `translate(${x}px, ${y}px)`,
      center: `translate(${x - width / 2}px, ${y}px)`,
      end: `translate(${x - width}px, ${y}px)`
    },
    bottom: {
      start: `translate(${x}px, ${y - height}px)`,
      center: `translate(${x - width / 2}px, ${y - height}px)`,
      end: `translate(${x - width}px, ${y - height}px)`
    },
    left: {
      start: `translate(${x}px, ${y}px)`,
      center: `translate(${x}px, ${y - height / 2}px)`,
      end: `translate(${x}px, ${y - height}px)`
    },
    right: {
      start: `translate(${x - width}px, ${y}px)`,
      center: `translate(${x - width}px, ${y - height / 2}px)`,
      end: `translate(${x - width}px, ${y - height}px)`
    }
  };

  return transforms[side][align];
};

export const Tooltip: React.FC<TooltipProps> = ({
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
  sideOffset = 0,
  alignOffset = 0
}) => {
  const generatedId = useId();
  const tooltipId = id ?? generatedId;
  const { ref, value, reset } = useMouse<HTMLDivElement>({
    resetOnExit: false
  });

  if (disabled) return children;

  const computedSide = (side?.split('-')[0] as TooltipSide) || 'top';
  const computedAlign = (
    side?.includes('-')
      ? side.split('-')[1] === 'left'
        ? 'start'
        : 'end'
      : 'center'
  ) satisfies 'start' | 'end' | 'center';

  const placement = `${computedSide}-${computedAlign}` as Placement;

  return (
    <TooltipPrimitive.Provider
      delayDuration={delayDuration}
      skipDelayDuration={skipDelayDuration}
    >
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger
          aria-describedby='tooltip'
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
                followCursor && value
                  ? getTransformForPlacement(placement, value)
                  : undefined
            }}
          >
            {typeof message === 'string' ? <Text>{message}</Text> : message}
            {showArrow && (
              <TooltipPrimitive.Arrow
                className={cx(styles.arrow, classNames?.arrow)}
                width={12}
                height={6}
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
