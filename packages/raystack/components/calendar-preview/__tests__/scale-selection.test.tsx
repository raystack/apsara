import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { getAllSlots, getSlot } from '~/test-utils/data-slots';
import { CalendarPreview } from '../calendar-preview';
import type { Scale } from '../lib/scale';

const TODAY = new Date(2026, 7, 15);
const ALL: Scale[] = ['day', 'month', 'quarter', 'halfYear', 'year'];

function renderPicker(props = {}) {
  return render(
    <CalendarPreview today={TODAY} scales={ALL} defaultMonth={TODAY} {...props}>
      <CalendarPreview.Picker />
    </CalendarPreview>
  );
}

/* The list runs across every year in `yearRange`, so a label alone is
   ambiguous — "Aug" exists once per year. */
const period = (container: HTMLElement, label: string, year = 2026) => {
  const group = getAllSlots(container, 'calendar-preview-period-group').find(
    node =>
      getSlot(node, 'calendar-preview-period-year')?.textContent ===
      String(year)
  );
  if (!group) throw new Error(`no year group ${year}`);
  const match = getAllSlots(group, 'calendar-preview-period').find(
    cell => cell.textContent === label
  );
  if (!match) throw new Error(`no period cell ${label} in ${year}`);
  return match;
};

const switchTo = (container: HTMLElement, scale: Scale) => {
  const chip = getAllSlots(container, 'calendar-preview-scale').find(
    node => node.getAttribute('data-scale') === scale
  );
  fireEvent.click(chip as HTMLElement);
};

