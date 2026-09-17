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

/** The class for a `radius` prop, or `undefined` when it is unset. */
export function radiusClass(radius?: Radius | null): string | undefined {
  return radius ? radiusClasses[radius] : undefined;
}
