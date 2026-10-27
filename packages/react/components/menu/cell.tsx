import { mergeProps, useRender } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import { ReactNode } from 'react';
import styles from './cell.module.css';

export type CellBaseProps = {
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
};
export type CellProps = useRender.ComponentProps<'div'> &
  CellBaseProps & {
    /** Check or radio mark, rendered in a fixed-width column before the icon. */
    indicator?: ReactNode;
  };

export function Cell({
  className,
  children,
  leadingIcon,
  trailingIcon,
  indicator,
  render,
  ref,
  ...props
}: CellProps) {
  return useRender({
    defaultTagName: 'div',
    ref,
    render,
    props: mergeProps<'div'>(props, {
      className: cx(styles.cell, className),
      children: (
        <>
          {indicator}
          {leadingIcon && (
            <span
              data-slot='menu-cell-leading-icon'
              className={styles.leadingIcon}
            >
              {leadingIcon}
            </span>
          )}
          {children}
          {trailingIcon && (
            <span
              data-slot='menu-cell-trailing-icon'
              className={styles.trailingIcon}
            >
              {trailingIcon}
            </span>
          )}
        </>
      )
    })
  });
}
Cell.displayName = 'Menu.Cell';
