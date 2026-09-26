'use client';

import { useState } from 'react';
import { CheckIcon, ExternalLinkIcon, UnlinkIcon } from '~/icons';
import { IconButton } from '../icon-button';
import { Input } from '../input';
import { activeLink, setLink, unsetLink } from './core/commands';
import { isSafeHref, normalizeHref } from './core/link';
import styles from './editor.module.css';
import { useEditorStore } from './editor-context';

export interface EditorLinkFormProps {
  /** Called after the link is applied or removed, or the form is cancelled. */
  onDone: () => void;
}

/** The URL field behind `Editor.LinkButton`. */
export function EditorLinkForm({ onDone }: EditorLinkFormProps) {
  const store = useEditorStore('Editor.LinkButton');
  const [initial] = useState(() => activeLink(store.state));
  const [href, setHref] = useState(initial ?? '');

  const normalized = normalizeHref(href);
  const valid = normalized !== '' && isSafeHref(normalized);

  const finish = () => {
    onDone();
    store.view?.focus();
  };

  const apply = () => {
    if (!valid) return;
    store.run(setLink(normalized));
    finish();
  };

  return (
    <div className={styles['link-form']} data-slot='editor-link-form'>
      <Input
        size='small'
        variant='borderless'
        data-slot='editor-link-input'
        aria-label='Link URL'
        placeholder='Paste a link…'
        value={href}
        autoFocus
        onChange={event => setHref(event.target.value)}
        onKeyDown={event => {
          if (event.key === 'Enter') {
            event.preventDefault();
            apply();
          } else if (event.key === 'Escape') {
            event.preventDefault();
            event.stopPropagation();
            finish();
          }
        }}
      />
      <IconButton
        size={2}
        aria-label='Apply link'
        disabled={!valid}
        onClick={apply}
      >
        <CheckIcon />
      </IconButton>
      <IconButton
        size={2}
        aria-label='Open link'
        disabled={!valid}
        onClick={() => window.open(normalized, '_blank', 'noopener,noreferrer')}
      >
        <ExternalLinkIcon />
      </IconButton>
      {initial ? (
        <IconButton
          size={2}
          aria-label='Remove link'
          onClick={() => {
            store.run(unsetLink);
            finish();
          }}
        >
          <UnlinkIcon />
        </IconButton>
      ) : null}
    </div>
  );
}
