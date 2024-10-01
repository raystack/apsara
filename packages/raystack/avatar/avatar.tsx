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
      1: styles["--avatar-size-1"],
      2: styles["--avatar-size-2"],
      3: styles["--avatar-size-3"],
      4: styles["--avatar-size-4"],
      5: styles["--avatar-size-5"],
      6: styles["--avatar-size-6"],
      7: styles["--avatar-size-7"],
      8: styles["--avatar-size-8"],
      9: styles["--avatar-size-9"],
      10: styles["--avatar-size-10"],
      11: styles["--avatar-size-11"],
      12: styles["--avatar-size-12"],
      13: styles["--avatar-size-13"],
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
