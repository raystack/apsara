'use client';

import { mergeProps } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import { ComponentProps, ReactNode } from 'react';
import styles from './sidebar.module.css';

interface SidebarTrailingVisualProps {
  trailingIcon?: ReactNode;
  className?: string;
  /** Props from `slotProps` for the wrapper. */
  slotProps?: ComponentProps<'span'>;
}

export function SidebarTrailingVisual({
  trailingIcon,
  className,
  slotProps
}: SidebarTrailingVisualProps) {
  if (!trailingIcon) return null;

  return (
    <span
      data-slot='sidebar-trailing-icon'
      {...mergeProps<'span'>(
        { className: cx(styles['nav-group-trailing-icon'], className) },
        slotProps
      )}
    >
      {trailingIcon}
    </span>
  );
}
