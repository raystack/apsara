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

function AvatarContainer({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <Flex
      align='center'
      gap={3}
      className={cx(styles['nav-leading-icon'], className)}
      aria-hidden='true'
    >
      {children}
    </Flex>
  );
}

export function SidebarLeadingVisual({
  leadingIcon,
  fallbackText,
  className
}: SidebarLeadingVisualProps) {
  if (leadingIcon) {
    return (
      <AvatarContainer className={className}>{leadingIcon}</AvatarContainer>
    );
  }

  if (fallbackText && fallbackText.length > 0) {
    return (
      <AvatarContainer className={className}>
        <Avatar
          size={1}
          variant='soft'
          color='neutral'
          fallback={fallbackText[0].toUpperCase()}
          className={styles['nav-fallback-avatar']}
        />
      </AvatarContainer>
    );
  }

  return null;
}
