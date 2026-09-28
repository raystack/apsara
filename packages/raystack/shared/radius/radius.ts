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
 * The `radius` override alone, for surfaces with no cva of their own; `''` when
 * unset. Not named `radius`, since every call site already binds that prop.
 */
export const radiusStyle = cva('', { variants: radiusVariants });
