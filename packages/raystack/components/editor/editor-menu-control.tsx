'use client';

import { type ComponentType, type ReactNode, useMemo, useState } from 'react';
import { CheckIcon, ChevronDownIcon } from '~/icons';
import { Menu } from '../menu';
import { Toolbar } from '../toolbar';
import styles from './editor.module.css';
import { useEditorStore } from './editor-context';
import {
  type EditorControlBaseProps,
  EditorShortcutKeys,
  EditorTooltip
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

interface EditorMenuControlProps extends EditorControlBaseProps {
  label: string;
  trigger: ReactNode;
  options: EditorMenuOption[];
}

/** A toolbar button that opens a menu of block types. */
export function EditorMenuControl({
  label,
  tooltip = true,
  trigger,
  options,
  disabled,
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
      <EditorTooltip
        label={label}
        enabled={tooltip}
        trigger={
          <Menu.Trigger
            disabled={disabled}
            render={
              <Toolbar.Button
                aria-label={label}
                disabled={disabled}
                {...props}
              />
            }
          >
            {trigger}
            <ChevronDownIcon className={styles['menu-chevron']} />
          </Menu.Trigger>
        }
      />
      <Menu.Content finalFocus={finalFocus} className={styles.menu}>
        {options.map(option => (
          <Menu.Item
            key={option.key}
            role='menuitemradio'
            aria-checked={option.active}
            data-active={option.active ? '' : undefined}
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
        ))}
      </Menu.Content>
    </Menu>
  );
}
