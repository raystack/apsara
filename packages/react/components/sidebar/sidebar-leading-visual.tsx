'use client';

import { mergeProps } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import { ComponentProps, ReactNode } from 'react';
import { Avatar } from '../avatar';
import { Flex } from '../flex';
import styles from './sidebar.module.css';

interface SidebarLeadingVisualProps {
  leadingIcon?: ReactNode;
  fallbackText?: string;
  className?: string;
  /** Props from `slotProps` for the wrapper. */
  slotProps?: ComponentProps<'span'>;
  render?: ComponentProps<typeof Flex>['render'];
}

function AvatarContainer({
  children,
  className,
  slotProps,
  render
}: {
  children: ReactNode;
  className?: string;
  slotProps?: ComponentProps<'span'>;
  render?: ComponentProps<typeof Flex>['render'];
}) {
  return (
    <Flex
      align='center'
      gap={3}
      aria-hidden='true'
      data-slot='sidebar-leading-icon'
      render={render}
      {...mergeProps<'div'>(
        { className: cx(styles['nav-leading-icon'], className) },
        slotProps as ComponentProps<'div'>
      )}
    >
      {children}
    </Flex>
  );
}

export function SidebarLeadingVisual({
  leadingIcon,
  fallbackText,
  className,
  slotProps,
  render
}: SidebarLeadingVisualProps) {
  if (leadingIcon) {
    return (
      <AvatarContainer
        className={className}
        slotProps={slotProps}
        render={render}
      >
        {leadingIcon}
      </AvatarContainer>
    );
  }

  if (fallbackText && fallbackText.length > 0) {
    return (
      <AvatarContainer
        className={className}
        slotProps={slotProps}
        render={render}
      >
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
