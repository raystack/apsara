'use client';

import { Cross1Icon, InfoCircledIcon } from '@radix-ui/react-icons';
import { cva, type VariantProps } from 'class-variance-authority';
import {
  type ComponentProps,
  type CSSProperties,
  type ReactNode,
  useEffect,
  useState
} from 'react';

import { IconButton } from '../icon-button';
import styles from './callout.module.css';

/** Exit duration. Keep in sync with --rs-duration-normal (styles/effects.css:38). */
const EXIT_MS = 200;

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

  const role = type === 'alert' ? 'alert' : 'status';

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
          className={callout({ type, variant, highContrast, className })}
          role={role}
          aria-live={type === 'alert' ? 'assertive' : 'polite'}
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
                  <Cross1Icon />
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
