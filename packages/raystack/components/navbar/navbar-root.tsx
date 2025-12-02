'use client';

import { cva } from 'class-variance-authority';
import { ComponentPropsWithoutRef, ComponentRef, forwardRef } from 'react';
import { Flex } from '../flex';
import styles from './navbar.module.css';

const root = cva(styles.root);

export interface NavbarRootProps extends ComponentPropsWithoutRef<'nav'> {
  sticky?: boolean;
  /**
   * Accessible label for the navigation. If not provided, defaults to "Main navigation".
   * Use this to provide a more specific description of the navbar's purpose.
   */
  'aria-label'?: string;
  /**
   * ID of an element that labels the navigation. Use this when you have a visible heading
   * that describes the navbar.
   */
  'aria-labelledby'?: string;
}

export const NavbarRoot = forwardRef<ComponentRef<'nav'>, NavbarRootProps>(
  (
    {
      className,
      sticky = false,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      children,
      ...props
    },
    ref
  ) => {
    // Only set default aria-label if neither aria-label nor aria-labelledby is provided
    const navAriaLabel =
      ariaLabel || (!ariaLabelledBy ? 'Main navigation' : undefined);

    return (
      <nav
        ref={ref}
        className={root({ className })}
        data-sticky={sticky}
        role='navigation'
        aria-label={navAriaLabel}
        aria-labelledby={ariaLabelledBy}
        {...props}
      >
        <Flex align='center' justify='between' className={styles.container}>
          {children}
        </Flex>
      </nav>
    );
  }
);

NavbarRoot.displayName = 'Navbar';
