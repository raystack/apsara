import { cx } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import styles from './arrow.module.css';

/** The arrow of a popup. Pass it to the `render` prop of a Base UI `Arrow` part. */
export function Arrow({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div {...props} className={cx(styles.arrow, className)}>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='6'
        height='7'
        viewBox='0 0 6 7'
        fill='none'
      >
        <path
          d='M2.90809 6.78553L0 0H6L3.09191 6.78553C3.05728 6.86634 2.94272 6.86634 2.90809 6.78553Z'
          fill='currentColor'
        />
      </svg>
    </div>
  );
}
