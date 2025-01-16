import * as React from 'react';
import { type ComponentPropsWithoutRef, type ComponentRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { InfoCircledIcon } from '@radix-ui/react-icons';
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
      normal: styles['callout-normal'],
    },
    outline: {
      true: styles['callout-outline'],
    },
    highContrast: {
      true: styles['callout-high-contrast'],
    },
  },
  defaultVariants: {
    type: 'grey',
  },
});

export interface CalloutProps extends ComponentPropsWithoutRef<'div'>, VariantProps<typeof callout> {
  children: React.ReactNode;
  action?: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  width?: string | number;
}

export const Callout = ({ 
  className,
  type = 'grey',
  outline,
  highContrast,
  children,
  action,
  dismissible,
  onDismiss,
  width,
  ref,
  ...props
}: CalloutProps & { ref?: React.Ref<ComponentRef<'div'>> }) => {
  const style = width ? { width: typeof width === 'number' ? `${width}px` : width } : undefined;

  const getRole = () => {
    switch (type) {
      case 'alert':
        return 'alert';
      case 'success':
        return 'status';
      default:
        return 'status';
    }
  };

  return (
    <div
      ref={ref}
      className={`${callout({ type, outline, highContrast })} ${className || ''}`}
      style={style}
      role={getRole()}
      aria-live={type === 'alert' ? 'assertive' : 'polite'}
      {...props}
    >
      <div className={styles.container}>
        <div className={styles.messageContainer}>
          <InfoCircledIcon 
            className={styles.icon} 
            aria-hidden="true"
          />
          <div className={styles.message}>{children}</div>
        </div>
        
        <div className={styles.actionsContainer}>
          {action && (
            <div className={styles.action}>
              {action}
            </div>
          )}
          {dismissible && (
            <button 
              className={styles.dismiss} 
              onClick={onDismiss}
              aria-label="Dismiss message"
              type="button"
            >
              <svg 
                width="12" 
                height="12" 
                viewBox="0 0 12 12" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                role="presentation"
              >
                <path 
                  fillRule="evenodd" 
                  clipRule="evenodd" 
                  d="M9.5066 3.3066C9.73115 3.08205 9.73115 2.71798 9.5066 2.49343C9.28205 2.26887 8.91798 2.26887 8.69343 2.49343L6.00001 5.18684L3.3066 2.49343C3.08205 2.26887 2.71798 2.26887 2.49343 2.49343C2.26887 2.71798 2.26887 3.08205 2.49343 3.3066L5.18684 6.00001L2.49343 8.69343C2.26887 8.91798 2.26887 9.28205 2.49343 9.5066C2.71798 9.73115 3.08205 9.73115 3.3066 9.5066L6.00001 6.81318L8.69343 9.5066C8.91798 9.73115 9.28205 9.73115 9.5066 9.5066C9.73115 9.28205 9.73115 8.91798 9.5066 8.69343L6.81318 6.00001L9.5066 3.3066Z" 
                  fill="currentColor"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

Callout.displayName = 'Callout';