'use client';

import { cx } from 'class-variance-authority';
import {
  HTMLAttributes,
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useState
} from 'react';
import styles from './code-block.module.css';

interface CodeBlockCommonProps {
  hideLineNumbers?: boolean;
  value?: string;
  maxLines?: number;
  collapsed?: boolean;
}

interface CodeBlockContextValue extends CodeBlockCommonProps {
  setValue: (value: string) => void;
  code?: string;
  setCode: (code: string) => void;
  toggleCollapsed: () => void;
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

export interface CodeBlockProps
  extends HTMLAttributes<HTMLDivElement>,
    CodeBlockCommonProps {
  defaultValue?: string;
  maxHeight?: string | number;
  onValueChange?: (value: string) => void;
  defaultCollapsed?: boolean;
  onCollapseChange?: (value: boolean) => void;
}

export const CodeBlockRoot = forwardRef<HTMLDivElement, CodeBlockProps>(
  (
    {
      children,
      value: providedValue,
      onValueChange,
      defaultValue,
      hideLineNumbers = false,
      maxLines,
      maxHeight,
      className,
      collapsed: providedCollapsed,
      defaultCollapsed = true,
      onCollapseChange,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState<string | undefined>(
      defaultValue
    );
    const [code, setCode] = useState<string | undefined>();
    const [internalCollapsed, setInternalCollapsed] = useState<boolean>(
      defaultCollapsed ?? false
    );

    const collapsed = providedCollapsed ?? internalCollapsed;

    const value = providedValue ?? internalValue ?? defaultValue;

    const setValue = useCallback(
      (newValue: string) => {
        setInternalValue(newValue);
        onValueChange?.(newValue);
      },
      [onValueChange]
    );

    const toggleCollapsed = useCallback(() => {
      setInternalCollapsed(_internalCollapsed => {
        onCollapseChange?.(!_internalCollapsed);
        return !_internalCollapsed;
      });
    }, [onCollapseChange]);

    return (
      <CodeBlockContext.Provider
        value={{
          hideLineNumbers,
          value,
          setValue,
          code,
          setCode,
          maxLines: maxLines && maxLines + 1, // to compensate for the absolute collapse trigger
          collapsed,
          toggleCollapsed
        }}
      >
        <div ref={ref} className={cx(styles.container, className)} {...props}>
          {children}
        </div>
      </CodeBlockContext.Provider>
    );
  }
);

CodeBlockRoot.displayName = 'CodeBlock';
