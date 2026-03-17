'use client';

import { cx } from 'class-variance-authority';
import { ComponentProps } from 'react';
import { Flex } from '../flex';
import styles from './navbar.module.css';

export interface NavbarRootProps extends ComponentProps<'nav'> {
  sticky?: boolean;
}

export function NavbarRoot({
  className,
  sticky = false,
  children,
  ...props
}: NavbarRootProps) {
  return (
    <nav
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

NavbarRoot.displayName = 'Navbar';
