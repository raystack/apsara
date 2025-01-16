import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cva, VariantProps } from "class-variance-authority";
import { clsx } from 'clsx';
import { ComponentPropsWithoutRef, ComponentRef, ReactNode } from "react";

import { Box } from "../box";
import styles from "./avatar.module.css";

const avatar = cva(styles.avatar, {
  variants: {
    radius: {
      small: styles["avatar-small"],
      full: styles["avatar-full"],
    },
    size: {
      1: styles["avatar-size-1"],
      2: styles["avatar-size-2"],
      3: styles["avatar-size-3"],
      4: styles["avatar-size-4"],
      5: styles["avatar-size-5"],
      6: styles["avatar-size-6"],
      7: styles["avatar-size-7"],
      8: styles["avatar-size-8"],
      9: styles["avatar-size-9"],
      10: styles["avatar-size-10"],
      11: styles["avatar-size-11"],
      12: styles["avatar-size-12"],
      13: styles["avatar-size-13"],
    },
    variant: {
      solid: styles["avatar-solid"],
      soft: styles["avatar-soft"],
    },
    disabled: {
      true: styles["avatar-disabled"],
    },
    color: {
      indigo: styles["avatar-color-indigo"],
      orange: styles["avatar-color-orange"],
      mint: styles["avatar-color-mint"],
      neutral: styles["avatar-color-neutral"],
      sky: styles["avatar-color-sky"],
      lime: styles["avatar-color-lime"],
      grass: styles["avatar-color-grass"],
      cyan: styles["avatar-color-cyan"],
      iris: styles["avatar-color-iris"],
      purple: styles["avatar-color-purple"],
      pink: styles["avatar-color-pink"],
      crimson: styles["avatar-color-crimson"],
      gold: styles["avatar-color-gold"],
    },
  },
  compoundVariants: [
    { variant: 'solid', color: 'indigo', className: styles['avatar-solid-indigo'] },
    { variant: 'solid', color: 'orange', className: styles['avatar-solid-orange'] },
    { variant: 'solid', color: 'mint', className: styles['avatar-solid-mint'] },
    { variant: 'solid', color: 'sky', className: styles['avatar-solid-sky'] },
    { variant: 'solid', color: 'lime', className: styles['avatar-solid-lime'] },
    { variant: 'solid', color: 'grass', className: styles['avatar-solid-grass'] },
    { variant: 'solid', color: 'cyan', className: styles['avatar-solid-cyan'] },
    { variant: 'solid', color: 'iris', className: styles['avatar-solid-iris'] },
    { variant: 'solid', color: 'purple', className: styles['avatar-solid-purple'] },
    { variant: 'solid', color: 'pink', className: styles['avatar-solid-pink'] },
    { variant: 'solid', color: 'crimson', className: styles['avatar-solid-crimson'] },
    { variant: 'solid', color: 'gold', className: styles['avatar-solid-gold'] },
    { variant: 'soft', color: 'indigo', className: styles['avatar-soft-indigo'] },
    { variant: 'soft', color: 'orange', className: styles['avatar-soft-orange'] },
    { variant: 'soft', color: 'mint', className: styles['avatar-soft-mint'] },
    { variant: 'soft', color: 'sky', className: styles['avatar-soft-sky'] },
    { variant: 'soft', color: 'lime', className: styles['avatar-soft-lime'] },
    { variant: 'soft', color: 'grass', className: styles['avatar-soft-grass'] },
    { variant: 'soft', color: 'cyan', className: styles['avatar-soft-cyan'] },
    { variant: 'soft', color: 'iris', className: styles['avatar-soft-iris'] },
    { variant: 'soft', color: 'purple', className: styles['avatar-soft-purple'] },
    { variant: 'soft', color: 'pink', className: styles['avatar-soft-pink'] },
    { variant: 'soft', color: 'crimson', className: styles['avatar-soft-crimson'] },
    { variant: 'soft', color: 'gold', className: styles['avatar-soft-gold'] },
  ],
  defaultVariants: {
    size: 3,
    radius: "small",
    variant: "soft",
    color: "indigo",
  },
});

const image = cva(styles.image);

export interface AvatarProps
  extends ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>,
    VariantProps<typeof avatar> {
  size?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;
  src?: string;
  alt?: string;
  fallback?: ReactNode;
  variant?: "solid" | "soft";
  color?: "indigo" | "orange" | "mint" | "neutral" | 
         "sky" | "lime" | "grass" | "cyan" | "iris" | "purple" | "pink" | "crimson" | "gold";
  asChild?: boolean;
  className?: string;
}

export const Avatar = ({ className, alt, src, fallback, size, radius, variant, color, style, asChild, ref, ...props }: AvatarProps & { ref?: React.Ref<ComponentRef<typeof AvatarPrimitive.Root>> }) => {
  return (
    <Box className={styles.imageWrapper} style={style}>
      <AvatarPrimitive.Root
        ref={ref}
        className={clsx(avatar({ size, radius, variant, color }), className)}
        asChild={asChild}
        {...props}
      >
        <AvatarPrimitive.Image
          className={image()}
          src={src}
          alt={alt}
        />
        <AvatarPrimitive.Fallback className={styles.fallback}>
          {fallback}
        </AvatarPrimitive.Fallback>
      </AvatarPrimitive.Root>
    </Box>
  );
};

export interface AvatarGroupProps extends ComponentPropsWithoutRef<'div'> {
  children: React.ReactElement<AvatarProps>[];
  max?: number;
}

export const AvatarGroup = ({ children, max, className, ref, ...props }: AvatarGroupProps & { ref?: React.Ref<ComponentRef<"div">> }) => {
  const avatars = max ? children.slice(0, max) : children;
  const count = max && children.length > max ? children.length - max : 0;

  return (
    <div
      ref={ref}
      className={clsx(styles.avatarGroup, className)}
      {...props}
    >
      {avatars.map((avatar, index) => (
        <div key={index} className={styles.avatarWrapper}>
          {avatar}
        </div>
      ))}
      {count > 0 && (
        <div className={styles.avatarWrapper}>
          <Avatar
            size={avatars[0].props.size}
            radius={avatars[0].props.radius}
            variant={avatars[0].props.variant}
            color='neutral'
            fallback={<span>+{count}</span>}
          />
        </div>
      )}
    </div>
  );
};

Avatar.displayName = 'Avatar';
AvatarGroup.displayName = 'AvatarGroup';
