'use client';

import { Cross2Icon, FileTextIcon } from '@radix-ui/react-icons';
import { cx } from 'class-variance-authority';
import { ComponentProps, ReactNode } from 'react';
import { IconButton } from '../icon-button';
import { Spinner } from '../spinner';
import styles from './chat.module.css';

export type ChatAttachmentState = 'uploading' | 'error' | 'done';

export interface ChatAttachmentProps
  extends Omit<ComponentProps<'div'>, 'title'> {
  /** File name or main label. */
  title?: ReactNode;
  /** Secondary line — file size, type, or the error message. */
  description?: ReactNode;
  /**
   * Content of the leading media square. Defaults to a file icon, or a
   * spinner while `state` is `"uploading"`.
   */
  media?: ReactNode;
  /**
   * Lifecycle of the attachment.
   * @defaultValue "done"
   */
  state?: ChatAttachmentState;
  /** When provided, renders a remove button that calls it. */
  onRemove?: () => void;
  /**
   * Accessible label for the remove button.
   * @defaultValue "Remove attachment"
   */
  removeLabel?: string;
}

export function ChatAttachment({
  className,
  title,
  description,
  media,
  state = 'done',
  onRemove,
  removeLabel = 'Remove attachment',
  children,
  ...props
}: ChatAttachmentProps) {
  return (
    <div
      data-state={state}
      className={cx(styles.attachment, className)}
      data-slot='chat-attachment'
      {...props}
    >
      <div
        className={styles['attachment-media']}
        aria-hidden='true'
        data-slot='chat-attachment-media'
      >
        {media ??
          (state === 'uploading' ? (
            <Spinner size={2} aria-hidden='true' />
          ) : (
            <FileTextIcon />
          ))}
      </div>
      {(title || description) && (
        <div
          className={styles['attachment-body']}
          data-slot='chat-attachment-body'
        >
          {title && (
            <span
              className={styles['attachment-title']}
              data-slot='chat-attachment-title'
            >
              {title}
            </span>
          )}
          {description && (
            <span
              className={styles['attachment-description']}
              data-slot='chat-attachment-description'
            >
              {description}
            </span>
          )}
        </div>
      )}
      {children}
      {onRemove && (
        <IconButton
          size={2}
          aria-label={removeLabel}
          className={styles['attachment-remove']}
          onClick={onRemove}
          data-slot='chat-attachment-remove'
        >
          <Cross2Icon />
        </IconButton>
      )}
    </div>
  );
}

ChatAttachment.displayName = 'Chat.Attachment';
