'use client';

import {
  Combobox as ComboboxPrimitive,
  Select as SelectPrimitive
} from '@base-ui/react';
import { measureElement, useVirtualizer } from '@tanstack/react-virtual';
import { cx } from 'class-variance-authority';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { type Radius, radiusStyle } from '../../shared/radius';
import { useThemeInjection } from '../theme/portal';
import styles from './select.module.css';
import { SelectItem } from './select-item';
import { useSelectContext } from './select-root';

/* The height of a one-line item at `--rs-scaling: 1`. Rows are measured after render. */
const ESTIMATED_ROW_HEIGHT = 32;
const OVERSCAN = 8;

function SelectVirtualRows({
  scrollElement
}: {
  scrollElement: HTMLDivElement | null;
}) {
  const { options, scrollToIndexRef, inputValue, open, value } =
    useSelectContext();
  const filteredItems = ComboboxPrimitive.useFilteredItems<string>();
  const labels = useMemo(
    () => new Map(options?.map(option => [option.value, option.label])),
    [options]
  );
  /* The rows start after the list padding, which scales with the theme. The
     list has no padding while no item matches. */
  const hasRows = filteredItems.length > 0;
  const [padding, setPadding] = useState(0);
  useLayoutEffect(() => {
    if (!scrollElement || !hasRows) return;
    setPadding(
      Number.parseFloat(getComputedStyle(scrollElement).paddingTop) || 0
    );
  }, [scrollElement, hasRows]);
  const virtualizer = useVirtualizer({
    count: filteredItems.length,
    getScrollElement: () => scrollElement,
    estimateSize: () => ESTIMATED_ROW_HEIGHT,
    scrollMargin: padding,
    scrollPaddingEnd: padding,
    /* The closed popup stays mounted but hidden, so its rows measure 0. A
       0 size makes the virtualizer shift the scroll when the popup opens. */
    measureElement: (element, entry, instance) =>
      measureElement(element, entry, instance) || ESTIMATED_ROW_HEIGHT,
    overscan: OVERSCAN
  });

  useEffect(() => {
    scrollToIndexRef.current = index =>
      virtualizer.scrollToIndex(index, { align: 'auto' });
    return () => {
      scrollToIndexRef.current = null;
    };
  }, [virtualizer, scrollToIndexRef]);

  /* A search highlights the first result, and Base UI does not reset the
     scroll of a virtualized list. */
  const searchRef = useRef(inputValue);
  useEffect(() => {
    if (searchRef.current === inputValue) return;
    searchRef.current = inputValue;
    virtualizer.scrollToOffset(0);
  }, [inputValue, virtualizer]);

  /* Scrolls to the first selected row once each time the popup opens. */
  const isReady = open && !!scrollElement;
  const wasReadyRef = useRef(false);
  useEffect(() => {
    const opened = isReady && !wasReadyRef.current;
    wasReadyRef.current = isReady;
    if (!opened) return;
    const selected = new Set(Array.isArray(value) ? value : [value]);
    const index = filteredItems.findIndex(item => selected.has(item));
    if (index < 0) return;
    /* The popup is hidden until the next frame and cannot scroll before. */
    requestAnimationFrame(() =>
      virtualizer.scrollToIndex(index, { align: 'auto' })
    );
  }, [isReady, value, filteredItems, virtualizer]);

  if (!hasRows) return null;

  return (
    <div
      className={styles.virtualRows}
      style={{ height: virtualizer.getTotalSize() }}
    >
      {virtualizer.getVirtualItems().map(row => {
        const value = filteredItems[row.index];
        return (
          <SelectItem
            key={value}
            value={value}
            data-index={row.index}
            ref={virtualizer.measureElement}
            className={styles.virtualRow}
            style={{ transform: `translateY(${row.start - padding}px)` }}
          >
            {labels.get(value) ?? value}
          </SelectItem>
        );
      })}
    </div>
  );
}

