'use client';

import { cx } from 'class-variance-authority';
import { ReactNode } from 'react';
import styles from './sidebar.module.css';

interface SidebarTrailingVisualProps {
  trailingIcon?: ReactNode;
  className?: string;
}

export function SidebarTrailingVisual({
  trailingIcon,
  className
}: SidebarTrailingVisualProps) {
  if (!trailingIcon) return null;

  return (
    <span className={cx(styles['nav-group-trailing-icon'], className)}>
      {trailingIcon}
    </span>
  );
}
