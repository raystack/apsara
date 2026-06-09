'use client';

import { Cross1Icon, InfoCircledIcon } from '@radix-ui/react-icons';
import { cva, type VariantProps } from 'class-variance-authority';
import {
  type ComponentProps,
  type CSSProperties,
  type ReactNode,
  useState
} from 'react';

import { IconButton } from '../icon-button';
import styles from './callout.module.css';

const callout = cva(styles.callout, {
  variants: {
    type: {
      grey: styles['callout-grey'],
      success: styles['callout-success'],
      alert: styles['callout-alert'],
      gradient: styles['callout-gradient'],
      accent: styles['callout-accent'],
      attention: styles['callout-attention'],
      normal: styles['callout-normal']
    },
    variant: {
      solid: '',
      outline: styles['callout-outline']
    },
    highContrast: {
      true: styles['callout-high-contrast']
    }
  },
  defaultVariants: {
    variant: 'solid'
  }
});

export interface CalloutProps
  extends ComponentProps<'div'>,
    VariantProps<typeof callout> {
  children: ReactNode;
  action?: ReactNode;
  /** Show a dismiss (close) button. */
  dismissible?: boolean;
  /**
   * Called when the dismiss button is clicked. When provided, the consumer owns
   * removal (the callout stays mounted). When omitted, the callout hides itself.
   */
  onDismiss?: () => void;
  style?: CSSProperties;
  icon?: ReactNode;
}

export function Callout({
  className,
  type = 'grey',
  variant,
  highContrast,
  children,
  action,
  dismissible,
  onDismiss,
  icon = <InfoCircledIcon />,
  ...props
}: CalloutProps) {
  // Dismissal is controlled when `onDismiss` is given; otherwise fall back to
  // uncontrolled and hide the callout internally.
  const [dismissed, setDismissed] = useState(false);
  const handleDismiss = () => {
    onDismiss?.();
    if (!onDismiss) setDismissed(true);
  };
  if (dismissed) return null;

  const role = type === 'alert' ? 'alert' : 'status';

  return (
    <div
      className={callout({ type, variant, highContrast, className })}
      role={role}
      aria-live={type === 'alert' ? 'assertive' : 'polite'}
      {...props}
    >
      <div className={styles.container}>
        <div className={styles.messageContainer}>
          {icon && (
            <div className={styles.icon} aria-hidden='true'>
              {icon}
            </div>
          )}
          <div className={styles.message}>{children}</div>
        </div>

        <div className={styles.actionsContainer}>
          {action && <div className={styles.action}>{action}</div>}
          {dismissible && (
            <IconButton
              size={1}
              className={styles.dismiss}
              onClick={handleDismiss}
              aria-label='Dismiss message'
            >
              <Cross1Icon />
            </IconButton>
          )}
        </div>
      </div>
    </div>
  );
}

Callout.displayName = 'Callout';
