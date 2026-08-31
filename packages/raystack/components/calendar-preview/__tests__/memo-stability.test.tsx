import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { CalendarPreview } from '../calendar-preview';

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
