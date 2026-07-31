'use client';

import { ArrowUpIcon, StopIcon } from '@radix-ui/react-icons';
import { cx } from 'class-variance-authority';
import { ComponentProps, MouseEvent } from 'react';
import { Spinner } from '../spinner';
import styles from './prompt-input.module.css';
import { usePromptInputContext } from './prompt-input-context';

export interface PromptInputSubmitProps extends ComponentProps<'button'> {}

export function PromptInputSubmit({
  className,
  children,
  onClick,
  disabled,
  'aria-label': ariaLabel,
  ...props
}: PromptInputSubmitProps) {
  const context = usePromptInputContext('Submit');
  const busy = context.status === 'submitted' || context.status === 'streaming';
  // Reported by the mounted input part, so a message of nothing but a chip is
  // sendable and a lone trailing space is not.
  const empty = context.empty;

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    if (busy) context.onStop?.();
  };

  return (
    <button
      // While a response is in flight the button becomes a stop control and
      // must not resubmit the form.
      type={busy ? 'button' : 'submit'}
      className={cx(styles.submit, className)}
      data-status={context.status}
      disabled={disabled ?? (context.disabled || (!busy && empty))}
      aria-label={ariaLabel ?? (busy ? 'Stop response' : 'Send message')}
      onClick={handleClick}
      {...props}
    >
      {children ??
        (context.status === 'submitted' ? (
          <Spinner size={2} color='default' aria-hidden='true' />
        ) : context.status === 'streaming' ? (
          <StopIcon aria-hidden='true' />
        ) : (
          <ArrowUpIcon aria-hidden='true' />
        ))}
    </button>
  );
}

PromptInputSubmit.displayName = 'PromptInput.Submit';
