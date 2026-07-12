'use client';

import { CopyIcon } from '@radix-ui/react-icons';
import { cx } from 'class-variance-authority';
import { useEffect, useRef, useState } from 'react';
import { useCopyToClipboard } from '~/hooks/useCopyToClipboard';
import { CheckCircleFilledIcon, CrossCircleFilledIcon } from '~/icons';
import { IconButton, IconButtonProps } from '../icon-button/icon-button';
import styles from './copy-button.module.css';

export interface CopyButtonProps extends IconButtonProps {
  text: string;
  resetTimeout?: number;
  resetIcon?: boolean;
}

type CopyStatus = 'idle' | 'copied' | 'error';

export function CopyButton({
  text,
  resetTimeout = 1000,
  resetIcon = true,
  ...props
}: CopyButtonProps) {
  const { copy } = useCopyToClipboard();
  const [status, setStatus] = useState<CopyStatus>('idle');
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current !== null) clearTimeout(resetTimerRef.current);
    };
  }, []);

  function scheduleReset() {
    if (resetTimerRef.current !== null) clearTimeout(resetTimerRef.current);
    resetTimerRef.current = setTimeout(() => {
      setStatus('idle');
      resetTimerRef.current = null;
    }, resetTimeout);
  }

  async function onCopy() {
    const res = await copy(text);
    if (res) {
      setStatus('copied');
      if (resetIcon) scheduleReset();
    } else {
      setStatus('error');
      scheduleReset();
    }
  }

  return (
    <>
      <IconButton {...props} onClick={onCopy} data-test-id='copy-button'>
        <span
          className={styles.iconStack}
          data-status={status}
          aria-hidden='true'
        >
          <CopyIcon className={cx(styles.icon, styles.iconCopy)} />
          <CheckCircleFilledIcon
            className={cx(styles.icon, styles.iconSuccess)}
            color='var(--rs-color-foreground-success-primary)'
          />
          <CrossCircleFilledIcon
            className={cx(styles.icon, styles.iconError)}
            color='var(--rs-color-foreground-danger-primary)'
          />
        </span>
      </IconButton>
      <span className={styles['sr-only']} role='status' aria-live='polite'>
        {status === 'copied'
          ? 'Copied'
          : status === 'error'
            ? 'Copy failed'
            : ''}
      </span>
    </>
  );
}

CopyButton.displayName = 'CopyButton';
