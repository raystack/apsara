import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

export interface UsePickerPopoverOptions {
  // Fired on outside click / blur-to-outside; listeners are torn down first.
  onOutsideClick: () => void;
}

export interface UsePickerPopoverReturn {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  inputRef: React.RefObject<HTMLInputElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
  handleInputFocus: () => void;
  handleInputBlur: (event: React.FocusEvent) => void;
  onOpenChange: (open?: boolean, reason?: string) => void;
  /*
   * Pass as Calendar's `onDropdownOpen` so the year/month dropdown isn't
   * treated as an outside click.
   */
  markDropdownOpen: () => void;
  /*
   * Arm the outside-click listener. DatePicker engages on first input blur
   * (typed-input pattern). Click-to-open consumers (e.g. RangePicker with
   * readOnly inputs) should engage on open via `useEffect`.
   */
  engage: () => void;
  // Programmatic close — does NOT fire `onOutsideClick`.
  disengage: () => void;
}

/*
 * Popover machinery shared by the date pickers.
 *
 * DatePicker drives engagement off input focus/blur (typed-input pattern).
 * RangePicker (readOnly inputs) drives engagement off `isOpen` via a useEffect
 * that calls `engage()` / `disengage()`.
 *
 * Why custom instead of Base UI's dismissal: Calendar's `captionLayout='dropdown'`
 * renders Selects inside the popover; their portals look "outside" to a naive
 * dismiss handler. The hook carves that out via `markDropdownOpen`.
 *
 * `onOpenChange` reads `isOpen` via ref so its identity stays stable —
 * Base UI's store subscriber re-binds on identity change, which caused an
 * updateStoreInstance loop on mount.
 */
export function usePickerPopover({
  onOutsideClick
}: UsePickerPopoverOptions): UsePickerPopoverReturn {
  const [isOpen, setIsOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  // True once focused-in and the outside-click listener is armed.
  const isEngagedRef = useRef(false);

  /*
   * True while the Calendar's year/month dropdown is open — its clicks
   * are not "outside".
   */
  const isDropdownOpenRef = useRef(false);

  // Mirror for `onOpenChange` stability (see header comment).
  const isOpenRef = useRef(isOpen);
  useEffect(() => {
    isOpenRef.current = isOpen;
  });

  // Mirror so the mouseup listener doesn't re-bind every render.
  const onOutsideClickRef = useRef(onOutsideClick);
  useEffect(() => {
    onOutsideClickRef.current = onOutsideClick;
  });

  const isElementOutside = useCallback((el: HTMLElement) => {
    return (
      !isDropdownOpenRef.current &&
      !inputRef.current?.contains(el) &&
      !contentRef.current?.contains(el)
    );
  }, []);

  const handleMouseDown = useCallback(
    (event: MouseEvent) => {
      const el = event.target as HTMLElement | null;
      if (el && isElementOutside(el)) onOutsideClickRef.current();
    },
    [isElementOutside]
  );

  const engage = useCallback(() => {
    isEngagedRef.current = true;
    document.addEventListener('mouseup', handleMouseDown);
  }, [handleMouseDown]);

  const disengage = useCallback(() => {
    isEngagedRef.current = false;
    setIsOpen(false);
    document.removeEventListener('mouseup', handleMouseDown);
  }, [handleMouseDown]);

  /*
   * Safety net: if the component unmounts while engaged (or `handleMouseDown`
   * identity changes mid-life), strip the document listener so stale
   * `onOutsideClickRef` invocations can't fire.
   */
  useEffect(() => {
    return () => {
      document.removeEventListener('mouseup', handleMouseDown);
    };
  }, [handleMouseDown]);

  const handleInputFocus = useCallback(() => {
    if (isEngagedRef.current) return;
    setIsOpen(true);
  }, []);

  const handleInputBlur = useCallback(
    (event: React.FocusEvent) => {
      const el = event.relatedTarget as HTMLElement | null;
      if (isEngagedRef.current) {
        // Engaged: blur is either outside (close) or into popover (no-op).
        if (el && isElementOutside(el)) onOutsideClickRef.current();
        return;
      }
      // Not yet engaged. If the user tab'd straight to an outside element,
      // close immediately — otherwise keyboard users get stuck with the
      // popover open until they mouse-click somewhere.
      if (el && isElementOutside(el)) {
        onOutsideClickRef.current();
        return;
      }
      // First blur arms outside-click and selects text for type-to-overwrite.
      engage();
      setTimeout(() => inputRef.current?.select());
    },
    [isElementOutside, engage]
  );

  const onOpenChange = useCallback((open?: boolean, reason?: string) => {
    // Year/month dropdown opening inside the popover triggers an open-change
    // we don't want; swallow it and consume the flag.
    if (isDropdownOpenRef.current) {
      isDropdownOpenRef.current = false;
      return;
    }
    /*
     * Base UI's `Popover.Trigger` wires `useClick`, which *toggles* the popover
     * on every trigger click. The input's `onFocus` already opens the picker, so
     * a single click both opens (focus) and then toggles back closed
     * (trigger-press) — the popover flickers shut on the first click and only
     * sticks open on the second. Ignore trigger-press *closes*: opening stays
     * owned by focus (and trigger-press open), while closing is owned by our
     * outside-click / blur / Enter / day-select logic — plus Base UI's own
     * Escape/outside-press, which still flow through below.
     */
    if (reason === 'trigger-press' && open === false) return;
    /*
     * Suppress only redundant *re-open* events fired by focus/click handlers
     * while the picker is already engaged + open. Explicit close requests
     * (Escape key, programmatic) must always go through, or users get stuck
     * with no way to close.
     */
    if (open === true && isEngagedRef.current && isOpenRef.current) return;
    setIsOpen(Boolean(open));
  }, []);

  const markDropdownOpen = useCallback(() => {
    isDropdownOpenRef.current = true;
  }, []);

  return {
    isOpen,
    setIsOpen,
    inputRef,
    contentRef,
    handleInputFocus,
    handleInputBlur,
    onOpenChange,
    markDropdownOpen,
    engage,
    disengage
  };
}
