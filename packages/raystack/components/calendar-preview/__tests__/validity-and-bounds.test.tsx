import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { getAllSlots } from '~/test-utils/data-slots';
import { CalendarPreview } from '../calendar-preview';
import type { CalendarValidity } from '../calendar-preview-context';

const lastArg = <T,>(fn: { mock: { calls: unknown[][] } }) =>
  fn.mock.calls[fn.mock.calls.length - 1]?.[0] as T;

const MONTH = new Date(2024, 3, 1);

/*
 * `reportValidity` was only ever called by the three typed fields, so an
 * invalid verdict latched: nothing the grid, a preset, the revert button or a
 * controlled parent did ever cleared it. A `Field` wired to
 * `onValidityChange` showed "Invalid date" permanently beside a good value.
 */
describe('validity does not latch', () => {
  it('a grid pick clears a standing complaint from the typed field', async () => {
    const user = userEvent.setup();
    const onValidityChange = vi.fn();
    render(
      <CalendarPreview defaultMonth={MONTH} onValidityChange={onValidityChange}>
        <CalendarPreview.Input />
        <CalendarPreview.Grid />
      </CalendarPreview>
    );

    await user.type(screen.getByRole('textbox'), 'rubbish{Enter}');
    expect(lastArg<CalendarValidity>(onValidityChange)).toEqual({
      valid: false,
      reason: 'unparseable'
    });

    await user.click(screen.getByRole('button', { name: /April 5th/ }));

    expect(lastArg<CalendarValidity>(onValidityChange)).toEqual({
      valid: true
    });
  });
});

/*
 * Both `.TimeField` rejections returned in silence — no validity, no value
 * change, the text simply reverting — while the file claimed to validate the
 * same shape the typed fields do.
 */
describe('.TimeField reports what it rejects', () => {
  it('reports unparseable text', async () => {
    const user = userEvent.setup();
    const onValidityChange = vi.fn();
    render(
      <CalendarPreview
        value={new Date(2024, 3, 17, 9, 0)}
        onValidityChange={onValidityChange}
      >
        <CalendarPreview.TimeField />
      </CalendarPreview>
    );

    const hour = screen.getByLabelText('Hour');
    await user.clear(hour);
    await user.type(hour, 'abc');
    await user.tab();

    expect(lastArg<CalendarValidity>(onValidityChange)).toEqual({
      valid: false,
      reason: 'unparseable'
    });
  });

  it('reports an out-of-range hour', async () => {
    const user = userEvent.setup();
    const onValidityChange = vi.fn();
    render(
      <CalendarPreview
        value={new Date(2024, 3, 17, 9, 0)}
        onValidityChange={onValidityChange}
      >
        <CalendarPreview.TimeField />
      </CalendarPreview>
    );

    const hour = screen.getByLabelText('Hour');
    await user.clear(hour);
    await user.type(hour, '99');
    await user.tab();

    expect(lastArg<CalendarValidity>(onValidityChange)).toEqual({
      valid: false,
      reason: 'out-of-bounds'
    });
  });

  /*
   * `step` is public and was unvalidated: `Math.round(x / 0) * 0` is NaN, which
   * reached `.minute(NaN)` and committed an Invalid Date that rendered as the
   * literal string `NaN`.
   */
  it('never commits an Invalid Date, whatever step it is given', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <CalendarPreview
        value={new Date(2024, 3, 17, 9, 0)}
        onValueChange={onValueChange}
      >
        <CalendarPreview.TimeField step={0} />
      </CalendarPreview>
    );

    const minute = screen.getByLabelText('Minute');
    await user.clear(minute);
    await user.type(minute, '30{Enter}');

    const next = lastArg<Date>(onValueChange);
    expect(Number.isNaN(next.getTime())).toBe(false);
    expect(next.getMinutes()).toBe(30);
  });
});

/*
 * `yearWindow` was measured from the anchor with nothing tying it to a bounded
 * edge, so a bound past the window left `firstYear > lastYear` and the build
 * loop never ran.
 */
describe('.MonthGrid always offers a selectable period', () => {
  const grid = (props: Record<string, unknown>) =>
    render(
      <CalendarPreview
        defaultGranularity='month'
        granularities={['month']}
        {...props}
      >
        <CalendarPreview.MonthGrid />
      </CalendarPreview>
    );

  it('renders cells when minDate sits beyond the year window', () => {
    const { container } = grid({ minDate: new Date(2035, 0, 1) });
    expect(
      getAllSlots(container, 'calendar-preview-month-cell').length
    ).toBeGreaterThan(0);
  });

  it('renders cells when maxDate sits before the year window', () => {
    const { container } = grid({ maxDate: new Date(2015, 11, 31) });
    expect(
      getAllSlots(container, 'calendar-preview-month-cell').length
    ).toBeGreaterThan(0);
  });

  it('spans from the bound to the window on the unbounded edge', () => {
    // minDate 2030 with today in 2026: the list must reach 2030, not stop short.
    const { container } = grid({ minDate: new Date(2030, 0, 1) });
    const years = getAllSlots(
      container,
      'calendar-preview-month-grid-year'
    ).map(node => node.textContent);
    expect(years.some(text => text?.includes('2030'))).toBe(true);
  });
});

