import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RangePicker } from '../range-picker';

/*
 * Real-Calendar runtime regression tests for RangePicker. Mirrors
 * date-picker.runtime.test.tsx — uses the real Calendar to catch
 * mount/unmount loops in Base UI internals after RangePicker adopted
 * usePickerPopover.
 */

describe('RangePicker runtime loops', () => {
  it('plain RangePicker click + unmount does not throw', () => {
    expect(() => {
      const { unmount } = render(<RangePicker />);
      fireEvent.click(screen.getByPlaceholderText('Select start date'));
      unmount();
    }).not.toThrow();
  });

  it('RangePicker with captionLayout=dropdown click + unmount does not throw', () => {
    expect(() => {
      const { unmount } = render(
        <RangePicker calendarProps={{ captionLayout: 'dropdown' }} />
      );
      fireEvent.click(screen.getByPlaceholderText('Select start date'));
      unmount();
    }).not.toThrow();
  });
});
