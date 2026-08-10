import { cx } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import styles from './kbd.module.css';

export type KbdProps = ComponentProps<'kbd'>;

const KbdRoot = ({ className, ...props }: KbdProps) => (
  <kbd data-slot='kbd' className={cx(styles.kbd, className)} {...props} />
);

KbdRoot.displayName = 'Kbd';

export type KbdGroupProps = ComponentProps<'kbd'>;

/**
 * Renders a `<kbd>` rather than a `<div>`: per the HTML spec a `kbd` nested
 * inside a `kbd` represents an individual key within a larger input, which is
 * exactly a shortcut sequence.
 */
const KbdGroup = ({ className, ...props }: KbdGroupProps) => (
  <kbd
    data-slot='kbd-group'
    className={cx(styles['kbd-group'], className)}
    {...props}
  />
);

KbdGroup.displayName = 'Kbd.Group';

export const Kbd = Object.assign(KbdRoot, {
  Group: KbdGroup
});
