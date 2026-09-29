'use client';

import { type ComponentType, type ReactNode, useMemo, useState } from 'react';
import { CheckIcon, ChevronDownIcon } from '~/icons';
import { Menu } from '../menu';
import styles from './editor.module.css';
import { useEditorStore } from './editor-context';
import {
  EditorControl,
  type EditorControlBaseProps,
  EditorShortcutKeys
} from './editor-control';
import { useHoldFloatingToolbar } from './editor-floating-context';

export interface EditorMenuOption {
  key: string;
  label: string;
  Icon: ComponentType;
  shortcut?: string | false;
  active: boolean;
  disabled: boolean;
  run: () => void;
}

/** Compares the flags of a dry run, so an unchanged result skips the render. */
export function sameFlags(a: boolean[], b: boolean[]): boolean {
  return a.length === b.length && a.every((flag, index) => flag === b[index]);
}

interface EditorMenuControlProps extends EditorControlBaseProps {
  label: string;
  trigger: ReactNode;
  /** The rows. They render only while the menu is open. */
  children: ReactNode;
}

/** A toolbar button that opens a menu of block types. */
export function EditorMenuControl({
  label,
  tooltip = true,
  trigger,
  disabled,
  children,
  ...props
}: EditorMenuControlProps) {
  const store = useEditorStore('Editor.Toolbar');
  const [open, setOpen] = useState(false);
  useHoldFloatingToolbar(open);

  // Focus goes back to the editor, which restores its selection.
  const finalFocus = useMemo(
    () => ({
      get current() {
        return (store.view?.dom as HTMLElement | undefined) ?? null;
      }
    }),
    [store]
  );

  return (
    <Menu open={open} onOpenChange={setOpen} modal={false}>
      <EditorControl
        label={label}
        tooltip={tooltip}
        disabled={disabled}
        render={<Menu.Trigger disabled={disabled} />}
        {...props}
      >
        {trigger}
        <ChevronDownIcon className={styles['menu-chevron']} />
      </EditorControl>
      <Menu.Content finalFocus={finalFocus} className={styles.menu}>
        {children}
      </Menu.Content>
    </Menu>
  );
}

export function EditorMenuItems({ options }: { options: EditorMenuOption[] }) {
  return options.map(option => (
    <Menu.Item
      key={option.key}
      role='menuitemradio'
      aria-checked={option.active}
      disabled={option.disabled}
      leadingIcon={<option.Icon />}
      trailingIcon={
        <span className={styles['menu-trailing']}>
          <EditorShortcutKeys shortcut={option.shortcut} />
          <CheckIcon
            className={styles['menu-check']}
            data-visible={option.active ? '' : undefined}
          />
        </span>
      }
      onClick={option.run}
    >
      {option.label}
    </Menu.Item>
  ));
}
