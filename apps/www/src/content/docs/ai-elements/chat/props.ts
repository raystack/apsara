import type React from 'react';

export interface ChatMessagesProps {
  /**
   * Distance from the bottom, in pixels, within which the reader still
   * counts as being at the live edge.
   * @defaultValue 24
   */
  bottomThreshold?: number;

  /**
   * Gap kept between the viewport top and an item anchored by
   * `scrollAnchor` or scrolled to with `scrollToMessage`, in pixels.
   * @defaultValue 12
   */
  anchorOffset?: number;

  /**
   * Whether to follow new content while the reader is at the live edge.
   * @defaultValue true
   */
  autoScroll?: boolean;

  /** A ref populated with the imperative scroll commands. */
  actionsRef?: React.RefObject<ChatMessagesActions | null>;

  /**
   * Accessible label for the message log.
   * @defaultValue "Conversation"
   */
  'aria-label'?: string;

  /** Custom CSS class names. */
  className?: string;
}

export interface ChatMessagesActions {
  /** Scrolls the conversation to the live edge. */
  scrollToBottom: (behavior?: ScrollBehavior) => void;

  /** Scrolls the item registered with the given `messageId` into view. */
  scrollToMessage: (
    id: string,
    options?: { behavior?: ScrollBehavior }
  ) => void;
}

export interface UseChatMessagesReturn {
  /** Whether the reader is at the live edge (scrolled to the bottom). */
  atBottom: boolean;

  /**
   * Ids of the registered items currently intersecting the viewport, in
   * document order. Only items given a `messageId` are tracked.
   */
  visibleMessageIds: string[];

  /** Scrolls the conversation to the live edge. */
  scrollToBottom: (behavior?: ScrollBehavior) => void;

  /** Scrolls the item registered with the given `messageId` into view. */
  scrollToMessage: (
    id: string,
    options?: { behavior?: ScrollBehavior }
  ) => void;
}

export interface ChatItemProps {
  /**
   * Stable id registered with the enclosing `Chat.Messages`, enabling
   * visibility tracking and `scrollToMessage`.
   */
  messageId?: string;

  /**
   * Marks the item as a scroll anchor: when it mounts inside
   * `Chat.Messages`, the viewport scrolls it near the top so the reply can
   * stream in below — set it on the latest user message.
   * @defaultValue false
   */
  scrollAnchor?: boolean;

  /** Custom CSS class names. */
  className?: string;
}

export interface ChatAttachmentProps {
  /** File name or main label. */
  title?: React.ReactNode;

  /** Secondary line — file size, type, or the error message. */
  description?: React.ReactNode;

  /**
   * Content of the leading media square. Defaults to a file icon, or a
   * spinner while `state` is `"uploading"`.
   */
  media?: React.ReactNode;

  /**
   * Lifecycle of the attachment.
   * @defaultValue "done"
   */
  state?: 'uploading' | 'error' | 'done';

  /** When provided, renders a remove button that calls it. */
  onRemove?: () => void;

  /**
   * Accessible label for the remove button.
   * @defaultValue "Remove attachment"
   */
  removeLabel?: string;

  /** Custom CSS class names. */
  className?: string;
}
