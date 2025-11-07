import { cx } from 'class-variance-authority';
import { HTMLAttributes } from 'react';
import styles from './playground-layout.module.css';

type Props = {
  title?: string;
} & HTMLAttributes<HTMLDivElement>;

export default function PlaygroundLayout({
  title,
  children,
  className,
  ...props
}: Props) {
  return (
    <div className={cx(styles.container, className)} {...props}>
      {title && <p>{title}</p>}
      {children}
    </div>
  );
}
