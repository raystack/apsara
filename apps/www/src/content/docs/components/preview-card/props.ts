export interface PreviewCardRootProps {
  /** Whether the preview card is currently open (controlled). */
  open?: boolean;

  /**
   * Whether the preview card is initially open (uncontrolled).
   * @defaultValue false
   */
  defaultOpen?: boolean;

  /** Event handler called when the preview card is opened or closed. */
  onOpenChange?: (open: boolean) => void;

  /** Event handler called after any animations complete when the preview card is opened or closed. */
  onOpenChangeComplete?: (open: boolean) => void;

  /**
   * A ref to imperative actions.
   * - `unmount`: Unmounts the preview card popup.
   * - `close`: Closes the preview card imperatively when called.
   * @remarks `React.RefObject<PreviewCard.Root.Actions | null>`
   */
  actionsRef?: React.RefObject<{
    unmount: () => void;
    close: () => void;
  } | null>;

  /**
   * ID of the trigger that the preview card is associated with.
   * Useful in conjunction with the `defaultOpen` prop.
   */
  defaultTriggerId?: string | null;

  /**
   * ID of the trigger that the preview card is associated with.
   * Useful in conjunction with the `open` prop for controlled preview cards.
   */
  triggerId?: string | null;

  /**
   * A handle to associate the preview card with a trigger.
   * If specified, allows external triggers to control the card's open state.
   * Can be created with `PreviewCard.createHandle()`.
   */
  handle?: unknown;

  /**
   * The content of the preview card.
   * Can be a regular React node or a render function that receives the payload of the active trigger.
   */
  children?: React.ReactNode | ((payload: unknown) => React.ReactNode);
}

export interface PreviewCardTriggerProps {
  /** The URL that the link points to. */
  href?: string;

  /**
   * How long to wait before the preview card opens. Specified in milliseconds.
   * @defaultValue 600
   */
  delay?: number;

  /**
   * How long to wait before closing the preview card. Specified in milliseconds.
   * @defaultValue 300
   */
  closeDelay?: number;

  /** A handle to associate the trigger with a preview card. */
  handle?: unknown;

  /** A payload to pass to the preview card when it is opened. */
  payload?: unknown;

  /**
   * CSS class applied to the element, or a function that returns a class based on state.
   */
  className?: string | ((state: { open: boolean }) => string | undefined);

  /**
   * Allows you to replace the component's HTML element
   * with a different tag, or compose it with another component.
   *
   * @remarks `ReactElement | function`
   */
  render?:
    | React.ReactElement
    | ((
        props: React.HTMLAttributes<HTMLElement>,
        state: { open: boolean }
      ) => React.ReactElement);
}

export interface PreviewCardContentProps {
  /**
   * Controls whether to show the arrow.
   * @defaultValue false
   */
  showArrow?: boolean;

  /**
   * Which side of the anchor element to align the popup against.
   * May automatically change to avoid collisions.
   * @defaultValue 'bottom'
   */
  side?: 'top' | 'right' | 'bottom' | 'left';

  /**
   * How to align the popup relative to the specified side.
   * @defaultValue 'center'
   */
  align?: 'start' | 'center' | 'end';

  /**
   * Distance between the anchor and the popup in pixels.
   * Also accepts a function to read anchor/positioner dimensions.
   * @remarks `number | OffsetFunction`
   * @defaultValue 4
   */
  sideOffset?: number | ((data: OffsetData) => number);

  /**
   * Additional offset along the alignment axis in pixels.
   * Also accepts a function to read anchor/positioner dimensions.
   * @remarks `number | OffsetFunction`
   * @defaultValue 0
   */
  alignOffset?: number | ((data: OffsetData) => number);

  /**
   * Additional space to maintain from the edge of the collision boundary.
   */
  collisionPadding?: number;

  /**
   * An element or a rectangle that delimits the area that the popup is confined to.
   * @defaultValue 'clipping-ancestors'
   */
  collisionBoundary?: Element | Element[] | 'clipping-ancestors';

  /**
   * Determines how to handle collisions when positioning the popup.
   */
  collisionAvoidance?: {
    side?: 'escape' | 'flip';
    align?: 'shift' | 'flip';
  };

  /**
   * Whether to disable the popup from tracking any layout shift of its positioning anchor.
   * @defaultValue false
   */
  disableAnchorTracking?: boolean;

  /**
   * Minimum distance to maintain between the arrow and the edges of the popup.
   * Prevents the arrow element from hanging out of rounded corners.
   * @defaultValue 5
   */
  arrowPadding?: number;

  /**
   * An element to position the popup against.
   * By default, the popup will be positioned against the trigger.
   */
  anchor?: Element | React.RefObject<Element | null> | null;

  /**
   * Whether to maintain the popup in the viewport after the anchor element was scrolled out of view.
   * @defaultValue false
   */
  sticky?: boolean;

  /**
   * Determines which CSS `position` property to use.
   * @defaultValue 'absolute'
   */
  positionMethod?: 'absolute' | 'fixed';

  /**
   * Allows you to replace the popup's HTML element with a different tag, or compose it with another component.
   *
   * @remarks `ReactElement | function`
   */
  render?:
    | React.ReactElement
    | ((
        props: React.HTMLAttributes<HTMLElement>,
        state: { open: boolean; side: string; align: string }
      ) => React.ReactElement);

  /** Content to render inside the preview card. */
  children?: React.ReactNode;
}

export interface PreviewCardViewportProps {
  /**
   * Allows you to replace the component's HTML element
   * with a different tag, or compose it with another component.
   *
   * @remarks `ReactElement | function`
   */
  render?:
    | React.ReactElement
    | ((
        props: React.HTMLAttributes<HTMLElement>,
        state: Record<string, unknown>
      ) => React.ReactElement);
}

interface OffsetData {
  anchor: { width: number; height: number };
  positioner: { width: number; height: number };
  side: 'top' | 'bottom' | 'left' | 'right';
  align: 'start' | 'center' | 'end';
}
