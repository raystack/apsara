'use client';

import {
  HTMLAttributes,
  createContext,
  forwardRef,
  useContext,
  useState
} from 'react';
import styles from './code-block.module.css';

interface CodeBlockContextValue {
  language: string;
  hideLineNumbers: boolean;
  code?: string;
  setCode: (code?: string) => void;
}

const CodeBlockContext = createContext<CodeBlockContextValue | undefined>(
  undefined
);

export const useCodeBlockContext = () => {
  const context = useContext(CodeBlockContext);
  if (!context) {
    throw new Error('useCodeBlockContext must be used within a CodeBlock');
  }
  return context;
};

export interface CodeBlockProps extends HTMLAttributes<HTMLDivElement> {
  language: string;
  hideLineNumbers?: boolean;
  maxHeight?: string | number;
  className?: string;
}

export const CodeBlockRoot = forwardRef<HTMLDivElement, CodeBlockProps>(
  (
    {
      children,
      language,
      hideLineNumbers = false,
      maxHeight,
      className,
      ...props
    },
    ref
  ) => {
    const [code, setCode] = useState<string | undefined>();

    return (
      <CodeBlockContext.Provider
        value={{
          language,
          hideLineNumbers,
          code,
          setCode
        }}
      >
        <div
          ref={ref}
          className={`${styles.container} ${className || ''}`}
          {...props}
        >
          {children}
        </div>
      </CodeBlockContext.Provider>
    );
  }
);

CodeBlockRoot.displayName = 'CodeBlock';
