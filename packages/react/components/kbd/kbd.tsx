'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import styles from './kbd.module.css';

const kbd = cva(styles['kbd'], {
  variants: {
    /** Visual style of the key. Defaults to the `variant` of the parent `Kbd.Group`, otherwise `"solid"`. */
    variant: {
      solid: styles['kbd-solid'],
      ghost: styles['kbd-ghost']
    }
  }
});

const kbdGroup = cva(styles['kbd-group'], {
  variants: {
    /**
     * Visual style of every key in the group. The `variant` of a key wins over it.
     * @default "solid"
     */
    variant: {
      solid: styles['kbd-group-solid'],
      ghost: styles['kbd-group-ghost']
    }
  }
});

export type KbdProps = ComponentProps<'kbd'> & VariantProps<typeof kbd>;

const KbdRoot = ({ className, variant, ...props }: KbdProps) => (
  <kbd data-slot='kbd' className={kbd({ variant, className })} {...props} />
);

KbdRoot.displayName = 'Kbd';

export type KbdGroupProps = ComponentProps<'kbd'> &
  VariantProps<typeof kbdGroup>;

const KbdGroup = ({ className, variant, ...props }: KbdGroupProps) => (
  <kbd
    data-slot='kbd-group'
    className={kbdGroup({ variant, className })}
    {...props}
  />
);

KbdGroup.displayName = 'Kbd.Group';

export const Kbd = Object.assign(KbdRoot, {
  Group: KbdGroup
});
