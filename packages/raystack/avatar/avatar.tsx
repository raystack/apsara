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
    shape: {
      square: styles["avatar-square"],
      circle: styles["avatar-circle"],
    },

    disabled: {
      true: styles["avatar-disabled"],
    },
  },
  defaultVariants: {
    shape: "circle",
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
    { className, alt, src, fallback, shape, style, imageProps, ...props },
    ref
  ) => (
    <Box className={styles.imageWrapper} style={style}>
      <AvatarPrimitive.Root
        ref={ref}
        className={avatar({ shape, className })}
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
