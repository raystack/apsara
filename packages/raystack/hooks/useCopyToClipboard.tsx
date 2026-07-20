import { useState } from 'react';

type CopyFn = (text: string) => Promise<boolean>; // Return success

export const useCopyToClipboard = () => {
  const [copiedText, setCopiedText] = useState('');

  const copy: CopyFn = async text => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard not supported');
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      return true;
    } catch (error) {
      console.warn('Copy failed', error);
      setCopiedText('');
      return false;
    }
  };

  return { copiedText, copy };
};
