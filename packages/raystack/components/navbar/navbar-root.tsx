'use client';

import { cx } from 'class-variance-authority';
import { ComponentPropsWithoutRef, ComponentRef, forwardRef } from 'react';
import { Flex } from '../flex';
import styles from './navbar.module.css';

export interface NavbarRootProps extends ComponentPropsWithoutRef<'nav'> {
  sticky?: boolean;
}

export const NavbarRoot = forwardRef<ComponentRef<'nav'>, NavbarRootProps>(
  ({ className, sticky = false, children, ...props }, ref) => {
    return (
      <nav
        ref={ref}
        className={cx(styles.root, className)}
        data-sticky={sticky}
        role='navigation'
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
