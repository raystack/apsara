import { Text } from '@raystack/apsara';
import { cx } from 'class-variance-authority';
import { HTMLAttributes } from 'react';
import styles from './kbd.module.css';

interface KBDProps extends HTMLAttributes<HTMLElement> {
  children: string | number;
  mode?: 'single' | 'combination';
}

export const Kbd = ({
  children,
  mode = 'single',
  className,
  ...props
}: KBDProps) => {
  const content = String(children);

  if (mode === 'combination') {
    const keys = content.split(' ');
    return (
      <span className={styles.container} {...props}>
        {keys.map((key, index) => (
          <Text
            className={cx(styles.kbd, className)}
            key={index}
            as='span'
            variant='tertiary'
            size='mini'
            weight='medium'
          >
            {key}
          </Text>
        ))}
      </span>
    );
  }

  return (
    <Text
      className={cx(styles.kbd, className)}
      as='span'
      variant='tertiary'
      size='mini'
      weight='medium'
      {...props}
    >
      {content}
    </Text>
  );
};
