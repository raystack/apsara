import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { CalendarPreview } from '../calendar-preview';

/*
 * Identity across re-renders: the DOM nodes that must survive one, and the
 * memo that must not rebuild during one. Both are questions about what stays
 * the same when React runs again, and both were places where asserting the
 * obvious thing gave a false all-clear.
 */

const MONTH = new Date(2024, 3, 1);
const day = (c: HTMLElement, iso: string) =>
  c.querySelector(`[data-day="${iso}"] button`) as HTMLButtonElement;

/*
 * The suite renders once, acts once and asserts, which is how a whole class of
 * second-render defects went unnoticed. These assert across a re-render.
 */
describe('survives a re-render', () => {
  it('keeps the same day node, so roving tabindex has something to hold', () => {
    const { container, rerender } = render(
      <CalendarPreview defaultMonth={MONTH}>
        <CalendarPreview.Grid />
      </CalendarPreview>
    );
    const before = day(container, '2024-04-17');
    rerender(
      <CalendarPreview defaultMonth={MONTH} readOnly>
        <CalendarPreview.Grid />
      </CalendarPreview>
    );
    expect(day(container, '2024-04-17')).toBe(before);
  });

  it('keeps DOM focus on the focused day across a re-render', () => {
    const { container, rerender } = render(
      <CalendarPreview defaultMonth={MONTH}>
        <CalendarPreview.Grid />
      </CalendarPreview>
    );
    const target = day(container, '2024-04-17');
    target.focus();
    expect(target).toHaveFocus();

    rerender(
      <CalendarPreview defaultMonth={MONTH} readOnly>
        <CalendarPreview.Grid />
      </CalendarPreview>
    );
    expect(day(container, '2024-04-17')).toHaveFocus();
  });

  it('keeps focus on the focused day when selecting re-renders the grid', async () => {
    // The realistic case: clicking a day re-renders with a new value, and the
    // roving tabindex needs the node it just focused to still be there.
    const user = userEvent.setup();
    const { container } = render(
      <CalendarPreview defaultMonth={MONTH}>
        <CalendarPreview.Grid />
      </CalendarPreview>
    );
    const target = day(container, '2024-04-17');
    await user.click(target);
    expect(day(container, '2024-04-17')).toBe(target);
    expect(target).toHaveFocus();
  });

  /*
   * Stepping the month genuinely replaces those cells — April's days are not
   * May's — so node identity is not expected to survive a there-and-back
   * navigation, and no amount of hoisting would make it.
   */
});

/*
 * Measured by counting `isDateUnavailable` calls, which run once per cell
 * inside the memo. Asserting on the DOM gives a false all-clear: React reuses
 * a node whenever type and key match, recomputed props or not.
 *
 * Bounds are written inline as `minDate={new Date(...)}` throughout, since
 * that is the shape that used to bust the memo on every parent render.
 */

/** 2015–2035 at month granularity: 21 years × 12 = 252 cells. */
const CELLS = 252;

function Harness({
  isDateUnavailable
}: {
  isDateUnavailable: (date: Date) => boolean;
}) {
  const [, setTick] = useState(0);

  return (
    <>
      <button type='button' onClick={() => setTick(n => n + 1)}>
        rerender parent
      </button>
      <CalendarPreview
        defaultGranularity='month'
        minDate={new Date(2015, 0, 1)}
        maxDate={new Date(2035, 11, 31)}
        isDateUnavailable={isDateUnavailable}
      >
        <CalendarPreview.MonthGrid />
      </CalendarPreview>
    </>
  );
}

describe('.MonthGrid memo stability', () => {
  it('rebuilds nothing on an unrelated parent re-render', async () => {
    const user = userEvent.setup();
    const isDateUnavailable = vi.fn(() => false);
    render(<Harness isDateUnavailable={isDateUnavailable} />);
    expect(isDateUnavailable).toHaveBeenCalledTimes(CELLS);
    isDateUnavailable.mockClear();

    await user.click(screen.getByRole('button', { name: 'rerender parent' }));

    expect(isDateUnavailable).toHaveBeenCalledTimes(0);
  });

  it('rebuilds nothing when only the selected period changes', async () => {
    const user = userEvent.setup();
    const isDateUnavailable = vi.fn(() => false);
    render(<Harness isDateUnavailable={isDateUnavailable} />);
    isDateUnavailable.mockClear();

    // `value` moves, but the dates do not — only which one is selected.
    await user.click(screen.getAllByRole('button', { name: 'Mar' })[0]);

    expect(isDateUnavailable).toHaveBeenCalledTimes(0);
    expect(screen.getAllByRole('button', { name: 'Mar' })[0]).toHaveAttribute(
      'aria-pressed',
      'true'
    );
  });
});
