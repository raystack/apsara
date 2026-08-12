'use client';

import { cva, cx, type VariantProps } from 'class-variance-authority';
import { type ComponentProps, createContext, useContext } from 'react';
import styles from './kbd.module.css';

const kbd = cva(styles['kbd'], {
  variants: {
    variant: {
      solid: styles['kbd-solid'],
      ghost: styles['kbd-ghost']
    }
  },
  defaultVariants: {
    variant: 'solid'
  }
});

type KbdVariant = NonNullable<VariantProps<typeof kbd>['variant']>;

const KbdGroupContext = createContext<KbdVariant | undefined>(undefined);

export type KbdProps = ComponentProps<'kbd'> & VariantProps<typeof kbd>;

const KbdRoot = ({ className, variant, ...props }: KbdProps) => {
  const groupVariant = useContext(KbdGroupContext);

  return (
    <kbd
      data-slot='kbd'
      className={kbd({ variant: variant ?? groupVariant, className })}
      {...props}
    />
  );
};

KbdRoot.displayName = 'Kbd';

export type KbdGroupProps = ComponentProps<'kbd'> & VariantProps<typeof kbd>;

const KbdGroup = ({ className, variant, ...props }: KbdGroupProps) => (
  <KbdGroupContext.Provider value={variant ?? undefined}>
    <kbd
      data-slot='kbd-group'
      className={cx(styles['kbd-group'], className)}
      {...props}
    />
  </KbdGroupContext.Provider>
);

KbdGroup.displayName = 'Kbd.Group';

export const Kbd = Object.assign(KbdRoot, {
  Group: KbdGroup
});
