import { cva, type VariantProps } from "class-variance-authority";
import { ImgHTMLAttributes } from "react";
import styles from "./image.module.css";

const image = cva(styles.image, {
  variants: {
    fit: {
      contain: styles["image-contain"],
      cover: styles["image-cover"],
      fill: styles["image-fill"],
    },
    radius: {
      none: styles["image-radius-none"],
      small: styles["image-radius-small"],
      medium: styles["image-radius-medium"],
      full: styles["image-radius-full"],
    }
  },
  defaultVariants: {
    fit: "cover",
    radius: "none"
  }
});

interface ImageProps 
  extends ImgHTMLAttributes<HTMLImageElement>,
    VariantProps<typeof image> {
  fallback?: string;
  width?: string | number;
  height?: string | number;
}

export function Image({ 
  alt = "",
  className,
  fit,
  radius,
  fallback,
  onError,
  width,
  height,
  style,
  ...props 
}: ImageProps) {
  const handleError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (fallback) {
      event.currentTarget.src = fallback;
    }
    onError?.(event);
  };

  const imageStyle = {
    width: width,
    height: height,
    ...style
  };

  return (
    <img 
      alt={alt}
      className={image({ fit, radius, className })}
      onError={handleError}
      style={imageStyle}
      {...props}
    />
  );
}

Image.displayName = "Image"; 