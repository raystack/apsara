'use client';

import { useEffect, useRef, useState } from 'react';
import { useCopyToClipboard } from '~/hooks/useCopyToClipboard';
import { CheckIcon, CopyIcon } from '~/icons';
import { IconButton, IconButtonProps } from '../icon-button/icon-button';
import styles from './copy-button.module.css';

export interface CopyButtonProps extends IconButtonProps {
  text: string;
  resetTimeout?: number;
  resetIcon?: boolean;
}

export function CopyButton({
  text,
  resetTimeout = 1000,
  resetIcon = true,
  ...props
}: CopyButtonProps) {
  const { copy } = useCopyToClipboard();
  const [copied, setCopied] = useState(false);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current !== null) clearTimeout(resetTimerRef.current);
    };
  }, []);

  async function onCopy() {
    const res = await copy(text);
    if (!res) return;
    setCopied(true);
    if (resetIcon) {
      if (resetTimerRef.current !== null) clearTimeout(resetTimerRef.current);
      resetTimerRef.current = setTimeout(() => {
        setCopied(false);
        resetTimerRef.current = null;
      }, resetTimeout);
    }
  }

  return (
    <>
      <IconButton
        aria-label='Copy'
        data-slot='copy-button'
        {...props}
        onClick={onCopy}
        data-test-id='copy-button'
      >
        <span
          className={styles.iconSwap}
          data-copied={copied || undefined}
          data-slot='copy-button-icons'
        >
          <CopyIcon
            className={styles.copyIcon}
            data-slot='copy-button-copy-icon'
          />
          <CheckIcon
            className={styles.checkIcon}
            color='var(--rs-color-foreground-success-primary)'
            data-slot='copy-button-check-icon'
          />
        </span>
      </IconButton>
      <span
        className={styles['sr-only']}
        role='status'
        aria-live='polite'
        data-slot='copy-button-status'
      >
        {copied ? 'Copied' : ''}
      </span>
    </>
  );
}

CopyButton.displayName = 'CopyButton';
