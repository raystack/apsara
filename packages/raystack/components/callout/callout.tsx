'use client';

import { InfoCircledIcon } from '@radix-ui/react-icons';
import { cva, type VariantProps } from 'class-variance-authority';
import {
  type ComponentProps,
  type CSSProperties,
  type ReactNode,
  useState
} from 'react';

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
    outline: {
      true: styles['callout-outline']
    },
    highContrast: {
      true: styles['callout-high-contrast']
    }
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
  width?: string | number;
  style?: CSSProperties;
  icon?: ReactNode;
}

export function Callout({
  className,
  type = 'grey',
  outline,
  highContrast,
  children,
  action,
  dismissible,
  onDismiss,
  width,
  style,
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

  // Resolve up front so `width={0}` is kept (a `width && …` guard would drop it).
  const resolvedWidth = typeof width === 'number' ? `${width}px` : width;
  const combinedStyle = {
    ...style,
    width: resolvedWidth ?? style?.width
  };

  const role = type === 'alert' ? 'alert' : 'status';

  return (
    <div
      className={callout({ type, outline, highContrast, className })}
      style={combinedStyle}
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
            <button
              className={styles.dismiss}
              onClick={handleDismiss}
              aria-label='Dismiss message'
              type='button'
            >
              <svg
                width='12'
                height='12'
                viewBox='0 0 12 12'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
                aria-hidden='true'
                role='presentation'
              >
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M9.5066 3.3066C9.73115 3.08205 9.73115 2.71798 9.5066 2.49343C9.28205 2.26887 8.91798 2.26887 8.69343 2.49343L6.00001 5.18684L3.3066 2.49343C3.08205 2.26887 2.71798 2.26887 2.49343 2.49343C2.26887 2.71798 2.26887 3.08205 2.49343 3.3066L5.18684 6.00001L2.49343 8.69343C2.26887 8.91798 2.26887 9.28205 2.49343 9.5066C2.71798 9.73115 3.08205 9.73115 3.3066 9.5066L6.00001 6.81318L8.69343 9.5066C8.91798 9.73115 9.28205 9.73115 9.5066 9.5066C9.73115 9.28205 9.73115 8.91798 9.5066 8.69343L6.81318 6.00001L9.5066 3.3066Z'
                  fill='currentColor'
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

Callout.displayName = 'Callout';
