import styles from './radius.module.css';
import type { Radius } from './settings';

/**
 * The per-component `radius` override, as a cva variant so no component
 * carries bespoke override CSS.
 *
 * ```ts
 * const button = cva(styles['button'], {
 *   variants: { ...radiusVariants, size: { … } }
 * });
 * ```
 */
export const radiusClasses = {
  none: styles['radius-none'],
  small: styles['radius-small'],
  medium: styles['radius-medium'],
  large: styles['radius-large'],
  full: styles['radius-full']
} satisfies Record<Radius, string>;

/** Drop-in `variants` fragment for a cva definition. */
export const radiusVariants = { radius: radiusClasses };

/** The class for a `radius` prop, or `undefined` when it is unset. */
export function radiusClass(radius?: Radius | null): string | undefined {
  return radius ? radiusClasses[radius] : undefined;
}

export type { Radius };
