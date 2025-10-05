import React, { forwardRef } from 'react';

import { CopyButton } from '../copy-button';
import { useCodeBlockContext } from './code-block-root';
import styles from './code-block.module.css';

export interface CodeBlockCopyButtonProps
  extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const CodeBlockCopyButton = forwardRef<
  HTMLDivElement,
  CodeBlockCopyButtonProps
>(({ className, ...props }, ref) => {
  const { code = '' } = useCodeBlockContext();

  return (
    <div
      ref={ref}
      className={`${styles.copyButtonContainer} ${className || ''}`}
      {...props}
    >
      <CopyButton text={code} size={1} className={styles.copyButton} />
    </div>
  );
});

CodeBlockCopyButton.displayName = 'CodeBlockCopyButton';

export { CodeBlockCopyButton };
