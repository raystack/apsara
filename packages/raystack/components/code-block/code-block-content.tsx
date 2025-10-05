import { HTMLAttributes, forwardRef } from 'react';

import styles from './code-block.module.css';

export interface CodeBlockContentProps extends HTMLAttributes<HTMLDivElement> {}

const CodeBlockContent = forwardRef<HTMLDivElement, CodeBlockContentProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`${styles.content} ${className || ''}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CodeBlockContent.displayName = 'CodeBlockContent';

export { CodeBlockContent };
