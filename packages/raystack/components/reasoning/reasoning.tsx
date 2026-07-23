'use client';

import { useControlled } from '@base-ui/utils/useControlled';
import { ChevronRightIcon } from '@radix-ui/react-icons';
import { cx } from 'class-variance-authority';
import {
  ComponentProps,
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef
} from 'react';
import { Collapsible } from '../collapsible';
import styles from './reasoning.module.css';

interface ReasoningContextValue {
  streaming: boolean;
  duration?: number;
  open: boolean;
}

const ReasoningContext = createContext<ReasoningContextValue | null>(null);

function useReasoningContext(part: string): ReasoningContextValue {
  const context = useContext(ReasoningContext);
  if (!context) {
    throw new Error(`Reasoning.${part} must be used within <Reasoning>`);
  }
  return context;
}

export interface ReasoningProps
  extends Omit<ComponentProps<typeof Collapsible>, 'onOpenChange'> {
  /**
   * Whether the reasoning is still being produced. While `true` the default
   * trigger shows a shimmering "Thinking…" label and the panel auto-opens;
   * when it flips back to `false` the panel auto-collapses — unless the user
   * has toggled it themselves.
   * @defaultValue false
   */
  streaming?: boolean;
  /**
   * How long the reasoning took, in seconds. Rendered by the default trigger
   * label as "Worked for N seconds" once `streaming` is over.
   */
  duration?: number;
  /** Called when the panel is opened or closed. */
  onOpenChange?: (open: boolean) => void;
}

function ReasoningRoot({
  className,
  streaming = false,
  duration,
  open: openProp,
  defaultOpen,
  onOpenChange,
  children,
  ...props
}: ReasoningProps) {
  const [open, setOpenUnwrapped] = useControlled({
    controlled: openProp,
    default: defaultOpen ?? streaming,
    name: 'Reasoning',
    state: 'open'
  });

  const userToggledRef = useRef(false);
  const onOpenChangeRef = useRef(onOpenChange);
  onOpenChangeRef.current = onOpenChange;

  const setOpen = (next: boolean) => {
    setOpenUnwrapped(next);
    onOpenChangeRef.current?.(next);
  };

  // Auto-open while streaming and auto-collapse on completion, but hand the
  // panel over to the user as soon as they toggle it manually.
  const prevStreamingRef = useRef(streaming);
  const setOpenRef = useRef(setOpen);
  setOpenRef.current = setOpen;
  useEffect(() => {
    if (prevStreamingRef.current === streaming) return;
    prevStreamingRef.current = streaming;
    if (userToggledRef.current) return;
    setOpenRef.current(streaming);
  }, [streaming]);

  const contextValue = useMemo<ReasoningContextValue>(
    () => ({ streaming, duration, open }),
    [streaming, duration, open]
  );

  return (
    <ReasoningContext.Provider value={contextValue}>
      <Collapsible
        className={cx(styles.reasoning, className)}
        open={open}
        onOpenChange={next => {
          userToggledRef.current = true;
          setOpen(next);
        }}
        {...props}
      >
        {children}
      </Collapsible>
    </ReasoningContext.Provider>
  );
}

ReasoningRoot.displayName = 'Reasoning';

export interface ReasoningTriggerProps
  extends ComponentProps<typeof Collapsible.Trigger> {}

function defaultTriggerLabel(streaming: boolean, duration?: number): ReactNode {
  if (streaming) {
    return (
      <span className={styles['reasoning-label-streaming']}>Thinking…</span>
    );
  }
  if (duration != null) {
    return `Worked for ${duration} ${duration === 1 ? 'second' : 'seconds'}`;
  }
  return 'Reasoning';
}

export function ReasoningTrigger({
  className,
  children,
  ...props
}: ReasoningTriggerProps) {
  const { streaming, duration } = useReasoningContext('Trigger');
  return (
    <Collapsible.Trigger
      className={cx(styles['reasoning-trigger'], className)}
      {...props}
    >
      {children ?? defaultTriggerLabel(streaming, duration)}
      <ChevronRightIcon
        className={styles['reasoning-chevron']}
        aria-hidden='true'
      />
    </Collapsible.Trigger>
  );
}

ReasoningTrigger.displayName = 'Reasoning.Trigger';

export interface ReasoningContentProps
  extends ComponentProps<typeof Collapsible.Panel> {}

export function ReasoningContent({
  className,
  children,
  ...props
}: ReasoningContentProps) {
  return (
    <Collapsible.Panel
      className={cx(styles['reasoning-panel'], className)}
      {...props}
    >
      <div className={styles['reasoning-body']}>{children}</div>
    </Collapsible.Panel>
  );
}

ReasoningContent.displayName = 'Reasoning.Content';

export interface ReasoningStepProps extends ComponentProps<'div'> {
  /** Title row of the step, e.g. "Gathering ticket updates". */
  label?: ReactNode;
}

export function ReasoningStep({
  className,
  label,
  children,
  ...props
}: ReasoningStepProps) {
  return (
    <div className={cx(styles['reasoning-step'], className)} {...props}>
      {label && <div className={styles['reasoning-step-label']}>{label}</div>}
      {children && (
        <div className={styles['reasoning-step-body']}>{children}</div>
      )}
    </div>
  );
}

ReasoningStep.displayName = 'Reasoning.Step';

export const Reasoning = Object.assign(ReasoningRoot, {
  Trigger: ReasoningTrigger,
  Content: ReasoningContent,
  Step: ReasoningStep
});
