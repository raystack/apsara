'use client';

import { type ComponentProps, type ReactElement, useMemo } from 'react';
import { Kbd } from '../kbd';
import { Toolbar } from '../toolbar';
import { Tooltip } from '../tooltip';
import { formatShortcut } from './core/shortcuts';
import styles from './editor.module.css';

/** The key caps for a shortcut, or nothing when it is turned off. */
export function EditorShortcutKeys({
  shortcut
}: {
  shortcut?: string | false;
}) {
  const keys = useMemo(
    () => (shortcut ? formatShortcut(shortcut) : []),
    [shortcut]
  );
  if (keys.length === 0) return null;
  return (
    <Kbd.Group className={styles['shortcut-keys']}>
      {keys.map((key, index) => (
        <Kbd key={`${key}-${index}`}>{key}</Kbd>
      ))}
    </Kbd.Group>
  );
}

export function EditorTooltip({
  label,
  shortcut,
  enabled = true,
  trigger
}: {
  label: string;
  shortcut?: string | false;
  enabled?: boolean;
  trigger: ReactElement;
}) {
  if (!enabled) return trigger;
  return (
    <Tooltip>
      <Tooltip.Trigger render={trigger} />
      <Tooltip.Content>
        <span className={styles.tooltip}>
          <span>{label}</span>
          <EditorShortcutKeys shortcut={shortcut} />
        </span>
      </Tooltip.Content>
    </Tooltip>
  );
}

export interface EditorControlBaseProps
  extends Omit<ComponentProps<typeof Toolbar.Button>, 'aria-pressed'> {
  /** Accessible name and tooltip text. */
  label?: string;
  /**
   * Shows the label and shortcut in a tooltip.
   * @default true
   */
  tooltip?: boolean;
}

interface EditorControlProps extends EditorControlBaseProps {
  label: string;
  shortcut?: string | false;
  /** Sets `aria-pressed` and `data-active`. Leave undefined for a plain button. */
  pressed?: boolean;
}

/** A toolbar button with a tooltip that shows its label and shortcut. */
export function EditorControl({
  label,
  shortcut,
  tooltip = true,
  pressed,
  onMouseDown,
  children,
  ...props
}: EditorControlProps) {
  const button = (
    <Toolbar.Button
      aria-label={label}
      aria-pressed={pressed}
      data-active={pressed ? '' : undefined}
      // A press must not move focus or collapse the editor's selection.
      onMouseDown={event => {
        event.preventDefault();
        onMouseDown?.(event);
      }}
      {...props}
    >
      {children}
    </Toolbar.Button>
  );
  return (
    <EditorTooltip
      label={label}
      shortcut={shortcut}
      enabled={tooltip}
      trigger={button}
    />
  );
}
