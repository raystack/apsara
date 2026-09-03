import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { getAllSlots, getSlot } from '~/test-utils/data-slots';
import { CalendarPreview } from '../calendar-preview';
import type { DateRangeValue } from '../calendar-preview-context';
import { dayKey } from '../date-adapter';

const lastArg = (fn: { mock: { calls: unknown[][] } }) =>
  fn.mock.calls[fn.mock.calls.length - 1]?.[0];

const at = (granularity: string, props: Record<string, unknown> = {}) =>
  render(
    <CalendarPreview
      defaultGranularity={granularity as never}
      minDate={new Date(2023, 0, 1)}
      maxDate={new Date(2025, 11, 31)}
      {...props}
    >
      <CalendarPreview.MonthGrid />
    </CalendarPreview>
  );

describe('CalendarPreview.MonthGrid', () => {
  it('renders nothing for the day granularity', () => {
    const { container } = render(
      <CalendarPreview>
        <CalendarPreview.MonthGrid />
      </CalendarPreview>
    );
    expect(getSlot(container, 'calendar-preview-month-grid')).toBeNull();
  });

  it('groups months under a year heading, three years deep', () => {
    const { container } = at('month');
    expect(
      getAllSlots(container, 'calendar-preview-month-grid-year')
    ).toHaveLength(3);
    // 12 months per year across 2023-2025.
    expect(getAllSlots(container, 'calendar-preview-month-cell')).toHaveLength(
      36
    );
    expect(screen.getAllByRole('button', { name: /^Jan \d{4}$/ })).toHaveLength(
      3
    );
  });

  it('renders four quarters per year', () => {
    const { container } = at('quarter');
    expect(getAllSlots(container, 'calendar-preview-month-cell')).toHaveLength(
      12
    );
    expect(screen.getAllByRole('button', { name: /^Q4 \d{4}$/ })).toHaveLength(
      3
    );
  });

  it('renders two halves per year', () => {
    const { container } = at('half-year');
    expect(getAllSlots(container, 'calendar-preview-month-cell')).toHaveLength(
      6
    );
    expect(screen.getAllByRole('button', { name: /^H2 \d{4}$/ })).toHaveLength(
      3
    );
  });

  it('renders years as a flat list with no year headings', () => {
    const { container } = at('year');
    expect(
      getAllSlots(container, 'calendar-preview-month-grid-year')
    ).toHaveLength(0);
    expect(getAllSlots(container, 'calendar-preview-month-cell')).toHaveLength(
      3
    );
    expect(screen.getByRole('button', { name: '2024' })).toBeInTheDocument();
  });

  it('emits the first day of the chosen period', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    at('quarter', { onValueChange });

    await user.click(screen.getAllByRole('button', { name: /^Q3 \d{4}$/ })[1]);
    expect(dayKey(lastArg(onValueChange) as Date)).toBe('2024-07-01');
  });

  it('emits January for a year pick, and June for H2', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { unmount } = at('year', { onValueChange });
    await user.click(screen.getByRole('button', { name: '2025' }));
    expect(dayKey(lastArg(onValueChange) as Date)).toBe('2025-01-01');
    unmount();

    at('half-year', { onValueChange });
    await user.click(screen.getAllByRole('button', { name: /^H2 \d{4}$/ })[0]);
    expect(dayKey(lastArg(onValueChange) as Date)).toBe('2023-07-01');
  });

  it('marks the selected period', () => {
    const { container } = at('month', { value: new Date(2024, 4, 1) });
    const selected = container.querySelectorAll(
      '[data-slot="calendar-preview-month-cell"][data-selected]'
    );
    expect(selected).toHaveLength(1);
    expect(selected[0]).toHaveTextContent('May');
  });

  it('writes a range into the active endpoint and respects lock', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    at('month', {
      selection: 'range',
      lock: 'from',
      value: { from: new Date(2023, 0, 1), to: null },
      onValueChange
    });

    await user.click(screen.getAllByRole('button', { name: /^Sep \d{4}$/ })[1]);
    const next = lastArg(onValueChange) as DateRangeValue;
    expect(dayKey(next.from as Date)).toBe('2023-01-01');
    expect(dayKey(next.to as Date)).toBe('2024-09-01');
  });

  it('disables periods outside the bounds', () => {
    render(
      <CalendarPreview
        defaultGranularity='month'
        minDate={new Date(2024, 5, 1)}
      >
        <CalendarPreview.MonthGrid />
      </CalendarPreview>
    );
    // The window starts at minDate's year, so January 2024 is offered but out
    // of range.
    expect(
      screen.getAllByRole('button', { name: /^Jan \d{4}$/ })[0]
    ).toBeDisabled();
    expect(
      screen.getAllByRole('button', { name: /^Jul \d{4}$/ })[0]
    ).not.toBeDisabled();
  });

  it('refuses writes when readOnly', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    at('month', { readOnly: true, onValueChange });
    await user.click(screen.getAllByRole('button', { name: /^Mar \d{4}$/ })[0]);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('toggles in multiple selection', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    at('month', { selection: 'multiple', onValueChange });

    await user.click(screen.getAllByRole('button', { name: /^Feb \d{4}$/ })[0]);
    expect((lastArg(onValueChange) as Date[]).map(d => dayKey(d))).toEqual([
      '2023-02-01'
    ]);
  });

  it('pairs with GranularityTabs to swap grids', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <CalendarPreview
        defaultMonth={new Date(2024, 3, 1)}
        granularities={['day', 'month']}
      >
        <CalendarPreview.GranularityTabs />
        <CalendarPreview.Grid />
        <CalendarPreview.MonthGrid />
      </CalendarPreview>
    );

    expect(getSlot(container, 'calendar-preview-grid')).not.toBeNull();
    expect(getSlot(container, 'calendar-preview-month-grid')).toBeNull();

    await user.click(screen.getByRole('tab', { name: 'Month' }));
    expect(getSlot(container, 'calendar-preview-grid')).toBeNull();
    expect(getSlot(container, 'calendar-preview-month-grid')).not.toBeNull();
  });
});

