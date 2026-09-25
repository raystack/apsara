'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import styles from './kbd.module.css';

const kbd = cva(styles['kbd'], {
  variants: {
    variant: {
      solid: styles['kbd-solid'],
      ghost: styles['kbd-ghost']
    }
  }
});

const kbdGroup = cva(styles['kbd-group'], {
  variants: {
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
