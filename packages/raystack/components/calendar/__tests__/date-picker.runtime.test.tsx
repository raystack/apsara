import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DatePicker } from '../date-picker';

/*
 * Real-Calendar runtime regression tests. The main date-picker.test.tsx mocks
 * Calendar for prop assertions; this file uses the real Calendar to catch
 * mount/unmount loops in Base UI internals.
 *
 * Covers regressions:
 *   - `value = new Date()` default creating a fresh Date per render and
 *     looping the value-sync effect (fixed via useMemo in date-picker.tsx).
 *   - Unstable `onOpenChange` identity causing Base UI store re-subscribe
 *     loops on mount (fixed via ref-based `isOpen` in use-picker-popover.ts).
 *   - Base UI Select.Trigger forkRef cleanup looping on unmount when
 *     captionLayout='dropdown' mounts Selects (resolved alongside the above).
 */

describe('DatePicker runtime loops', () => {
  it('plain DatePicker open via focus does not throw', () => {
    expect(() => {
      const { unmount } = render(<DatePicker />);
      fireEvent.focus(screen.getByPlaceholderText('Select date'));
      unmount();
    }).not.toThrow();
  });

  it('DatePicker with captionLayout=dropdown open via focus does not throw on mount', () => {
    expect(() => {
      render(<DatePicker calendarProps={{ captionLayout: 'dropdown' }} />);
      fireEvent.focus(screen.getByPlaceholderText('Select date'));
    }).not.toThrow();
  });

  it('plain DatePicker click + unmount does not throw', () => {
    expect(() => {
      const { unmount } = render(<DatePicker />);
      const input = screen.getByPlaceholderText('Select date');
      fireEvent.click(input);
      unmount();
    }).not.toThrow();
  });

  /*
   * Previously triggered the Base UI Select.Trigger forkRef cleanup loop.
   * Passes in jsdom after the value-default useMemo + stable onOpenChange
   * fixes. Real-browser verification still recommended before re-enabling
   * captionLayout='dropdown' as the default.
   */
  it('DatePicker with captionLayout=dropdown click + unmount does not throw', () => {
    expect(() => {
      const { unmount } = render(
        <DatePicker calendarProps={{ captionLayout: 'dropdown' }} />
      );
      fireEvent.click(screen.getByPlaceholderText('Select date'));
      unmount();
    }).not.toThrow();
  });
});
