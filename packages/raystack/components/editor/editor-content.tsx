'use client';

import { useMergedRefs } from '@base-ui/utils/useMergedRefs';
import { cx } from 'class-variance-authority';
import { EditorView } from 'prosemirror-view';
import {
  type ComponentProps,
  Fragment,
  useLayoutEffect,
  useRef,
  useState
} from 'react';
import { createPortal } from 'react-dom';
import { docToHTML } from './core/serializers';
import { useMentionRegistryVersion } from './core/use-suggestion-menu';
import styles from './editor.module.css';
import { useEditorStore, useStoreSelector } from './editor-context';

export interface EditorContentProps
  extends Omit<
    ComponentProps<'div'>,
    'contentEditable' | 'children' | 'dangerouslySetInnerHTML' | 'role'
  > {
  /**
   * Turns the browser's spell check on or off.
   * @default true
   */
  spellCheck?: boolean;
}

/** The mount point for the editable document. */
export function EditorContent({
  className,
  spellCheck = true,
  ref,
  ...props
}: EditorContentProps) {
  const store = useEditorStore('Editor.Content');
  const hostRef = useRef<HTMLDivElement | null>(null);
  const mergedRef = useMergedRefs(hostRef, ref);

  // The server and the first client render show the doc as HTML, so there is
  // no empty box before ProseMirror takes the subtree over.
  const [initialHtml] = useState(() => ({
    __html: docToHTML(store.state.doc)
  }));

  useLayoutEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    host.replaceChildren();
    const view = new EditorView(
      { mount: host },
      {
        state: store.state,
        editable: () => store.isEditable(),
        dispatchTransaction: store.dispatch,
        nodeViews: store.nodeViews
      }
    );
    store.attachView(view);
    if (store.autoFocus) {
      store.focus(store.autoFocus === true ? undefined : store.autoFocus);
    }
    return () => {
      store.detachView(view);
      view.destroy();
    };
  }, [store]);

  const readOnly = useStoreSelector(store, current => current.props.readOnly);
  const disabled = useStoreSelector(store, current => current.props.disabled);
  const hasMenus = useStoreSelector(store, current => current.hasTriggers());
  const menu = useStoreSelector(store, current => {
    const trigger = current.suggestion?.trigger;
    return trigger ? current.menus.get(trigger) : undefined;
  });
  const portals = useStoreSelector(store, current => current.mentionPortals);
  useMentionRegistryVersion(store.mentions);

  return (
    <>
      <div
        {...props}
        ref={mergedRef}
        data-slot='editor-content'
        className={cx(styles.content, className)}
        role='textbox'
        aria-multiline='true'
        aria-readonly={readOnly || undefined}
        aria-disabled={disabled || undefined}
        aria-autocomplete={hasMenus ? 'list' : undefined}
        aria-expanded={hasMenus ? menu !== undefined : undefined}
        aria-controls={menu?.listboxId}
        aria-activedescendant={menu?.activeOptionId}
        spellCheck={spellCheck}
        // ProseMirror takes this subtree over on mount.
        suppressHydrationWarning
        dangerouslySetInnerHTML={initialHtml}
      />
      {portals.map(portal => {
        const item = store.mentions.lookup(
          portal.attrs.trigger,
          portal.attrs.type,
          portal.attrs.id
        );
        return (
          <Fragment key={portal.id}>
            {item?.icon ? createPortal(item.icon, portal.iconTarget) : null}
            {item?.trailing
              ? createPortal(item.trailing, portal.trailingTarget)
              : null}
          </Fragment>
        );
      })}
    </>
  );
}

EditorContent.displayName = 'Editor.Content';
