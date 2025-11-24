'use client';

import { TagType } from '@/lib/types';
import { Badge } from '@raystack/apsara';
import { cx } from 'class-variance-authority';
import styles from './tag.module.css';

interface TagProps {
  value: TagType;
  size?: 'small' | 'regular';
}

export default function Tag({ value, size = 'small' }: TagProps) {
  if (!value.length) return;
  return (
    <Badge
      screenReaderText={value}
      size={size === 'regular' ? 'regular' : 'micro'}
      variant={value === 'beta' ? 'neutral' : 'gradient'}
      className={cx(styles.tag, styles[size])}
    >
      {value.toUpperCase()}
    </Badge>
  );
}