export interface SelectContentProps
  extends Omit<
      SelectPrimitive.Positioner.Props,
      'render' | 'className' | 'style' | 'ref'
    >,
    SelectPrimitive.Popup.Props {
  /**
   * Placeholder of the search input when `autocomplete` is set.
   * @default "Search..."
   */
  searchPlaceholder?: string;
  /** Corner radius for this popup only. Defaults to the theme's `radius`. */
  radius?: Radius;
  /**
   * How to align the popup relative to the specified side.
   * @default "start"
   */
  align?: 'start' | 'center' | 'end';
  /**
   * Distance between the anchor and the popup in pixels.
   * @default 4
   */
  sideOffset?: SelectPrimitive.Positioner.Props['sideOffset'];
  /**
   * Whether the popup overlaps the trigger so the selected item's text lines up with the trigger's value. Has no effect when `autocomplete` is set.
   * @default false
   */
  alignItemWithTrigger?: boolean;
}

export function SelectContent({
  className,
  children,
  searchPlaceholder = 'Search...',
  radius,
  side = 'bottom',
  sideOffset = 4,
  align = 'start',
  alignItemWithTrigger = false,
  alignOffset,
  anchor,
  arrowPadding,
  collisionAvoidance,
  collisionBoundary,
  collisionPadding,
  disableAnchorTracking,
  positionMethod,
  sticky,
  ...props
}: SelectContentProps) {
  const { autocomplete, multiple, virtualized } = useSelectContext();
  const theme = useThemeInjection();
  const [listElement, setListElement] = useState<HTMLDivElement | null>(null);
  const positionerProps = {
    side,
    sideOffset,
    align,
    alignOffset,
    anchor,
    arrowPadding,
    collisionAvoidance,
    collisionBoundary,
    collisionPadding,
    disableAnchorTracking,
    positionMethod,
    sticky
  };

  if (autocomplete) {
    return (
      <ComboboxPrimitive.Portal keepMounted {...theme}>
        <ComboboxPrimitive.Positioner
          {...positionerProps}
          className={styles.positioner}
          data-slot='select-positioner'
        >
          <ComboboxPrimitive.Popup
            {...theme}
            className={cx(
              styles.content,
              virtualized && styles.virtualContent,
              theme?.className,
              radiusStyle({ radius }),
              className
            )}
            data-multiselectable={multiple ? true : undefined}
            data-slot='select-content'
            {...props}
          >
            <ComboboxPrimitive.Input
              placeholder={searchPlaceholder}
              className={styles.comboboxInput}
              size={12}
              data-slot='select-search'
            />
            <ComboboxPrimitive.List
              ref={setListElement}
              className={cx(
                styles.comboboxContent,
                virtualized && styles.virtualList
              )}
              data-slot='select-list'
            >
              {virtualized && <SelectVirtualRows scrollElement={listElement} />}
              {children}
            </ComboboxPrimitive.List>
          </ComboboxPrimitive.Popup>
        </ComboboxPrimitive.Positioner>
      </ComboboxPrimitive.Portal>
    );
  }

  // TODO @rohanchkrabrty: Add select.portal when it supports keepMounted
  return (
    <SelectPrimitive.Positioner
      {...positionerProps}
      className={styles.positioner}
      alignItemWithTrigger={alignItemWithTrigger}
      data-slot='select-positioner'
    >
      <SelectPrimitive.Popup
        {...theme}
        className={cx(
          styles.content,
          theme?.className,
          radiusStyle({ radius }),
          className
        )}
        data-multiselectable={multiple ? true : undefined}
        data-slot='select-content'
        {...props}
      >
        <SelectPrimitive.List
          className={styles.viewport}
          data-slot='select-list'
        >
          {children}
        </SelectPrimitive.List>
      </SelectPrimitive.Popup>
    </SelectPrimitive.Positioner>
  );
}
SelectContent.displayName = 'Select.Content';
