'use client';

import { cx } from 'class-variance-authority';
import { ComponentProps, ReactNode } from 'react';
import { Avatar } from '../avatar';
import { Flex } from '../flex';
import styles from './sidebar.module.css';

interface SidebarLeadingVisualProps {
  leadingIcon?: ReactNode;
  fallbackText?: string;
  className?: string;
  render?: ComponentProps<typeof Flex>['render'];
}

function AvatarContainer({
  children,
  className,
  render
}: {
  children: ReactNode;
  className?: string;
  render?: ComponentProps<typeof Flex>['render'];
}) {
  return (
    <Flex
      align='center'
      gap={3}
      className={cx(styles['nav-leading-icon'], className)}
      aria-hidden='true'
      render={render}
    >
      {children}
    </Flex>
  );
}

export function SidebarLeadingVisual({
  leadingIcon,
  fallbackText,
  className,
  render
}: SidebarLeadingVisualProps) {
  if (leadingIcon) {
    return (
      <AvatarContainer className={className} render={render}>
        {leadingIcon}
      </AvatarContainer>
    );
  }

  if (fallbackText && fallbackText.length > 0) {
    return (
      <AvatarContainer className={className} render={render}>
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
