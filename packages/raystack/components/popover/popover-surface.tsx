'use client';

import { Popover as PopoverPrimitive } from '@base-ui/react';

/**
 * The `Portal > Positioner > Popup` surface, shared by `Popover.Content` and
 * `CalendarPreview.Content` — previously the same component written twice.
 *
 * Known limitation, now in one place: anything not destructured below lands on
 * the positioner, so a popup-only prop such as `id` reaches the wrong element.
 * Partitioning by an enumerated key list was rejected — Base UI has 20
 * positioning props and a minor bump adding one would misroute it silently.
 */
export interface PopoverSurfaceProps
  extends Omit<
      PopoverPrimitive.Positioner.Props,
      'render' | 'className' | 'style' | 'ref'
    >,
    PopoverPrimitive.Popup.Props {
  /** Class for the positioner — in practice the z-index layer. */
  positionerClassName?: string;
  positionerSlot?: string;
  popupSlot?: string;
}

export function PopoverSurface({
  ref,
  initialFocus,
  finalFocus,
  className,
  style,
  render,
  children,
  positionerClassName,
  positionerSlot,
  popupSlot,
  ...positionerProps
}: PopoverSurfaceProps) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Positioner
        sideOffset={4}
        collisionPadding={3}
        className={positionerClassName}
        data-slot={positionerSlot}
        {...positionerProps}
      >
        <PopoverPrimitive.Popup
          ref={ref}
          className={className}
          render={render}
          initialFocus={initialFocus}
          finalFocus={finalFocus}
          style={style}
          data-slot={popupSlot}
        >
          {children}
        </PopoverPrimitive.Popup>
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  );
}

PopoverSurface.displayName = 'PopoverSurface';