/*
 * One commit, one verdict.
 *
 * `setValue` announced `{valid: true}` unconditionally, and every typed writer
 * already reported its own verdict immediately before calling it — so a single
 * valid Enter emitted the consumer's callback twice with identical payloads.
 * Anything driving a `Field` off the callback ran its render work twice per
 * keystroke that committed.
 *
 * That line was also *why* a writer could assert validity it had never
 * computed: `.Grid` did no checking of its own and still announced good on the
 * consumer's behalf. Every writer validates now, so the announcement belongs
 * to whoever did the checking.
 */
describe('validity is announced once per commit', () => {
  const counted = (children: ReactNode, props = {}) => {
    const onValidityChange = vi.fn();
    render(
      <CalendarPreview
        defaultMonth={MONTH}
        onValidityChange={onValidityChange}
        {...props}
      >
        {children}
      </CalendarPreview>
    );
    return onValidityChange;
  };

  it('for a typed commit', async () => {
    const user = userEvent.setup();
    const onValidityChange = counted(<CalendarPreview.Input />);

    await user.type(screen.getByRole('textbox'), '17 Apr 2024{Enter}');

    expect(onValidityChange.mock.calls).toEqual([[{ valid: true }]]);
  });

  it('for a grid pick', async () => {
    const user = userEvent.setup();
    const onValidityChange = counted(<CalendarPreview.Grid />);

    await user.click(screen.getByRole('button', { name: /April 5th/ }));

    expect(onValidityChange.mock.calls).toEqual([[{ valid: true }]]);
  });

  it('for a range pick, whichever endpoint it lands on', async () => {
    const user = userEvent.setup();
    const onValidityChange = counted(<CalendarPreview.Grid />, {
      selection: 'range'
    });

    await user.click(screen.getByRole('button', { name: /April 5th/ }));
    await user.click(screen.getByRole('button', { name: /April 9th/ }));

    expect(onValidityChange.mock.calls).toEqual([
      [{ valid: true }],
      [{ valid: true }]
    ]);
  });

  it('for a period pick', async () => {
    const user = userEvent.setup();
    const onValidityChange = counted(<CalendarPreview.MonthGrid />, {
      defaultGranularity: 'month',
      granularities: ['month']
    });

    await user.click(screen.getAllByRole('button', { name: /^Apr \d{4}$/ })[0]);

    expect(onValidityChange.mock.calls).toEqual([[{ valid: true }]]);
  });

  it('for a time-of-day edit', async () => {
    const user = userEvent.setup();
    const onValidityChange = counted(<CalendarPreview.TimeField />, {
      defaultValue: new Date(2024, 3, 17, 9, 0)
    });

    await user.clear(screen.getByLabelText('Hour'));
    await user.type(screen.getByLabelText('Hour'), '10{Enter}');

    expect(onValidityChange.mock.calls).toEqual([[{ valid: true }]]);
  });

  /*
   * A preset commits without any typing, and `.Preset` is the writer whose
   * bounds check was added last — so it has to speak for itself rather than
   * inherit a verdict from the root.
   */
  it('for a preset, which reports for itself', async () => {
    const user = userEvent.setup();
    const onValidityChange = counted(
      <CalendarPreview.Presets>
        <CalendarPreview.Preset value={new Date(2024, 3, 17)}>
          The 17th
        </CalendarPreview.Preset>
      </CalendarPreview.Presets>
    );

    await user.click(screen.getByRole('button', { name: 'The 17th' }));

    expect(onValidityChange.mock.calls).toEqual([[{ valid: true }]]);
  });

  it('and for the revert button', async () => {
    const user = userEvent.setup();
    const onValidityChange = counted(
      <>
        <CalendarPreview.Nav />
        <CalendarPreview.Grid />
      </>,
      { defaultValue: new Date(2024, 3, 10) }
    );

    await user.click(screen.getByRole('button', { name: /April 17th/ }));
    await user.click(
      getAllSlots(document.body, 'calendar-preview-nav-undo')[0]
    );

    expect(onValidityChange.mock.calls).toEqual([
      [{ valid: true }],
      [{ valid: true }]
    ]);
  });
});
