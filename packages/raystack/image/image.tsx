import { cva, VariantProps } from "class-variance-authority";
import { ImgHTMLAttributes, PropsWithChildren } from "react";
import styles from "./image.module.css";

/**
 * @deprecated Use Image from `@raystack/apsara/v1` instead.
 */
const image = cva(styles.image);

type ImageProps = PropsWithChildren<VariantProps<typeof image>> &
  ImgHTMLAttributes<HTMLImageElement>;

/**
 * @deprecated Use Image from `@raystack/apsara/v1` instead.
 */
export function Image({ alt, children, className, ...props }: ImageProps) {
  return <img alt={alt} className={image({ className })} {...props} />;
}
