import { cva, VariantProps } from "class-variance-authority";
import { ImgHTMLAttributes, PropsWithChildren } from "react";
import styles from "./image.module.css";

const image = cva(styles.image);

type ImageProps = PropsWithChildren<VariantProps<typeof image>> &
  ImgHTMLAttributes<HTMLImageElement>;

export function Image({ children, className, ...props }: ImageProps) {
  return <img className={image({ className })} {...props} />;
}
