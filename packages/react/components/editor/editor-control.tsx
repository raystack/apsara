'use client';

import { cx } from 'class-variance-authority';
import {
  type ComponentProps,
  cloneElement,
  type ReactElement,
  useMemo
} from 'react';
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

export interface EditorControlBaseProps
  extends Omit<
    ComponentProps<typeof Toolbar.Button>,
    'aria-pressed' | 'render'
  > {
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
  /** Sets `aria-pressed`. Leave undefined for a plain button. */
  pressed?: boolean;
  /** A trigger, such as `<Menu.Trigger />`, that the button renders inside. */
  render?: ReactElement<{ render?: ReactElement }>;
}

/** A toolbar button with a tooltip that shows its label and shortcut. */
export function EditorControl({
  label,
  shortcut,
  tooltip = true,
  pressed,
  render,
  className,
  onMouseDown,
  children,
  ...props
}: EditorControlProps) {
  const button = (
    <Toolbar.Button
      aria-label={label}
      aria-pressed={pressed}
      className={cx(styles.control, className)}
      // A press must not move focus or collapse the editor's selection.
      onMouseDown={event => {
        event.preventDefault();
        onMouseDown?.(event);
      }}
      {...props}
    />
  );
  // The tooltip stays mounted when it is off, so the trigger element, and
  // any menu anchored to it, is never remounted.
  return (
    <Tooltip disabled={!tooltip}>
      <Tooltip.Trigger
        render={render ? cloneElement(render, { render: button }) : button}
      >
        {children}
      </Tooltip.Trigger>
      <Tooltip.Content>
        <span className={styles.tooltip}>
          <span>{label}</span>
          <EditorShortcutKeys shortcut={shortcut} />
        </span>
      </Tooltip.Content>
    </Tooltip>
  );
}
