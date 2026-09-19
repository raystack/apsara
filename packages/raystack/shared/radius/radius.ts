import { cva } from 'class-variance-authority';

import styles from './radius.module.css';

export const RADII = ['none', 'small', 'medium', 'large', 'full'] as const;
export type Radius = (typeof RADII)[number];

/** Per-component `radius` override, spread into a cva `variants` block. */
export const radiusClasses = {
  none: styles['radius-none'],
  small: styles['radius-small'],
  medium: styles['radius-medium'],
  large: styles['radius-large'],
  full: styles['radius-full']
} satisfies Record<Radius, string>;

export const radiusVariants = { radius: radiusClasses };

/**
 * The `radius` override alone, for surfaces that carry no cva of their own.
 * Returns `''` when `radius` is unset. Named `radiusStyle`, not `radius`,
 * because every call site already binds a `radius` prop of its own.
 */
export const radiusStyle = cva('', { variants: radiusVariants });
