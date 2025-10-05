import React, { forwardRef } from 'react';

import { Text } from '../text';
import styles from './code-block.module.css';

export interface CodeBlockHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const CodeBlockHeader = forwardRef<HTMLDivElement, CodeBlockHeaderProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`${styles.header} ${className || ''}`}
        {...props}
      >
        <div className={styles.headerLeft}>{children}</div>
      </div>
    );
  }
);

CodeBlockHeader.displayName = 'CodeBlockHeader';

export interface CodeBlockLabelProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const CodeBlockLabel = forwardRef<HTMLDivElement, CodeBlockLabelProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`${styles.label} ${className || ''}`}
        {...props}
      >
        <Text className={styles.labelText}>{children}</Text>
      </div>
    );
  }
);

CodeBlockLabel.displayName = 'CodeBlockLabel';

export interface CodeBlockActionProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const CodeBlockAction = forwardRef<HTMLDivElement, CodeBlockActionProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`${styles.action} ${className || ''}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CodeBlockAction.displayName = 'CodeBlockAction';
