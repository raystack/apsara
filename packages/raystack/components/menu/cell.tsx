import { cx } from 'class-variance-authority';
import { ComponentProps, ReactNode } from 'react';
import styles from './cell.module.css';

export type CellBaseProps = {
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
};
export type CellProps = ComponentProps<'div'> &
  CellBaseProps & {
    type?: 'select' | 'item';
  };

export function Cell({
  className,
  children,
  leadingIcon,
  trailingIcon,
  type = 'item',
  ...props
}: CellProps) {
  return (
    <div {...props} className={cx(styles.cell, className)}>
      {leadingIcon && <span className={styles.leadingIcon}>{leadingIcon}</span>}
      {children}
      {trailingIcon && (
        <span className={styles.trailingIcon}>{trailingIcon}</span>
      )}
    </div>
  );
}
Cell.displayName = 'Menu.Cell';
