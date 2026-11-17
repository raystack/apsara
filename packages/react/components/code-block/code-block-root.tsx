'use client';

import { useControlled } from '@base-ui/utils/useControlled';
import { cx } from 'class-variance-authority';
import {
  ComponentProps,
  createContext,
  useCallback,
  useContext,
  useState
} from 'react';
import {
  type ChangeDetails,
  createChangeDetails
} from '~/shared/change-details';
import styles from './code-block.module.css';

interface CodeBlockCommonProps {
  /**
   * Whether to hide the line numbers.
   * @default false
   */
  hideLineNumbers?: boolean;
  /** The value of the `CodeBlock.Code` to show. Use when controlled. */
  value?: string;
  /** The number of lines to show while collapsed. Unset or `0` turns collapsing off. */
  maxLines?: number;
  /** Whether the code is collapsed to `maxLines`. Use when controlled. */
  collapsed?: boolean;
}

interface CodeBlockContextValue extends CodeBlockCommonProps {
  setValue: (value: string) => void;
  code?: string;
  setCode: (code: string) => void;
  toggleCollapsed: (event: Event) => void;
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

export type CodeBlockCollapseChangeDetails = ChangeDetails<'trigger-press'>;

export interface CodeBlockProps
  extends ComponentProps<'div'>,
    CodeBlockCommonProps {
  /** The value of the `CodeBlock.Code` to show first. Use when uncontrolled. */
  defaultValue?: string;
  /** @deprecated Has no effect. */
  maxHeight?: string | number;
  /** Called when the value changes. */
  onValueChange?: (value: string) => void;
  /**
   * Whether the code is collapsed on first render.
   * @default true
   */
  defaultCollapsed?: boolean;
  /** Called when the collapsed state changes. */
  onCollapseChange?: (
    value: boolean,
    details: CodeBlockCollapseChangeDetails
  ) => void;
}

export const CodeBlockRoot = ({
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
}: CodeBlockProps) => {
  const [value, setValueUnwrapped] = useControlled<string | undefined>({
    controlled: providedValue,
    default: defaultValue,
    name: 'CodeBlock',
    state: 'value'
  });
  const [code, setCode] = useState<string | undefined>();
  const [collapsed, setCollapsedUnwrapped] = useControlled({
    controlled: providedCollapsed,
    default: defaultCollapsed,
    name: 'CodeBlock',
    state: 'collapsed'
  });

  const setValue = useCallback(
    (newValue: string) => {
      setValueUnwrapped(newValue);
      onValueChange?.(newValue);
    },
    [onValueChange, setValueUnwrapped]
  );

  const toggleCollapsed = useCallback(
    (event: Event) => {
      const next = !collapsed;
      setCollapsedUnwrapped(next);
      onCollapseChange?.(next, createChangeDetails('trigger-press', event));
    },
    [collapsed, onCollapseChange, setCollapsedUnwrapped]
  );

  return (
    <CodeBlockContext
      value={{
        hideLineNumbers,
        value,
        setValue,
        code,
        setCode,
        maxLines,
        collapsed,
        toggleCollapsed
      }}
    >
      <div
        className={cx(styles.container, className)}
        data-slot='code-block'
        {...props}
      >
        {children}
      </div>
    </CodeBlockContext>
  );
};

CodeBlockRoot.displayName = 'CodeBlock';
