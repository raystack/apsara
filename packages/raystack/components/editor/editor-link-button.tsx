'use client';

import { useEffect, useState } from 'react';
import { LinkIcon } from '~/icons';
import { Popover } from '../popover';
import { Toolbar } from '../toolbar';
import { activeLink } from './core/commands';
import styles from './editor.module.css';
import { useEditorStore, useStoreSelector } from './editor-context';
import {
  EditorControl,
  type EditorControlBaseProps,
  EditorTooltip
} from './editor-control';
import { useFloatingToolbar } from './editor-floating-context';
import { EditorLinkForm } from './editor-link-form';

export interface EditorLinkButtonProps extends EditorControlBaseProps {}

/**
 * Adds, edits or removes a link. In the floating toolbar the URL field
 * replaces the buttons. In the fixed toolbar it opens in a popover.
 */
export function EditorLinkButton({
  label = 'Link',
  tooltip = true,
  children,
  onClick,
  ...props
}: EditorLinkButtonProps) {
  const store = useEditorStore('Editor.LinkButton');
  const floating = useFloatingToolbar();
  const [open, setOpen] = useState(false);

  const active = useStoreSelector(
    store,
    current => activeLink(current.state) !== null
  );
  const enabled = useStoreSelector(store, current => {
    const type = current.schema.marks.link;
    return (
      current.isEditable() &&
      !!type &&
      current.state.selection.$from.parent.type.allowsMarkType(type)
    );
  });

  const openLink = floating?.openLink;
  const visible = floating?.visible ?? false;
  useEffect(() => {
    if (!enabled) return;
    if (openLink) {
      return store.registerLinkOpener(1, () => {
        if (!visible) return false;
        openLink();
        return true;
      });
    }
    return store.registerLinkOpener(0, () => {
      setOpen(true);
      return true;
    });
  }, [store, enabled, openLink, visible]);

  if (!store.schema.marks.link) return null;

  const shortcut = store.shortcuts.link;
  const content = children ?? <LinkIcon />;

  if (floating) {
    return (
      <EditorControl
        data-slot='editor-link-button'
        label={label}
        shortcut={shortcut}
        tooltip={tooltip}
        pressed={active}
        disabled={!enabled}
        onClick={event => {
          floating.openLink();
          onClick?.(event);
        }}
        {...props}
      >
        {content}
      </EditorControl>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <EditorTooltip
        label={label}
        shortcut={shortcut}
        enabled={tooltip && !open}
        trigger={
          <Popover.Trigger
            render={
              <Toolbar.Button
                data-slot='editor-link-button'
                aria-label={label}
                aria-pressed={active}
                data-active={active ? '' : undefined}
                disabled={!enabled}
                onClick={onClick}
                {...props}
              />
            }
          >
            {content}
          </Popover.Trigger>
        }
      />
      <Popover.Content
        side='bottom'
        align='start'
        className={styles['link-popover']}
        finalFocus={false}
      >
        <EditorLinkForm onDone={() => setOpen(false)} />
      </Popover.Content>
    </Popover>
  );
}

EditorLinkButton.displayName = 'Editor.LinkButton';
