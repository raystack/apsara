'use client';

import {
  Autocomplete as AutocompletePrimitive,
  Menu as MenuPrimitive
} from '@base-ui/react';
import { cx } from 'class-variance-authority';
import { KeyboardEvent, useCallback, useRef } from 'react';
import {
  type PortalContainer,
  useThemeInjection
} from '../theme-preview/portal';
import { radiusClass } from '../theme-preview/radius';
import type { Radius } from '../theme-preview/settings';
import styles from './menu.module.css';
import { useMenuContext } from './menu-root';
import {
  dispatchKeyboardEvent,
  isElementSubMenuOpen,
  isElementSubMenuTrigger,
  KEYCODES
} from './utils';

export interface MenuContentProps
  extends Omit<
      MenuPrimitive.Positioner.Props,
      'render' | 'className' | 'style'
    >,
    MenuPrimitive.Popup.Props {
  searchPlaceholder?: string;
  /** Portals into this element instead of `document.body`. */
  container?: PortalContainer;
  /** Corner radius for this menu only. Overrides the theme's `radius`. */
  radius?: Radius;
}

export function MenuContent({
  ref,
  className,
  children,
  searchPlaceholder = 'Search...',
  render,
  finalFocus,
  style,
  sideOffset = 4,
  align = 'start',
  onFocus,
  container,
  radius,
  ...positionerProps
}: MenuContentProps) {
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
    if (!item || !isElementSubMenuTrigger(item) || !isElementSubMenuOpen(item))
      return;
    dispatchKeyboardEvent(item, KEYCODES.ESCAPE);
    item.dispatchEvent(new PointerEvent('pointerout', { bubbles: true }));
  }, []);

  const theme = useThemeInjection();

  return (
    <MenuPrimitive.Portal container={container}>
      <MenuPrimitive.Positioner
        data-slot='menu-positioner'
        className={styles.positioner}
        sideOffset={sideOffset}
        align={align}
        {...positionerProps}
      >
        <MenuPrimitive.Popup
          ref={ref}
          {...theme}
          data-slot='menu-content'
          className={cx(
            styles.content,
            autocomplete && styles.comboboxContainer,
            theme?.className,
            radiusClass(radius),
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
                  // focus moved using keyboard after using pointer
                  blurStaleMenuItem(highlightedItem.current[0]);
                }
                highlightedItem.current = [
                  eventDetails.index,
                  eventDetails.reason
                ];
              }}
            >
              <AutocompletePrimitive.Input
                data-slot='menu-search-input'
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
                data-slot='menu-search-list'
                className={styles.comboboxContent}
                ref={containerRef}
              >
                {children}
              </AutocompletePrimitive.List>
            </AutocompletePrimitive.Root>
          ) : (
            children
          )}
        </MenuPrimitive.Popup>
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  );
}
MenuContent.displayName = 'Menu.Content';

export function MenuSubContent(props: MenuContentProps) {
  return <MenuContent sideOffset={2} {...props} />;
}
MenuSubContent.displayName = 'Menu.SubmenuContent';