describe('MonthGrid: third audit', () => {
  it('lights the period containing the value, not only its first day', () => {
    // Picking 17 April in the day grid then switching to Month must not show
    // an empty grid — that reads as lost state.
    const { container } = at('month', { value: new Date(2024, 3, 17) });
    const selected = container.querySelectorAll(
      '[data-slot="calendar-preview-month-cell"][data-selected]'
    );
    expect(selected).toHaveLength(1);
    expect(selected[0]).toHaveTextContent('Apr');
  });

  it('lights the right period at every granularity', () => {
    const midNovember = new Date(2024, 10, 20);
    for (const [granularity, label] of [
      ['month', 'Nov'],
      ['quarter', 'Q4'],
      ['half-year', 'H2'],
      ['year', '2024']
    ] as const) {
      const { container, unmount } = at(granularity, { value: midNovember });
      const selected = container.querySelectorAll(
        '[data-slot="calendar-preview-month-cell"][data-selected]'
      );
      expect(selected, granularity).toHaveLength(1);
      expect(selected[0], granularity).toHaveTextContent(label);
      unmount();
    }
  });

  it('does not bleed a selection into the neighbouring period', () => {
    // 1 July is H2/Q3, never H1/Q2 — an off-by-one in the span maths shows here.
    const { container } = at('quarter', { value: new Date(2024, 6, 1) });
    const selected = container.querySelectorAll(
      '[data-slot="calendar-preview-month-cell"][data-selected]'
    );
    expect(selected).toHaveLength(1);
    expect(selected[0]).toHaveTextContent('Q3');
  });

  it('still emits the period start when a mid-period value is showing', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    at('month', { value: new Date(2024, 3, 17), onValueChange });
    await user.click(screen.getAllByRole('button', { name: /^Apr \d{4}$/ })[1]);
    expect(dayKey(lastArg(onValueChange) as Date)).toBe('2024-04-01');
  });
});

/*
 * Moved here from `audit-fixed.test.tsx`, which collected findings by the
 * number they were reported under. Each assertion is unchanged; only its home
 * is, so a failure lands beside the behaviour it describes.
 */
describe('regressions from the external audit', () => {
  it('switching to Month scrolls the active year into view', async () => {
    const user = userEvent.setup();
    /*
     * jsdom has no layout, so `scrollTop` is not observable on its own — the
     * previous form of this test asserted `scrollTop >= 0`, which is true of
     * an untouched element. Stand a spy in its place and give the geometry
     * non-zero values, so the assertion is about the scroll actually happening.
     */
    const stub = (name: string, descriptor: PropertyDescriptor) => {
      const original = Object.getOwnPropertyDescriptor(
        HTMLElement.prototype,
        name
      );
      Object.defineProperty(HTMLElement.prototype, name, {
        configurable: true,
        ...descriptor
      });
      return () => {
        if (original) {
          Object.defineProperty(HTMLElement.prototype, name, original);
        } else {
          Reflect.deleteProperty(HTMLElement.prototype, name);
        }
      };
    };

    const scrolled = vi.fn();
    const restore = [
      stub('scrollTop', { get: () => 0, set: scrolled }),
      stub('offsetTop', { get: () => 900 }),
      stub('clientHeight', { get: () => 300 })
    ];

    try {
      render(
        <CalendarPreview
          granularities={['day', 'month']}
          value={new Date(2030, 5, 1)}
          minDate={new Date(2020, 0, 1)}
          maxDate={new Date(2035, 11, 31)}
        >
          <CalendarPreview.GranularityTabs />
          <CalendarPreview.Grid />
          <CalendarPreview.MonthGrid />
        </CalendarPreview>
      );

      expect(scrolled).not.toHaveBeenCalled();
      await user.click(screen.getByRole('tab', { name: 'Month' }));
      // 900 - 300/2 + 300/2, centred on the active year.
      expect(scrolled).toHaveBeenCalledWith(900);
    } finally {
      for (const undo of restore) undo();
    }
  });
});

