import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cva, VariantProps } from "class-variance-authority";
import {
  ComponentPropsWithoutRef,
  CSSProperties,
  ElementRef,
  forwardRef,
} from "react";
import { Box } from "../box";
import styles from "./avatar.module.css";

const avatar = cva(styles.avatar, {
  variants: {
    radius: {
      small: styles["avatar-small"],
      full: styles["avatar-full"],
    },
    size: {
      1: { '--avatar-size': 'var(--gap-5, 16px)' },
      2: { '--avatar-size': 'var(--gap-6, 20px)' },
      3: { '--avatar-size': 'var(--gap-7, 24px)' },
      4: { '--avatar-size': 'var(--gap-8, 28px)' },
      5: { '--avatar-size': 'var(--gap-9, 32px)' },
      6: { '--avatar-size': 'var(--gap-10, 40px)' },
      7: { '--avatar-size': 'var(--gap-11, 48px)' },
      8: { '--avatar-size': 'var(--gap-12, 56px)' },
      9: { '--avatar-size': 'var(--gap-13, 64px)' },
      10: { '--avatar-size': 'var(--gap-14, 72px)' },
      11: { '--avatar-size': 'var(--gap-15, 80px)' },
      12: { '--avatar-size': 'var(--gap-16, 96px)' },
      13: { '--avatar-size': 'var(--gap-17, 120px)' },
    },
    variant: {
      solid: styles["avatar-solid"],
      soft: styles["avatar-soft"],
    },
    disabled: {
      true: styles["avatar-disabled"],
    },
  },
  defaultVariants: {
    size: 3,
    radius: "small",
    variant: "soft",
  },
});

const image = cva(styles.image);
export interface AvatarProps
  extends ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>,
    VariantProps<typeof avatar> {}

const AvatarRoot = forwardRef<
  ElementRef<typeof AvatarPrimitive.Root>,
  AvatarProps & {
    alt?: string;
    src?: string;
    fallback?: React.ReactNode;
    imageProps?: CSSProperties;
  }
>(
  (
    { className, alt, src, fallback, size, radius, variant, style, imageProps, ...props },
    ref
  ) => (
    <Box className={styles.imageWrapper} style={style}>
      <AvatarPrimitive.Root
        ref={ref}
        className={avatar({ size, radius, variant, className })}
        style={imageProps}
        {...props}
      >
        <AvatarImage alt={alt} src={src} />
        <AvatarFallback>{fallback}</AvatarFallback>
      </AvatarPrimitive.Root>
    </Box>
  )
);

AvatarRoot.displayName = AvatarPrimitive.Root.displayName;

export interface AvatarImageProps
  extends ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>,
    VariantProps<typeof image> {}

const AvatarImage = forwardRef<
  ElementRef<typeof AvatarPrimitive.Image>,
  AvatarImageProps
>(({ className, sizes, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={image({ className })}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const fallback = cva(styles.fallback);

export interface FallbackProps
  extends ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>,
    VariantProps<typeof fallback> {}

const AvatarFallback = forwardRef<
  ElementRef<typeof AvatarPrimitive.Fallback>,
  FallbackProps
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={fallback({ className })}
    {...props}
  />
));

AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export const Avatar = Object.assign(AvatarRoot, {
  Image: AvatarImage,
  Fallback: AvatarFallback,
});