describe('CalendarPreview scale switching', () => {
  it('emits nothing on a scale switch — it only drafts', () => {
    const onValueChange = vi.fn();
    const { container } = renderPicker({ onValueChange });
    switchTo(container, 'quarter');
    expect(onValueChange).not.toHaveBeenCalled();
    switchTo(container, 'year');
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('emits once a period is picked', () => {
    const onValueChange = vi.fn();
    const { container } = renderPicker({ onValueChange });
    switchTo(container, 'quarter');
    fireEvent.click(period(container, 'Q3'));
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange.mock.calls[0][0]).toEqual({
      date: '2026-07-01',
      scale: 'quarter'
    });
  });

  it('reports the scale it moved to', () => {
    const onScaleChange = vi.fn();
    const { container } = renderPicker({ onScaleChange });
    switchTo(container, 'month');
    expect(onScaleChange).toHaveBeenCalledWith('month');
  });
});

describe('CalendarPreview trailingValue', () => {
  /* The value itself changes, not the formatting — a start field emits the
     period's first day and an end field its last. */
  it.each([
    ['month', 'Aug', '2026-08-01', '2026-08-31'],
    ['quarter', 'Q3', '2026-07-01', '2026-09-30'],
    ['halfYear', 'H2', '2026-07-01', '2026-12-31'],
    ['year', '2026', '2026-01-01', '2026-12-31']
  ] as const)('flips the emitted edge for %s', (scale, label, lead, trail) => {
    for (const [trailing, expected] of [
      [false, lead],
      [true, trail]
    ] as const) {
      const onValueChange = vi.fn();
      const { container, unmount } = renderPicker({
        onValueChange,
        trailingValue: trailing
      });
      switchTo(container, scale);
      fireEvent.click(period(container, label));
      expect(onValueChange.mock.calls[0][0]).toEqual({ date: expected, scale });
      unmount();
    }
  });

  it('is month-end correct in a leap February', () => {
    const onValueChange = vi.fn();
    const { container } = renderPicker({
      onValueChange,
      trailingValue: true,
      today: new Date(2028, 1, 10),
      yearRange: { from: 2028, to: 2028 }
    });
    switchTo(container, 'month');
    fireEvent.click(period(container, 'Feb', 2028));
    expect(onValueChange.mock.calls[0][0]).toEqual({
      date: '2028-02-29',
      scale: 'month'
    });
  });
});

/* The RFC's table: an end field bounded at 15 July 2026 disables H1 2026,
   which would emit 30 June, while allowing July and Q3, which emit later. The
   same periods are all available to a start field. */
describe('CalendarPreview availability differs by field', () => {
  const bounded = { minDate: new Date(2026, 6, 15), today: TODAY };

  /* The same period, opposite answers: Q3 2026 starts 1 July — before the
     bound — but ends 30 September, after it. Only the produced date separates
     them, which is the whole reason availability takes `trailing`. */
  it.each([
    ['quarter', 'Q3'],
    ['month', 'Jul']
  ] as const)('disables %s for a start field and allows it for an end field', (scale, label) => {
    const start = renderPicker({ ...bounded, trailingValue: false });
    switchTo(start.container, scale);
    expect(period(start.container, label)).toBeDisabled();
    start.unmount();

    const end = renderPicker({ ...bounded, trailingValue: true });
    switchTo(end.container, scale);
    expect(period(end.container, label)).not.toBeDisabled();
  });

  it('disables H1 2026 for an end field, which would emit 30 June', () => {
    const { container } = renderPicker({ ...bounded, trailingValue: true });
    switchTo(container, 'halfYear');
    expect(period(container, 'H1')).toBeDisabled();
    expect(period(container, 'H2')).not.toBeDisabled();
  });

  it('allows July and Q3 for an end field, because they emit after the bound', () => {
    const { container } = renderPicker({ ...bounded, trailingValue: true });
    switchTo(container, 'month');
    expect(period(container, 'Jul')).not.toBeDisabled();
    switchTo(container, 'quarter');
    expect(period(container, 'Q3')).not.toBeDisabled();
  });

  it('shows out-of-bounds periods rather than hiding them', () => {
    const { container } = renderPicker({
      maxDate: new Date(2026, 7, 31),
      today: TODAY
    });
    switchTo(container, 'month');
    expect(period(container, 'Dec')).toBeInTheDocument();
    expect(period(container, 'Dec')).toBeDisabled();
  });
});

describe('CalendarPreview.Scales', () => {
  it('renders nothing when only one scale is offered', () => {
    const { container } = render(
      <CalendarPreview today={TODAY} scales='day'>
        <CalendarPreview.Picker />
      </CalendarPreview>
    );
    expect(getSlot(container, 'calendar-preview-scales')).toBeNull();
  });

  it('renders one chip per offered scale', () => {
    const { container } = renderPicker();
    expect(getAllSlots(container, 'calendar-preview-scale')).toHaveLength(5);
  });
});

describe('CalendarPreview period views mount alone', () => {
  it.each([
    ['quarter', CalendarPreview.Quarters, 'calendar-preview-quarters'],
    ['month', CalendarPreview.Months, 'calendar-preview-months'],
    ['halfYear', CalendarPreview.HalfYears, 'calendar-preview-half-years'],
    ['year', CalendarPreview.Years, 'calendar-preview-years']
  ] as const)('%s renders with no other view in the tree', (scale, View, slot) => {
    const { container } = render(
      <CalendarPreview today={TODAY} scales={ALL} defaultScale={scale}>
        <View />
      </CalendarPreview>
    );
    expect(getSlot(container, slot)).toBeInTheDocument();
    expect(getSlot(container, 'calendar-preview-grid')).toBeNull();
  });

  it('gates on the active scale, so the others stay unmounted', () => {
    const { container } = renderPicker({ defaultScale: 'quarter' });
    expect(getSlot(container, 'calendar-preview-quarters')).toBeInTheDocument();
    expect(getSlot(container, 'calendar-preview-months')).toBeNull();
    expect(getSlot(container, 'calendar-preview-grid')).toBeNull();
  });
});

/* DataView cells and FilterChip labels render the annotation with no calendar
   anywhere in the tree. */
describe('CalendarPreview.Trigger annotation', () => {
  it.each([
    ['day', '2026-07-02', '02/07/2026'],
    ['month', '2026-06-01', 'Jun 2026'],
    ['quarter', '2026-07-01', 'Q3 2026'],
    ['halfYear', '2026-01-01', 'H1 2026'],
    ['year', '2025-01-01', '2025']
  ] as const)('formats %s with no popover open', (scale, date, expected) => {
    const { container } = render(
      <CalendarPreview
        today={TODAY}
        scales={ALL}
        defaultScale={scale}
        value={{ date, scale }}
      >
        <CalendarPreview.Trigger />
      </CalendarPreview>
    );
    expect(getSlot(container, 'calendar-preview-trigger')).toHaveTextContent(
      expected
    );
    expect(getSlot(document.body, 'calendar-preview-content')).toBeNull();
  });

  it('shows the empty state when there is no value', () => {
    render(
      <CalendarPreview today={TODAY} scales={ALL}>
        <CalendarPreview.Trigger placeholder='Add start date' />
      </CalendarPreview>
    );
    expect(screen.getByText('Add start date')).toBeInTheDocument();
  });
});

describe('CalendarPreview.Input at scale', () => {
  const input = (container: HTMLElement) =>
    getSlot(container, 'calendar-preview-input') as HTMLInputElement;

  it('advertises the formats it accepts', () => {
    const { container } = renderPicker();
    expect(input(container)).toHaveAttribute(
      'placeholder',
      'Try: May 2027, Q4, 20/05/2027'
    );
  });

  it('moves the scale to match what was typed', () => {
    const onValueChange = vi.fn();
    const onScaleChange = vi.fn();
    const { container } = renderPicker({ onValueChange, onScaleChange });
    fireEvent.change(input(container), { target: { value: 'Q4 2026' } });
    fireEvent.keyDown(input(container), { key: 'Enter' });
    expect(onValueChange.mock.calls[0][0]).toEqual({
      date: '2026-10-01',
      scale: 'quarter'
    });
  });

  it('refuses a scale this root does not offer', () => {
    const { container } = render(
      <CalendarPreview today={TODAY} scales={['day', 'month']}>
        <CalendarPreview.Picker />
      </CalendarPreview>
    );
    fireEvent.change(input(container), { target: { value: 'Q4 2026' } });
    expect(getSlot(container, 'calendar-preview-input')).toHaveAttribute(
      'aria-invalid'
    );
  });

  it('drops the draft on Escape and falls back to the value', () => {
    const { container } = renderPicker({
      value: { date: '2026-08-20', scale: 'day' }
    });
    expect(input(container).value).toBe('20/08/2026');

    switchTo(container, 'quarter');
    expect(input(container).value).toBe('Q3 2026');

    fireEvent.keyDown(
      getSlot(container, 'calendar-preview-picker') as HTMLElement,
      {
        key: 'Escape'
      }
    );
    expect(input(container).value).toBe('20/08/2026');
  });
});
