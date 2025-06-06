import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { VariantProps, cva, cx } from 'class-variance-authority';
import React, { useId } from 'react';
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
  id?: string;
  showArrow?: boolean;
}

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
  id
}) => {
  const generatedId = useId();
  const tooltipId = id ?? generatedId;

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
        >
          <div
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
            side={
              (side?.split(
                '-'
              )[0] as TooltipPrimitive.TooltipContentProps['side']) || 'top'
            }
            align={
              (side?.includes('-')
                ? side.split('-')[1] === 'left'
                  ? 'start'
                  : 'end'
                : 'center') satisfies 'start' | 'end' | 'center'
            }
            sideOffset={4}
            className={tooltip({ side, className: classNames?.content })}
            style={contentStyle}
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
