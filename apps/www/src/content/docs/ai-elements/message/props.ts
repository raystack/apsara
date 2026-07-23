export interface MessageProps {
  /**
   * Which side of the conversation the message sits on. `"end"` aligns the
   * message to the trailing edge (the sender's own messages); `"start"` to
   * the leading edge.
   * @defaultValue "start"
   */
  align?: 'start' | 'end';

  /** Custom CSS class names. */
  className?: string;
}

export interface MessageBubbleProps {
  /**
   * Visual style of the message surface.
   * @defaultValue "solid"
   */
  variant?: 'solid' | 'outline';

  /**
   * Color of the message surface.
   * @defaultValue "neutral"
   */
  color?: 'accent' | 'neutral' | 'danger';

  /** Custom CSS class names. */
  className?: string;
}
