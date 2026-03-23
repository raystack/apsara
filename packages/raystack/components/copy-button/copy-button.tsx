'use client';

import { CopyIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import { useCopyToClipboard } from '~/hooks/useCopyToClipboard';
import { CheckCircleFilledIcon } from '~/icons';
import { IconButton, IconButtonProps } from '../icon-button/icon-button';

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
  const [isCopied, setIsCopied] = useState(false);

  async function onCopy() {
    const res = await copy(text);
    if (res) {
      setIsCopied(true);
      if (resetIcon) {
        setTimeout(() => {
          setIsCopied(false);
        }, resetTimeout);
      }
    }
  }

  return (
    <IconButton {...props} onClick={onCopy} data-test-id='copy-button'>
      {isCopied ? (
        <CheckCircleFilledIcon color='var(--rs-color-foreground-success-primary)' />
      ) : (
        <CopyIcon />
      )}
    </IconButton>
  );
}

CopyButton.displayName = 'CopyButton';
