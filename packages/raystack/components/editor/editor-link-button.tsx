'use client';

import { useEffect, useState } from 'react';
import { LinkIcon } from '~/icons';
import { Popover } from '../popover';
import { activeLink, canSetLink } from './core/commands';
import styles from './editor.module.css';
import { useEditorStore, useStoreSelector } from './editor-context';
import { EditorControl, type EditorControlBaseProps } from './editor-control';
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
  const enabled = useStoreSelector(
    store,
    current => current.isEditable() && canSetLink(current.state)
  );

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

  const control = {
    'data-slot': 'editor-link-button',
    label,
    shortcut: store.shortcuts.link,
    tooltip,
    pressed: active,
    disabled: !enabled
  };
  const content = children ?? <LinkIcon />;

  if (floating) {
    return (
      <EditorControl
        {...control}
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
      <EditorControl
        {...control}
        render={<Popover.Trigger />}
        onClick={onClick}
        {...props}
      >
        {content}
      </EditorControl>
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
