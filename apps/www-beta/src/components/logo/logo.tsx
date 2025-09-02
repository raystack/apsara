import { cx } from 'class-variance-authority';
import Image from 'next/image';
import styles from './logo.module.css';

type Props = {
  variant?: 'small' | 'large';
  wordmark?: boolean;
  monogram?: boolean;
};

export default function Logo({
  variant = 'small',
  wordmark = true,
  monogram = true
}: Props) {
  const size = variant === 'small' ? 24 : 48;
  return (
    <div className={cx(styles.container, styles[variant])}>
      {monogram && (
        <Image src={`/assets/logo.svg`} alt='' width={size} height={size} />
      )}
      {wordmark && <p>Apsara</p>}
    </div>
  );
}
