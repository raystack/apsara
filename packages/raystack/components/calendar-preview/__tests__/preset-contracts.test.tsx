import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CalendarPreview } from '../calendar-preview';
import type { CalendarValidity } from '../calendar-preview-context';
import { dayKey } from '../date-adapter';

const lastCall = (fn: { mock: { calls: unknown[][] } }) =>
  fn.mock.calls[fn.mock.calls.length - 1];
const lastArg = <T,>(fn: { mock: { calls: unknown[][] } }) =>
  lastCall(fn)?.[0] as T;
/** The `{ granularity }` detail every value change carries alongside it. */
const lastDetails = (fn: { mock: { calls: unknown[][] } }) => lastCall(fn)?.[1];

/*
 * `.Preset` writes straight into root state, and its render-time guard checked
 * only `range` against `selection` — never `value`, which is typed
 * `Date | Date[] | null` under every mode. So a `Date` under `multiple`, or an
 * array under `single`, reached `setValue` with the wrong shape: `.Grid` then
 * called `selected?.some` on a Date and threw, and `.MonthGrid` would call
 * `.map` on one.
 */
describe('.Preset validates value against selection', () => {
  const quiet = () =>
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

  it('rejects a bare Date under selection="multiple"', () => {
    const spy = quiet();
    expect(() =>
      render(
        <CalendarPreview selection='multiple'>
          <CalendarPreview.Presets>
            <CalendarPreview.Preset value={new Date(2026, 5, 10)}>
              Today
            </CalendarPreview.Preset>
          </CalendarPreview.Presets>
        </CalendarPreview>
      )
    ).toThrow(/multiple/i);
    spy.mockRestore();
  });

  it('rejects an array under the default selection="single"', () => {
    const spy = quiet();
    expect(() =>
      render(
        <CalendarPreview>
          <CalendarPreview.Presets>
            <CalendarPreview.Preset
              value={[new Date(2026, 5, 10), new Date(2026, 5, 11)]}
            >
              Two
            </CalendarPreview.Preset>
          </CalendarPreview.Presets>
        </CalendarPreview>
      )
    ).toThrow(/single/i);
    spy.mockRestore();
  });

  it('still accepts the shapes each mode does want', () => {
    expect(() =>
      render(
        <CalendarPreview selection='multiple'>
          <CalendarPreview.Presets>
            <CalendarPreview.Preset value={[new Date(2026, 5, 10)]}>
              One
            </CalendarPreview.Preset>
          </CalendarPreview.Presets>
        </CalendarPreview>
      )
    ).not.toThrow();
  });
});

/*
 * Every other writer honours the bounds: `.Input`/`.RangeInput` through
 * `validate()`, `.TimeField` through `isWithinTimeBounds`, `.Grid` through RDP
 * matchers, `.MonthGrid` by disabling out-of-range cells. `.Preset` checked
 * nothing, reported nothing, and was not marked — so a preset outside the
 * declared bounds looked operable and committed a value `.Input` would refuse.
 */
describe('.Preset honours minDate and maxDate', () => {
  const bounded = (props: Record<string, unknown>, presetProps: object) =>
    render(
      <CalendarPreview
        minDate={new Date(2026, 0, 1)}
        maxDate={new Date(2026, 11, 31)}
        {...props}
      >
        <CalendarPreview.Presets>
          <CalendarPreview.Preset {...presetProps}>Then</CalendarPreview.Preset>
        </CalendarPreview.Presets>
      </CalendarPreview>
    );

  it('marks an out-of-bounds preset unavailable', () => {
    bounded({}, { value: new Date(2020, 0, 1) });
    const button = screen.getByRole('button', { name: 'Then' });
    expect(button).toHaveAttribute('aria-disabled', 'true');
  });

  it('commits nothing when an out-of-bounds preset is clicked', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    bounded({ onValueChange }, { value: new Date(2020, 0, 1) });

    await user.click(screen.getByRole('button', { name: 'Then' }));

    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('leaves an in-bounds preset operable', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    bounded({ onValueChange }, { value: new Date(2026, 5, 10) });

    const button = screen.getByRole('button', { name: 'Then' });
    expect(button).not.toHaveAttribute('aria-disabled', 'true');
    await user.click(button);

    expect(dayKey(lastArg<Date>(onValueChange))).toBe('2026-06-10');
  });

  it('checks both endpoints of a range preset', () => {
    render(
      <CalendarPreview
        selection='range'
        minDate={new Date(2026, 0, 1)}
        maxDate={new Date(2026, 11, 31)}
      >
        <CalendarPreview.Presets>
          <CalendarPreview.Preset
            range={{ from: new Date(2026, 5, 1), to: new Date(2027, 5, 1) }}
          >
            Spanning
          </CalendarPreview.Preset>
        </CalendarPreview.Presets>
      </CalendarPreview>
    );
    expect(screen.getByRole('button', { name: 'Spanning' })).toHaveAttribute(
      'aria-disabled',
      'true'
    );
  });

  it('respects isDateUnavailable', () => {
    render(
      <CalendarPreview isDateUnavailable={d => dayKey(d) === '2026-06-10'}>
        <CalendarPreview.Presets>
          <CalendarPreview.Preset value={new Date(2026, 5, 10)}>
            Blocked
          </CalendarPreview.Preset>
        </CalendarPreview.Presets>
      </CalendarPreview>
    );
    expect(screen.getByRole('button', { name: 'Blocked' })).toHaveAttribute(
      'aria-disabled',
      'true'
    );
  });
});

