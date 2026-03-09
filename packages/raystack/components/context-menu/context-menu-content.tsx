'use client';

import {
  Autocomplete as AutocompletePrimitive,
  ContextMenu as ContextMenuPrimitive
} from '@base-ui/react';
import { cx } from 'class-variance-authority';
import { forwardRef, KeyboardEvent, useCallback, useRef } from 'react';
import styles from '../menu/menu.module.css';
import { useMenuContext } from '../menu/menu-root';
import {
  dispatchKeyboardEvent,
  isElementSubMenuOpen,
  isElementSubMenuTrigger,
  KEYCODES
} from '../menu/utils';

export interface ContextMenuContentProps
  extends Omit<
      ContextMenuPrimitive.Positioner.Props,
      'render' | 'className' | 'style'
    >,
    ContextMenuPrimitive.Popup.Props {
  searchPlaceholder?: string;
}

export const ContextMenuContent = forwardRef<
  HTMLDivElement,
  ContextMenuContentProps
>(
  (
    {
      className,
      children,
      searchPlaceholder = 'Search...',
      render,
      finalFocus,
      style,
      sideOffset = 4,
      align = 'start',
      onFocus,
      ...positionerProps
    },
    ref
  ) => {
    const {
      autocomplete,
      inputValue,
      onInputValueChange,
      inputRef,
      isInitialRender,
      parent
    } = useMenuContext();

    const focusInput = useCallback(() => {
      if (document?.activeElement !== inputRef?.current)
        inputRef?.current?.focus();
    }, [inputRef]);
    const highlightedItem = useRef<
      [index: number, reason: 'keyboard' | 'pointer' | 'none']
    >([-1, 'none']);
    const containerRef = useRef<HTMLDivElement>(null);

    const highlightFirstItem = useCallback(() => {
      if (!isInitialRender?.current) return;
      isInitialRender.current = false;
      const item = containerRef.current?.querySelector('[role="option"]');
      if (!item) return;
      item.dispatchEvent(new PointerEvent('mousemove', { bubbles: true }));
    }, [isInitialRender]);

    const checkAndOpenSubMenu = useCallback(() => {
      if (highlightedItem.current[0] === -1) return;
      const items = containerRef.current?.querySelectorAll('[role="option"]');
      const item = items?.[highlightedItem.current[0]];
      if (!item || !isElementSubMenuTrigger(item)) return;
      dispatchKeyboardEvent(item, KEYCODES.ARROW_RIGHT);
    }, []);

    const checkAndCloseSubMenu = useCallback(
      (e: KeyboardEvent<HTMLInputElement>) => {
        if (highlightedItem.current[0] === -1) return;
        const items = containerRef.current?.querySelectorAll('[role="option"]');
        const item = items?.[highlightedItem.current[0]];
        if (
          !item ||
          !isElementSubMenuTrigger(item) ||
          !isElementSubMenuOpen(item)
        )
          return;
        dispatchKeyboardEvent(item, KEYCODES.ESCAPE);
        e.stopPropagation();
      },
      []
    );

    const blurStaleMenuItem = useCallback((index: number) => {
      const items = containerRef.current?.querySelectorAll('[role="option"]');
      const item = items?.[index];
      if (
        !item ||
        !isElementSubMenuTrigger(item) ||
        !isElementSubMenuOpen(item)
      )
        return;
      dispatchKeyboardEvent(item, KEYCODES.ESCAPE);
      item.dispatchEvent(new PointerEvent('pointerout', { bubbles: true }));
    }, []);

    return (
      <ContextMenuPrimitive.Portal>
        <ContextMenuPrimitive.Positioner
          className={cx(styles.positioner)}
          sideOffset={sideOffset}
          align={align}
          {...positionerProps}
        >
          <ContextMenuPrimitive.Popup
            ref={ref}
            className={cx(
              styles.content,
              autocomplete && styles.comboboxContainer,
              className
            )}
            style={style}
            render={render}
            finalFocus={finalFocus}
            role={autocomplete ? 'dialog' : 'menu'}
            onFocus={
              autocomplete || parent?.autocomplete
                ? e => {
                    focusInput();
                    e.stopPropagation();
                    highlightFirstItem();
                    onFocus?.(e);
                  }
                : undefined
            }
          >
            {autocomplete ? (
              <AutocompletePrimitive.Root
                inline
                open
                value={inputValue}
                onValueChange={(value: string) => onInputValueChange?.(value)}
                autoHighlight={!!inputValue?.length}
                mode='none'
                loopFocus={false}
                onItemHighlighted={(value, eventDetails) => {
                  if (
                    highlightedItem.current[1] === 'pointer' &&
                    eventDetails.reason === 'keyboard'
                  ) {
                    blurStaleMenuItem(highlightedItem.current[0]);
                  }
                  highlightedItem.current = [
                    eventDetails.index,
                    eventDetails.reason
                  ];
                }}
              >
                <AutocompletePrimitive.Input
                  placeholder={searchPlaceholder}
                  className={styles.comboboxInput}
                  ref={inputRef}
                  onPointerEnter={e => {
                    focusInput();
                  }}
                  onKeyDown={e => {
                    if (e.key === 'ArrowLeft') return;
                    if (e.key === 'Escape') return checkAndCloseSubMenu(e);
                    if (e.key === 'ArrowRight' || e.key === 'Enter')
                      checkAndOpenSubMenu();
                    e.stopPropagation();
                  }}
                  tabIndex={-1}
                />
                <AutocompletePrimitive.List
                  className={styles.comboboxContent}
                  ref={containerRef}
                >
                  {children}
                </AutocompletePrimitive.List>
              </AutocompletePrimitive.Root>
            ) : (
              children
            )}
          </ContextMenuPrimitive.Popup>
        </ContextMenuPrimitive.Positioner>
      </ContextMenuPrimitive.Portal>
    );
  }
);
ContextMenuContent.displayName = 'ContextMenu.Content';

export const ContextMenuSubContent = forwardRef<
  HTMLDivElement,
  ContextMenuContentProps
>(({ ...props }, ref) => (
  <ContextMenuContent ref={ref} sideOffset={2} {...props} />
));
ContextMenuSubContent.displayName = 'ContextMenu.SubContent';
