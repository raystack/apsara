'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import {
  type ComponentProps,
  type CSSProperties,
  type ReactNode,
  useEffect,
  useState
} from 'react';
import { InfoIcon, XIcon } from '~/icons';
import { radiusVariants } from '../../shared/radius';
import { IconButton } from '../icon-button';
import styles from './callout.module.css';

/** Exit duration. Keep in sync with --rs-duration-normal (styles/effects.css:38). */
const EXIT_MS = 200;

const callout = cva(styles.callout, {
  variants: {
    ...radiusVariants,
    color: {
      primary: styles['callout-primary'],
      neutral: styles['callout-neutral'],
      success: styles['callout-success'],
      danger: styles['callout-danger'],
      accent: styles['callout-accent'],
      attention: styles['callout-attention'],
      gradient: styles['callout-gradient']
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
    color: 'neutral',
    variant: 'solid'
  }
});

export interface CalloutProps
  extends Omit<ComponentProps<'div'>, 'color'>,
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
  color,
  variant,
  radius,
  highContrast,
  children,
  action,
  dismissible,
  onDismiss,
  icon = <InfoIcon />,
  ...props
}: CalloutProps) {
  // Dismissal is controlled when `onDismiss` is given; otherwise fall back to
  // uncontrolled: play the exit transition, then unmount.
  const [state, setState] = useState<'open' | 'closing' | 'closed'>('open');

  useEffect(() => {
    if (state !== 'closing') return;
    const timer = setTimeout(() => setState('closed'), EXIT_MS);
    return () => clearTimeout(timer);
  }, [state]);

  const handleDismiss = () => {
    onDismiss?.();
    if (!onDismiss) setState('closing');
  };
  if (state === 'closed') return null;

  const role = color === 'danger' ? 'alert' : 'status';

  return (
    <div
      className={styles.transitionShell}
      data-state={state}
      data-slot='callout-transition'
    >
      <div
        className={styles.transitionBody}
        data-slot='callout-transition-body'
      >
        <div
          className={callout({
            color,
            variant,
            radius,
            highContrast,
            className
          })}
          role={role}
          aria-live={color === 'danger' ? 'assertive' : 'polite'}
          data-slot='callout'
          {...props}
        >
          <div className={styles.container} data-slot='callout-container'>
            <div
              className={styles.messageContainer}
              data-slot='callout-message-container'
            >
              {icon && (
                <div
                  className={styles.icon}
                  aria-hidden='true'
                  data-slot='callout-icon'
                >
                  {icon}
                </div>
              )}
              <div className={styles.message} data-slot='callout-message'>
                {children}
              </div>
            </div>

            <div
              className={styles.actionsContainer}
              data-slot='callout-actions'
            >
              {action && (
                <div className={styles.action} data-slot='callout-action'>
                  {action}
                </div>
              )}
              {dismissible && (
                <IconButton
                  size={1}
                  className={styles.dismiss}
                  onClick={handleDismiss}
                  aria-label='Dismiss message'
                  data-slot='callout-dismiss'
                >
                  <XIcon />
                </IconButton>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Callout.displayName = 'Callout';
