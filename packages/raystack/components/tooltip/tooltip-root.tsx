'use client';

import { VariantProps, cva, cx } from 'class-variance-authority';
import { Tooltip as TooltipPrimitive } from 'radix-ui';
import { CSSProperties, ReactNode, useId, useMemo } from 'react';
import { useMouse } from '~/hooks';
import { Text } from '../text';
import { TooltipProvider, useTooltipProvider } from './tooltip-provider';
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

export interface TooltipProps
  extends TooltipPrimitive.TooltipProps,
    Omit<TooltipPrimitive.TooltipContentProps, 'side' | 'align'>,
    VariantProps<typeof tooltip> {
  disabled?: boolean;
  message: ReactNode;
  classNames?: {
    trigger?: string;
    content?: string;
    arrow?: string;
  };
  triggerStyle?: CSSProperties;
  contentStyle?: CSSProperties;
  'aria-label'?: string;
  asChild?: boolean;
  id?: string;
  showArrow?: boolean;
  followCursor?: boolean;
}
type TooltipSide = NonNullable<TooltipPrimitive.TooltipContentProps['side']>;
type TooltipAlign = NonNullable<TooltipPrimitive.TooltipContentProps['align']>;

export const TooltipBase = ({
  children,
  message,
  disabled,
  side = 'top',
  classNames,
  triggerStyle,
  contentStyle,
  'aria-label': ariaLabel,
  asChild = true,
  showArrow = true,
  id,
  followCursor = false,
  sideOffset = 4,
  alignOffset = 0,
  open,
  defaultOpen,
  delayDuration = 200,
  onOpenChange,
  disableHoverableContent,
  ...props
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
    <TooltipPrimitive.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      delayDuration={delayDuration}
      disableHoverableContent={disableHoverableContent}
    >
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
          {...props}
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
  );
};

export const TooltipRoot = (props: TooltipProps) => {
  const provider = useTooltipProvider();

  // If already inside a provider, just return the tooltip
  if (provider) return <TooltipBase {...props} />;

  // If not inside a provider, wrap with our own provider
  return (
    <TooltipProvider>
      <TooltipBase {...props} />
    </TooltipProvider>
  );
};

TooltipRoot.displayName = 'TooltipRoot';
