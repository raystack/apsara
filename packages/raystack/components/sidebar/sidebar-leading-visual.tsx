'use client';

import { cx } from 'class-variance-authority';
import { ReactNode } from 'react';
import { Avatar } from '../avatar';
import { Flex } from '../flex';
import styles from './sidebar.module.css';

interface SidebarLeadingVisualProps {
  leadingIcon?: ReactNode;
  fallbackText?: string;
  className?: string;
}

export function SidebarLeadingVisual({
  leadingIcon,
  fallbackText,
  className
}: SidebarLeadingVisualProps) {
  if (leadingIcon) {
    return (
      <Flex
        align='center'
        gap={3}
        className={cx(styles['nav-leading-icon'], className)}
        aria-hidden='true'
      >
        {leadingIcon}
      </Flex>
    );
  }

  if (fallbackText && fallbackText.length > 0) {
    return (
      <Flex
        align='center'
        gap={3}
        className={cx(styles['nav-leading-icon'], className)}
        aria-hidden='true'
      >
        <Avatar
          size={1}
          variant='soft'
          color='neutral'
          fallback={fallbackText[0].toUpperCase()}
          className={styles['nav-fallback-avatar']}
        />
      </Flex>
    );
  }

  return null;
}