const years = () =>
  getAllSlots(document.body, 'calendar-preview-month-grid-year').map(
    node => node.textContent
  );

/** `yearWindow` belongs to `.MonthGrid`, so it is passed separately. */
const unbounded = (
  props: Record<string, unknown> = {},
  gridProps: Record<string, unknown> = {}
) =>
  render(
    <CalendarPreview defaultGranularity='month' {...props}>
      <CalendarPreview.MonthGrid {...gridProps} />
    </CalendarPreview>
  );

/*
 * `month` is a documented public prop and every other view honours it. This
 * one anchored on `new Date()` whenever nothing was selected, so it opened on
 * the host's current year wherever the consumer had driven the picker — and
 * the `setMonth` calls `.Preset` and `.Input` make after a commit were
 * invisible here.
 */
describe('.MonthGrid honours the month it is driven to', () => {
  it('centres on a controlled month with nothing selected', () => {
    unbounded({ month: new Date(2030, 11, 1) }, { yearWindow: 2 });
    expect(years()).toEqual(['2028', '2029', '2030', '2031', '2032']);
  });

  it('still prefers the selection when there is one', () => {
    unbounded(
      { month: new Date(2030, 11, 1), value: new Date(2020, 5, 1) },
      { yearWindow: 1 }
    );
    expect(years()).toEqual(['2019', '2020', '2021']);
  });
});

/*
 * `yearWindow` is documented as "how many years either side of the active one
 * … only where that edge is unbounded". It was measured from the raw anchor,
 * and the far edge could only clamp the span, never extend it — so an anchor
 * further from the bound than the window collapsed the list to a single year.
 */
describe('yearWindow spans the window it promises', () => {
  it('extends away from a distant future bound', () => {
    unbounded({ minDate: new Date(2040, 0, 1) }, { yearWindow: 5 });
    expect(years()).toEqual(['2040', '2041', '2042', '2043', '2044', '2045']);
  });

  it('extends away from a distant past bound', () => {
    unbounded({ maxDate: new Date(2000, 11, 31) }, { yearWindow: 3 });
    expect(years()).toEqual(['1997', '1998', '1999', '2000']);
  });

  // The control: unbounded, the window applies to both edges.
  it('spans both sides when nothing is bounded', () => {
    unbounded({ month: new Date(2026, 0, 1) }, { yearWindow: 5 });
    expect(years()).toHaveLength(11);
  });

  it('is inert with both edges bounded', () => {
    unbounded(
      { minDate: new Date(2023, 0, 1), maxDate: new Date(2025, 11, 31) },
      { yearWindow: 5 }
    );
    expect(years()).toEqual(['2023', '2024', '2025']);
  });

  /*
   * The section carrying the scroll ref is the one the list opens on, so it
   * has to be a year the list actually renders. Keyed on the raw anchor, it
   * never attached for a clamped anchor and the list opened at the top.
   */
  it('scrolls to a year inside the rendered span', () => {
    unbounded({ minDate: new Date(2040, 0, 1) }, { yearWindow: 5 });
    const scrolled = getAllSlots(
      document.body,
      'calendar-preview-month-grid-year'
    ).filter(node => node.parentElement?.dataset.scrollAnchor === 'true');
    expect(scrolled.map(node => node.textContent)).toEqual(['2040']);
  });
});

/*
 * `readOnly` reached only the commit guard, so every cell stayed an operable
 * unpressed toggle that silently did nothing. And the year lives in a sibling
 * element, so across an 11-year list a screen reader heard the same bare "Q1"
 * from four different buttons with nothing to tell them apart.
 */
describe('.MonthGrid announces what it actually is', () => {
  it('marks its cells under readOnly', () => {
    at('quarter', { readOnly: true });
    const cell = screen.getAllByRole('button')[0];
    expect(cell).toHaveAttribute('aria-disabled', 'true');
    // Not `disabled`: the cell stays focusable and legible, as `.Grid`'s days
    // do, so a keyboard user can still read the value.
    expect(cell).not.toBeDisabled();
  });

  it('leaves them operable when it is not read-only', () => {
    at('quarter');
    expect(screen.getAllByRole('button')[0]).not.toHaveAttribute(
      'aria-disabled'
    );
  });

  it('names each period with its year', () => {
    at('quarter');
    expect(screen.getByRole('button', { name: 'Q1 2024' })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /^Q1/ })).toHaveLength(3);
  });

  it('does not repeat the year for the year granularity', () => {
    at('year');
    expect(screen.getByRole('button', { name: '2024' })).toBeInTheDocument();
  });
});