/*
 * Nothing reconciled the active granularity against the offered set, so
 * `granularities={['month','quarter']}` — the natural way to build a
 * month/quarter picker — left the active granularity at its `'day'` default:
 * no tab selected, the day grid rendered for an offered set that excludes it,
 * and a typed date committing `{granularity: 'day'}`.
 */
describe('the active granularity is one the picker offers', () => {
  const offered = (props: Record<string, unknown> = {}) =>
    render(
      <CalendarPreview granularities={['month', 'quarter']} {...props}>
        <CalendarPreview.GranularityTabs />
        <CalendarPreview.Grid />
        <CalendarPreview.MonthGrid />
      </CalendarPreview>
    );

  it('selects exactly one tab', () => {
    offered();
    const selected = screen
      .getAllByRole('tab')
      .filter(tab => tab.getAttribute('aria-selected') === 'true');
    expect(selected).toHaveLength(1);
    expect(selected[0]).toHaveAccessibleName('Month');
  });

  it('renders the view the active granularity names', () => {
    const { container } = offered();
    expect(
      container.querySelector('[data-slot="calendar-preview-grid"]')
    ).toBeNull();
    expect(
      container.querySelector('[data-slot="calendar-preview-month-grid"]')
    ).not.toBeNull();
  });

  const typing = async (text: string) => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const onValidityChange = vi.fn();
    render(
      <CalendarPreview
        granularities={['month', 'quarter']}
        onValueChange={onValueChange}
        onValidityChange={onValidityChange}
      >
        <CalendarPreview.Input />
      </CalendarPreview>
    );
    await user.type(screen.getByRole('textbox'), `${text}{Enter}`);
    return { onValueChange, onValidityChange };
  };

  /*
   * The active granularity is tried first and unconditionally, so while it sat
   * at `day` this committed `{granularity: 'day'}` from a picker offering
   * neither day nor anything that could redisplay the result.
   */
  it('never commits at a granularity absent from the offered set', async () => {
    const { onValueChange, onValidityChange } = await typing('15 Jun 2026');

    expect(onValueChange).not.toHaveBeenCalled();
    expect(lastArg<CalendarValidity>(onValidityChange)).toEqual({
      valid: false,
      reason: 'unparseable'
    });
  });

  it('commits text the offered set can read, at that granularity', async () => {
    const { onValueChange } = await typing('Jun 2026');

    expect(dayKey(lastArg<Date>(onValueChange))).toBe('2026-06-01');
    expect(lastDetails(onValueChange)).toMatchObject({
      granularity: 'month'
    });
  });

  const selectedTabName = () => {
    const selected = screen
      .getAllByRole('tab')
      .filter(tab => tab.getAttribute('aria-selected') === 'true');
    expect(selected).toHaveLength(1);
    return selected[0];
  };

  it('honours an explicit defaultGranularity that is offered', () => {
    offered({ defaultGranularity: 'quarter' });
    expect(selectedTabName()).toHaveAccessibleName('Quarter');
  });

  /*
   * The two cases the default cannot cover, where the props contradict each
   * other outright. The offered set is the authority — it is what the tabs
   * render from, so anything else leaves no tab selected.
   */
  it('clamps a defaultGranularity the set excludes', () => {
    offered({ defaultGranularity: 'day' });
    expect(selectedTabName()).toHaveAccessibleName('Month');
  });

  /*
   * `.MonthGrid` names no granularity, so a click falls back to whatever the
   * root holds — which is the unclamped state, and was reporting `'day'` from
   * a picker with no day view at all.
   */
  it('reports an offered granularity for a click that names none', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    offered({ defaultGranularity: 'day', onValueChange });

    await user.click(screen.getAllByRole('button', { name: /^Jun \d{4}$/ })[0]);

    expect(lastDetails(onValueChange)).toMatchObject({
      granularity: 'month'
    });
  });

  it('clamps a controlled granularity the set excludes', () => {
    offered({ granularity: 'day' });
    expect(selectedTabName()).toHaveAccessibleName('Month');
  });
});
