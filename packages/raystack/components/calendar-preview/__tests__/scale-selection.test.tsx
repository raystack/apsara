import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { getAllSlots, getSlot } from '~/test-utils/data-slots';
import { CalendarPreview } from '../calendar-preview';
import type { Scale } from '../lib/scale';

const TODAY = new Date(2026, 7, 15);
const ALL: Scale[] = ['day', 'month', 'quarter', 'halfYear', 'year'];

function renderBody(props = {}) {
  return render(
    <CalendarPreview today={TODAY} scales={ALL} defaultMonth={TODAY} {...props}>
      <CalendarPreview.Body />
    </CalendarPreview>
  );
}

const period = (container: HTMLElement, label: string, year = 2026) => {
  const group = getAllSlots(container, 'calendar-preview-period-group').find(
    node => node.getAttribute('data-year') === String(year)
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
    const { container } = renderBody({ onValueChange });
    switchTo(container, 'quarter');
    expect(onValueChange).not.toHaveBeenCalled();
    switchTo(container, 'year');
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('emits once a period is picked', () => {
    const onValueChange = vi.fn();
    const { container } = renderBody({ onValueChange });
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
    const { container } = renderBody({ onScaleChange });
    switchTo(container, 'month');
    expect(onScaleChange).toHaveBeenCalledWith('month');
  });
});

describe('CalendarPreview trailingValue', () => {
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
      const { container, unmount } = renderBody({
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
    const { container } = renderBody({
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

describe('CalendarPreview availability differs by field', () => {
  const bounded = { minDate: new Date(2026, 6, 15), today: TODAY };

  it.each([
    ['quarter', 'Q3'],
    ['month', 'Jul']
  ] as const)('disables %s for a start field and allows it for an end field', (scale, label) => {
    const start = renderBody({ ...bounded, trailingValue: false });
    switchTo(start.container, scale);
    expect(period(start.container, label)).toBeDisabled();
    start.unmount();

    const end = renderBody({ ...bounded, trailingValue: true });
    switchTo(end.container, scale);
    expect(period(end.container, label)).not.toBeDisabled();
  });

  it('disables H1 2026 for an end field, which would emit 30 June', () => {
    const { container } = renderBody({ ...bounded, trailingValue: true });
    switchTo(container, 'halfYear');
    expect(period(container, 'H1')).toBeDisabled();
    expect(period(container, 'H2')).not.toBeDisabled();
  });

  it('allows July and Q3 for an end field, because they emit after the bound', () => {
    const { container } = renderBody({ ...bounded, trailingValue: true });
    switchTo(container, 'month');
    expect(period(container, 'Jul')).not.toBeDisabled();
    switchTo(container, 'quarter');
    expect(period(container, 'Q3')).not.toBeDisabled();
  });

  it('shows out-of-bounds periods rather than hiding them', () => {
    const { container } = renderBody({
      maxDate: new Date(2026, 7, 31),
      today: TODAY
    });
    switchTo(container, 'month');
    expect(period(container, 'Dec')).toBeInTheDocument();
    expect(period(container, 'Dec')).toBeDisabled();
  });
});

describe('CalendarPreview periods ignore the time zone', () => {
  it.each([
    ['Pacific/Niue'],
    ['Pacific/Kiritimati'],
    ['UTC']
  ])('commits the period that was clicked in %s', timeZone => {
    const onValueChange = vi.fn();
    const { container } = renderBody({
      timeZone,
      defaultScale: 'month',
      onValueChange
    });
    fireEvent.click(period(container, 'Aug'));
    expect(onValueChange.mock.calls[0][0]).toEqual({
      date: '2026-08-01',
      scale: 'month'
    });
  });

  it('marks the clicked quarter, not its neighbour, west of UTC', () => {
    const { container } = renderBody({
      timeZone: 'Pacific/Niue',
      defaultScale: 'quarter',
      value: { date: '2026-07-01', scale: 'quarter' }
    });
    expect(period(container, 'Q3')).toHaveAttribute('data-selected');
    expect(period(container, 'Q2')).not.toHaveAttribute('data-selected');
  });
});

describe('CalendarPreview opens at the committed scale', () => {
  it('mounts the period view, not the day grid, for a committed period', () => {
    const { container } = renderBody({
      value: { date: '2026-07-01', scale: 'quarter' }
    });
    expect(getSlot(container, 'calendar-preview-days')).toBeNull();
    expect(getSlot(container, 'calendar-preview-quarters')).not.toBeNull();
    expect(period(container, 'Q3')).toHaveAttribute('data-selected');
  });

  it('prefers an explicit defaultScale over the value', () => {
    const { container } = renderBody({
      value: { date: '2026-07-01', scale: 'quarter' },
      defaultScale: 'day'
    });
    expect(getSlot(container, 'calendar-preview-days')).not.toBeNull();
  });
});

describe('CalendarPreview.Reset is reachable at every scale', () => {
  const QUARTER = { date: '2026-07-01', scale: 'quarter' } as const;

  it('restores from a period view', () => {
    const onValueChange = vi.fn();
    const { container } = renderBody({
      defaultDate: QUARTER,
      value: { date: '2026-10-01', scale: 'quarter' },
      onValueChange
    });
    const reset = getSlot(container, 'calendar-preview-reset') as HTMLElement;
    expect(reset).not.toBeNull();
    fireEvent.click(reset);
    expect(onValueChange).toHaveBeenCalledWith(
      QUARTER,
      expect.objectContaining({ reason: 'reset' })
    );
  });

  it.each([
    ['day'],
    ['quarter']
  ] as const)('mounts exactly one reset at %s scale', scale => {
    const { container } = renderBody({
      defaultScale: scale,
      defaultValue: { date: '2026-08-20', scale: 'day' },
      defaultDate: { date: '2026-08-10', scale: 'day' }
    });
    expect(getAllSlots(container, 'calendar-preview-reset')).toHaveLength(1);
  });
});

describe('CalendarPreview reads a period at its own scale', () => {
  it('agrees between .Trigger and .Input on a committed period', () => {
    const { container } = render(
      <CalendarPreview
        today={TODAY}
        scales={ALL}
        value={{ date: '2026-07-01', scale: 'quarter' }}
      >
        <CalendarPreview.Trigger />
        <CalendarPreview.Body />
      </CalendarPreview>
    );
    expect(getSlot(container, 'calendar-preview-trigger')?.textContent).toBe(
      'Q3 2026'
    );
    expect(
      (getSlot(container, 'calendar-preview-input') as HTMLInputElement).value
    ).toBe('Q3 2026');
  });
});

describe('CalendarPreview settles the scale out loud', () => {
  const inputValue = (container: HTMLElement) =>
    (getSlot(container, 'calendar-preview-input') as HTMLInputElement).value;
  const pressEscape = (container: HTMLElement) =>
    fireEvent.keyDown(
      getSlot(container, 'calendar-preview-body') as HTMLElement,
      {
        key: 'Escape'
      }
    );

  it('reports the scale a dropped draft settles back on', () => {
    const onScaleChange = vi.fn();
    const { container } = renderBody({
      value: { date: '2026-08-20', scale: 'day' },
      onScaleChange
    });
    switchTo(container, 'quarter');
    expect(onScaleChange).toHaveBeenLastCalledWith('quarter');
    pressEscape(container);
    expect(onScaleChange).toHaveBeenLastCalledWith('day');
  });

  /* The raw setter left a controlled switcher stuck on the draft. */
  it('moves a controlled scale back when the draft is dropped', () => {
    function Controlled() {
      const [scale, setScale] = useState<Scale>('day');
      return (
        <CalendarPreview
          today={TODAY}
          scales={ALL}
          value={{ date: '2026-08-20', scale: 'day' }}
          scale={scale}
          onScaleChange={setScale}
        >
          <CalendarPreview.Body />
        </CalendarPreview>
      );
    }
    const { container } = render(<Controlled />);
    switchTo(container, 'quarter');
    expect(inputValue(container)).toBe('Q3 2026');
    pressEscape(container);
    expect(inputValue(container)).toBe('20 Aug 2026');
  });
});

describe('CalendarPreview settles the scale once when Escape both drops and closes', () => {
  function renderPicker(props = {}) {
    return render(
      <CalendarPreview
        today={TODAY}
        scales={ALL}
        defaultMonth={TODAY}
        {...props}
      >
        <CalendarPreview.Trigger>
          <CalendarPreview.Input />
        </CalendarPreview.Trigger>
        <CalendarPreview.Content>
          <CalendarPreview.Body />
        </CalendarPreview.Content>
      </CalendarPreview>
    );
  }

  it('reports the settled scale once', () => {
    const onScaleChange = vi.fn();
    const { container } = renderPicker({
      value: { date: '2026-08-20', scale: 'day' },
      onScaleChange
    });
    fireEvent.focus(
      getSlot(container, 'calendar-preview-input') as HTMLElement
    );
    switchTo(document.body, 'quarter');
    onScaleChange.mockClear();

    fireEvent.keyDown(
      getSlot(document.body, 'calendar-preview-body') as HTMLElement,
      { key: 'Escape' }
    );
    expect(onScaleChange).toHaveBeenCalledTimes(1);
    expect(onScaleChange).toHaveBeenCalledWith('day');
  });
});

describe('CalendarPreview settles the view on what a typed date commits', () => {
  const input = (container: HTMLElement) =>
    getSlot(container, 'calendar-preview-input') as HTMLInputElement;

  const marked = (container: HTMLElement) =>
    getAllSlots(container, 'calendar-preview-period')
      .filter(cell => cell.hasAttribute('data-selected'))
      .map(cell => cell.textContent);

  it('moves to day scale when a day is typed on a period view', () => {
    const onScaleChange = vi.fn();
    const { container } = renderBody({
      defaultScale: 'quarter',
      onScaleChange
    });

    fireEvent.change(input(container), { target: { value: '2 May 2026' } });
    fireEvent.keyDown(input(container), { key: 'Enter' });

    expect(onScaleChange).toHaveBeenLastCalledWith('day');
    expect(getSlot(container, 'calendar-preview')).toHaveAttribute(
      'data-scale',
      'day'
    );
  });

  it('moves to the typed period and marks its cell', () => {
    const { container } = renderBody({ defaultScale: 'day' });

    fireEvent.change(input(container), { target: { value: 'Q2 2026' } });
    fireEvent.keyDown(input(container), { key: 'Enter' });

    expect(getSlot(container, 'calendar-preview')).toHaveAttribute(
      'data-scale',
      'quarter'
    );
    expect(marked(container)).toEqual(['Q2']);
  });
});

describe('CalendarPreview.Scales', () => {
  it('renders nothing when only one scale is offered', () => {
    const { container } = render(
      <CalendarPreview today={TODAY} scales='day'>
        <CalendarPreview.Body />
      </CalendarPreview>
    );
    expect(getSlot(container, 'calendar-preview-scales')).toBeNull();
  });

  it('renders one chip per offered scale', () => {
    const { container } = renderBody();
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
    const { container } = renderBody({ defaultScale: 'quarter' });
    expect(getSlot(container, 'calendar-preview-quarters')).toBeInTheDocument();
    expect(getSlot(container, 'calendar-preview-months')).toBeNull();
    expect(getSlot(container, 'calendar-preview-grid')).toBeNull();
  });
});

describe('CalendarPreview.Trigger annotation', () => {
  it.each([
    ['day', '2026-07-02', '02 Jul 2026'],
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
    const { container } = renderBody();
    expect(input(container)).toHaveAttribute(
      'placeholder',
      'Try: 15 Aug 2026, Aug 2026, Q3 2026'
    );
  });

  /* A hardcoded list suggested a day format to a field that rejects one. */
  it('suggests only the scales the root offers', () => {
    const { container } = renderBody({ scales: ['month', 'quarter', 'year'] });
    expect(input(container)).toHaveAttribute(
      'placeholder',
      'Try: Aug 2026, Q3 2026, 2026'
    );
  });

  it('suggests the single scale a one-scale root takes', () => {
    const { container } = renderBody({ scales: 'quarter' });
    expect(input(container)).toHaveAttribute('placeholder', 'Try: Q3 2026');
  });

  it('every suggestion is a format the field accepts', () => {
    const { container } = renderBody({ scales: ['month', 'quarter', 'year'] });
    const suggestions = (
      input(container).getAttribute('placeholder') ?? ''
    ).replace('Try: ', '');

    for (const text of suggestions.split(', ')) {
      fireEvent.change(input(container), { target: { value: text } });
      expect(input(container)).not.toHaveAttribute('aria-invalid');
    }
  });

  it('suggests parseable formats under a custom formatValue', () => {
    const { container } = renderBody({
      scales: ['month', 'quarter', 'year'],
      formatValue: () => 'custom'
    });
    expect(input(container)).toHaveAttribute(
      'placeholder',
      'Try: Aug 2026, Q3 2026, 2026'
    );
  });

  it('moves the scale to match what was typed', () => {
    const onValueChange = vi.fn();
    const onScaleChange = vi.fn();
    const { container } = renderBody({ onValueChange, onScaleChange });
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
        <CalendarPreview.Body />
      </CalendarPreview>
    );
    fireEvent.change(input(container), { target: { value: 'Q4 2026' } });
    expect(getSlot(container, 'calendar-preview-input')).toHaveAttribute(
      'aria-invalid'
    );
  });

  it('drops the draft on Escape and falls back to the value', () => {
    const { container } = renderBody({
      value: { date: '2026-08-20', scale: 'day' }
    });
    expect(input(container).value).toBe('20 Aug 2026');

    switchTo(container, 'quarter');
    expect(input(container).value).toBe('Q3 2026');

    fireEvent.keyDown(
      getSlot(container, 'calendar-preview-body') as HTMLElement,
      {
        key: 'Escape'
      }
    );
    expect(input(container).value).toBe('20 Aug 2026');
  });
});

describe('CalendarPreview change details at scale', () => {
  const input = (container: HTMLElement) =>
    getSlot(container, 'calendar-preview-input') as HTMLInputElement;

  it('hands back the produced date through toDate()', () => {
    const onValueChange = vi.fn();
    const { container } = renderBody({ onValueChange, trailingValue: true });
    switchTo(container, 'quarter');
    fireEvent.click(period(container, 'Q3'));
    const details = onValueChange.mock.calls[0][1];
    expect(typeof details.toDate).toBe('function');
    expect(details.toDate()).toEqual(new Date(2026, 8, 30));
  });

  it('reports the period of the scale that was committed, not the view', () => {
    const onValueChange = vi.fn();
    const { container } = renderBody({ onValueChange });
    switchTo(container, 'month');
    fireEvent.click(period(container, 'Aug'));
    expect(onValueChange.mock.calls[0][1].period).toEqual({
      start: '2026-08-01',
      end: '2026-08-31'
    });
  });

  it('reports the typed scale period, not the scale still on screen', () => {
    const onValueChange = vi.fn();
    const { container } = renderBody({ onValueChange });
    fireEvent.change(input(container), { target: { value: 'Q4 2026' } });
    fireEvent.keyDown(input(container), { key: 'Enter' });
    expect(onValueChange.mock.calls[0][1].period).toEqual({
      start: '2026-10-01',
      end: '2026-12-31'
    });
  });
});

describe('CalendarPreview scale anchors on the visible month', () => {
  it('drafts from the view month rather than today', () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <CalendarPreview
        today={TODAY}
        scales={ALL}
        defaultMonth={new Date(2030, 0, 1)}
        onValueChange={onValueChange}
      >
        <CalendarPreview.Body />
      </CalendarPreview>
    );
    switchTo(container, 'quarter');
    fireEvent.click(period(container, 'Q1', 2030));
    expect(onValueChange.mock.calls[0][0]).toEqual({
      date: '2030-01-01',
      scale: 'quarter'
    });
  });

  it('opens the period list on the view month year', () => {
    const { container } = render(
      <CalendarPreview
        today={TODAY}
        scales={ALL}
        defaultMonth={new Date(2030, 0, 1)}
      >
        <CalendarPreview.Body />
      </CalendarPreview>
    );
    switchTo(container, 'month');
    expect(period(container, 'Jan', 2030)).toBeInTheDocument();
    expect(period(container, 'Jan', 2026)).toBeInTheDocument();
  });

  it('still follows the value when there is one', () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <CalendarPreview
        today={TODAY}
        scales={ALL}
        defaultMonth={new Date(2030, 0, 1)}
        value={{ date: '2027-05-20', scale: 'day' }}
        onValueChange={onValueChange}
      >
        <CalendarPreview.Body />
      </CalendarPreview>
    );
    switchTo(container, 'quarter');
    fireEvent.click(period(container, 'Q2', 2027));
    expect(onValueChange.mock.calls[0][0]).toEqual({
      date: '2027-04-01',
      scale: 'quarter'
    });
  });
});

describe('CalendarPreview commits a day at one shape', () => {
  const typeDay = (container: HTMLElement) => {
    const input = getSlot(
      container,
      'calendar-preview-input'
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { value: '15 Aug 2026' } });
    fireEvent.keyDown(input, { key: 'Enter' });
  };

  it('types a day as a ScaleValue on a scale-aware root', () => {
    const onValueChange = vi.fn();
    const { container } = renderBody({ onValueChange });
    typeDay(container);
    expect(onValueChange.mock.calls[0][0]).toEqual({
      date: '2026-08-15',
      scale: 'day'
    });
  });

  it("types a day as a ScaleValue under scales={['day']}", () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <CalendarPreview
        today={TODAY}
        scales={['day']}
        defaultMonth={TODAY}
        onValueChange={onValueChange}
      >
        <CalendarPreview.Body />
      </CalendarPreview>
    );
    typeDay(container);
    expect(onValueChange.mock.calls[0][0]).toEqual({
      date: '2026-08-15',
      scale: 'day'
    });
  });

  it('keeps a plain root on Date', () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <CalendarPreview
        today={TODAY}
        defaultMonth={TODAY}
        onValueChange={onValueChange}
      >
        <CalendarPreview.Input />
        <CalendarPreview.Days />
      </CalendarPreview>
    );
    typeDay(container);
    expect(onValueChange.mock.calls[0][0]).toEqual(new Date(2026, 7, 15));
  });
});

describe('CalendarPreview at day scale on a scale-aware root', () => {
  const dayCell = (container: HTMLElement, day: string) => {
    const match = getAllSlots(container, 'calendar-preview-day').find(
      cell =>
        getSlot(cell, 'calendar-preview-day-number')?.textContent === day &&
        !cell.hasAttribute('data-outside')
    );
    if (!match) throw new Error(`no cell for day ${day}`);
    return match;
  };

  it('marks the day the value carries', () => {
    const { container } = renderBody({
      value: { date: '2026-08-20', scale: 'day' }
    });
    expect(dayCell(container, '20')).toHaveAttribute('data-selected');
  });

  it('commits a clicked day as a period at day scale', () => {
    const onValueChange = vi.fn();
    const { container } = renderBody({ onValueChange });
    fireEvent.click(dayCell(container, '20'));
    expect(onValueChange.mock.calls[0][0]).toEqual({
      date: '2026-08-20',
      scale: 'day'
    });
  });

  it('keeps a bare Date for a day-only root', () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <CalendarPreview
        today={TODAY}
        defaultMonth={TODAY}
        onValueChange={onValueChange}
      >
        <CalendarPreview.Days />
      </CalendarPreview>
    );
    fireEvent.click(dayCell(container, '20'));
    expect(onValueChange.mock.calls[0][0]).toEqual(new Date(2026, 7, 20));
  });

  it('labels a childless .Trigger with the period, at its own scale', () => {
    const { container } = render(
      <CalendarPreview
        today={TODAY}
        scales={ALL}
        value={{ date: '2026-07-01', scale: 'quarter' }}
      >
        <CalendarPreview.Trigger />
      </CalendarPreview>
    );
    expect(getSlot(container, 'calendar-preview-trigger')?.textContent).toBe(
      'Q3 2026'
    );
  });
});

describe('CalendarPreview.Reset at scale', () => {
  const QUARTER = { date: '2026-07-01', scale: 'quarter' } as const;
  const reset = (container: HTMLElement) =>
    getSlot(container, 'calendar-preview-reset') as HTMLElement;

  it('renders while the value differs from the period default', () => {
    const { container } = renderBody({
      defaultDate: QUARTER,
      value: { date: '2026-10-01', scale: 'quarter' }
    });
    expect(reset(container)).toBeInTheDocument();
    expect(reset(container)).not.toBeDisabled();
  });

  it('is not restored when only the day matches', () => {
    const { container } = renderBody({
      defaultDate: QUARTER,
      value: { date: '2026-07-01', scale: 'month' }
    });
    expect(reset(container)).not.toBeDisabled();
  });

  it('stays mounted but inert once the day and the scale both match', () => {
    const { container } = renderBody({
      defaultDate: QUARTER,
      value: QUARTER
    });
    expect(reset(container)).toHaveAttribute('aria-disabled', 'true');
    expect(reset(container)).toHaveAttribute('data-restored');
  });

  it('restores the day and the scale together', () => {
    const onValueChange = vi.fn();
    const { container } = renderBody({
      defaultDate: QUARTER,
      defaultValue: { date: '2026-08-20', scale: 'day' },
      onValueChange
    });

    fireEvent.click(reset(container));
    expect(onValueChange).toHaveBeenCalledWith(
      QUARTER,
      expect.objectContaining({ reason: 'reset' })
    );
    expect(getSlot(container, 'calendar-preview-days')).toBeNull();
    expect(
      (getSlot(container, 'calendar-preview-input') as HTMLInputElement).value
    ).toBe('Q3 2026');
  });
});

describe('CalendarPreview period cells name their year', () => {
  it('puts the year in a quarter cell name', () => {
    const { container } = renderBody({ defaultScale: 'quarter' });
    expect(period(container, 'Q3', 2026)).toHaveAttribute(
      'aria-label',
      'Q3 2026'
    );
    expect(period(container, 'Q3', 2027)).toHaveAttribute(
      'aria-label',
      'Q3 2027'
    );
  });

  it('puts the year in a month cell name', () => {
    const { container } = renderBody({ defaultScale: 'month' });
    expect(period(container, 'Jan', 2030)).toHaveAttribute(
      'aria-label',
      'Jan 2030'
    );
  });

  it('leaves a year cell named by itself', () => {
    const { container } = renderBody({ defaultScale: 'year' });
    expect(period(container, '2026', 2026)).toHaveAttribute(
      'aria-label',
      '2026'
    );
  });
});

describe('CalendarPreview drops a draft to the scale it started from', () => {
  const pressEscape = (container: HTMLElement) =>
    fireEvent.keyDown(
      getSlot(container, 'calendar-preview-body') as HTMLElement,
      { key: 'Escape' }
    );

  it('restores defaultScale rather than the first offered scale', () => {
    const onScaleChange = vi.fn();
    const { container } = render(
      <CalendarPreview
        today={TODAY}
        scales={['month', 'year']}
        defaultScale='year'
        onScaleChange={onScaleChange}
      >
        <CalendarPreview.Body />
      </CalendarPreview>
    );
    switchTo(container, 'month');
    expect(onScaleChange).toHaveBeenLastCalledWith('month');
    pressEscape(container);
    expect(onScaleChange).toHaveBeenLastCalledWith('year');
  });

  it('comes back to the start of the run, not a scale passed through it', () => {
    const onScaleChange = vi.fn();
    const { container } = renderBody({ defaultScale: 'year', onScaleChange });
    switchTo(container, 'month');
    switchTo(container, 'quarter');
    pressEscape(container);
    expect(onScaleChange).toHaveBeenLastCalledWith('year');
  });

  it('forgets the run once a period is committed', () => {
    const onScaleChange = vi.fn();
    const { container } = renderBody({ defaultScale: 'day', onScaleChange });
    switchTo(container, 'quarter');
    fireEvent.click(period(container, 'Q3'));
    onScaleChange.mockClear();
    pressEscape(container);
    expect(onScaleChange).not.toHaveBeenCalledWith('day');
  });
});

describe('CalendarPreview.Input reads the root clock', () => {
  const input = (container: HTMLElement) =>
    getSlot(container, 'calendar-preview-input') as HTMLInputElement;

  it('resolves a bare period in the root year, not the wall clock', () => {
    const onValueChange = vi.fn();
    const FAR = new Date(2030, 0, 1);
    const { container } = render(
      <CalendarPreview
        today={FAR}
        defaultMonth={FAR}
        scales={ALL}
        onValueChange={onValueChange}
      >
        <CalendarPreview.Body />
      </CalendarPreview>
    );
    fireEvent.change(input(container), { target: { value: 'Q4' } });
    fireEvent.keyDown(input(container), { key: 'Enter' });
    expect(onValueChange.mock.calls[0][0]).toEqual({
      date: '2030-10-01',
      scale: 'quarter'
    });
  });

  it('commits a typed period at the trailing edge of an end root', () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <CalendarPreview
        today={TODAY}
        defaultMonth={TODAY}
        scales={ALL}
        trailingValue
        onValueChange={onValueChange}
      >
        <CalendarPreview.Body />
      </CalendarPreview>
    );
    fireEvent.change(input(container), { target: { value: 'Q4 2026' } });
    fireEvent.keyDown(input(container), { key: 'Enter' });
    expect(onValueChange.mock.calls[0][0]).toEqual({
      date: '2026-12-31',
      scale: 'quarter'
    });
  });

  it('respects a bound that only the trailing edge clears', () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <CalendarPreview
        today={TODAY}
        defaultMonth={TODAY}
        scales={ALL}
        trailingValue
        minDate={new Date(2026, 6, 15)}
        onValueChange={onValueChange}
      >
        <CalendarPreview.Body />
      </CalendarPreview>
    );
    fireEvent.change(input(container), { target: { value: 'Q3 2026' } });
    fireEvent.keyDown(input(container), { key: 'Enter' });
    expect(onValueChange.mock.calls[0][0]).toEqual({
      date: '2026-09-30',
      scale: 'quarter'
    });
  });
});

describe('CalendarPreview formatValue sees the root time zone', () => {
  it('passes it as the third argument', () => {
    const formatValue = vi.fn(() => 'formatted');
    renderBody({
      formatValue,
      timeZone: 'Pacific/Niue',
      value: { date: '2026-08-20', scale: 'day' }
    });
    expect(formatValue).toHaveBeenCalledWith(
      expect.anything(),
      'day',
      'Pacific/Niue'
    );
  });
});

describe('CalendarPreview drops a scale draft when the popover closes', () => {
  function renderScalePicker(props = {}) {
    const utils = render(
      <CalendarPreview
        today={TODAY}
        defaultMonth={TODAY}
        scales={ALL}
        {...props}
      >
        <CalendarPreview.Trigger>
          <CalendarPreview.Input />
        </CalendarPreview.Trigger>
        <CalendarPreview.Content>
          <CalendarPreview.Scales />
          <CalendarPreview.Panel />
        </CalendarPreview.Content>
      </CalendarPreview>
    );
    const input = getSlot(
      utils.container,
      'calendar-preview-input'
    ) as HTMLInputElement;
    return { ...utils, input };
  }

  it('restores the field and the scale when Escape closes a bare panel', () => {
    const { container, input } = renderScalePicker({
      value: { date: '2026-08-20', scale: 'day' }
    });
    fireEvent.focus(input);
    switchTo(document.body, 'quarter');
    expect(input.value).toBe('Q3 2026');

    fireEvent.keyDown(
      getSlot(document.body, 'calendar-preview-content') as HTMLElement,
      { key: 'Escape' }
    );
    expect(input.value).toBe('20 Aug 2026');
    expect(getSlot(container, 'calendar-preview')).toHaveAttribute(
      'data-scale',
      'day'
    );
  });

  it('keeps a committed period, and a later Escape does not undo it', () => {
    const { container, input } = renderScalePicker();
    fireEvent.focus(input);
    switchTo(document.body, 'quarter');
    fireEvent.click(period(document.body, 'Q3'));
    expect(input.value).toBe('Q3 2026');

    fireEvent.keyDown(
      getSlot(document.body, 'calendar-preview-content') as HTMLElement,
      { key: 'Escape' }
    );
    expect(input.value).toBe('Q3 2026');
    expect(getSlot(container, 'calendar-preview')).toHaveAttribute(
      'data-scale',
      'quarter'
    );
  });
});

describe('CalendarPreview.Scales honours the order it was given', () => {
  const labels = (container: HTMLElement) =>
    getAllSlots(container, 'calendar-preview-scale').map(node =>
      node.getAttribute('data-scale')
    );

  it('shows them in the order listed, not a canonical one', () => {
    const { container } = renderBody({ scales: ['year', 'day', 'quarter'] });
    expect(labels(container)).toEqual(['year', 'day', 'quarter']);
  });

  it('takes the first listed as the default scale', () => {
    const { container } = renderBody({ scales: ['quarter', 'day'] });
    expect(getSlot(container, 'calendar-preview')).toHaveAttribute(
      'data-scale',
      'quarter'
    );
  });

  it('drops a repeat rather than rendering it twice', () => {
    const { container } = renderBody({ scales: ['day', 'month', 'day'] });
    expect(labels(container)).toEqual(['day', 'month']);
  });
});

describe('CalendarPreview.Scale announces which scale is active', () => {
  it('marks the active one pressed and the others not', () => {
    const { container } = render(
      <CalendarPreview today={TODAY} scales={ALL} defaultScale='quarter'>
        <CalendarPreview.Scale value='day' />
        <CalendarPreview.Scale value='quarter' />
      </CalendarPreview>
    );
    const [day, quarter] = getAllSlots(container, 'calendar-preview-scale');
    expect(day).toHaveAttribute('aria-pressed', 'false');
    expect(quarter).toHaveAttribute('aria-pressed', 'true');
  });
});

describe('CalendarPreview scale switches round-trip', () => {
  const caption = (container: HTMLElement) =>
    getSlot(container, 'calendar-preview-caption')?.textContent;
  const field = (container: HTMLElement) =>
    (getSlot(container, 'calendar-preview-input') as HTMLInputElement).value;

  it('restores the committed day after a trip through a coarser scale', () => {
    const { container } = renderBody({
      defaultValue: { date: '2026-08-15', scale: 'day' }
    });
    expect(field(container)).toBe('15 Aug 2026');
    expect(caption(container)).toBe('Aug 2026');

    switchTo(container, 'year');
    expect(field(container)).toBe('2026');

    switchTo(container, 'day');
    expect(field(container)).toBe('15 Aug 2026');
    expect(caption(container)).toBe('Aug 2026');
  });

  it('leaves an empty field empty, and the view where it was', () => {
    const { container } = renderBody();
    switchTo(container, 'year');
    switchTo(container, 'day');
    expect(field(container)).toBe('');
    expect(caption(container)).toBe('Aug 2026');
  });

  it('reads each scale off the value, not off the scale before it', () => {
    const { container } = renderBody({
      defaultValue: { date: '2026-08-15', scale: 'day' }
    });
    switchTo(container, 'year');
    switchTo(container, 'month');
    expect(field(container)).toBe('Aug 2026');
  });

  it('emits nothing across the whole round trip', () => {
    const onValueChange = vi.fn();
    const { container } = renderBody({
      defaultValue: { date: '2026-08-15', scale: 'day' },
      onValueChange
    });
    switchTo(container, 'year');
    switchTo(container, 'quarter');
    switchTo(container, 'day');
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('puts the month back when the draft is dropped', () => {
    const { container } = renderBody({
      defaultValue: { date: '2026-08-15', scale: 'day' }
    });
    switchTo(container, 'year');
    expect(caption(container)).toBeUndefined();

    fireEvent.keyDown(
      getSlot(container, 'calendar-preview-body') as HTMLElement,
      {
        key: 'Escape'
      }
    );
    expect(field(container)).toBe('15 Aug 2026');
    expect(caption(container)).toBe('Aug 2026');
  });
});

describe('CalendarPreview period cells match the value scale', () => {
  const marked = (container: HTMLElement) =>
    getAllSlots(container, 'calendar-preview-period')
      .filter(cell => cell.hasAttribute('data-selected'))
      .map(cell => cell.getAttribute('aria-label'));

  it('does not light a quarter for a half-year value', () => {
    const { container } = renderBody({
      defaultScale: 'quarter',
      value: { date: '2028-01-01', scale: 'halfYear' }
    });
    expect(marked(container)).toEqual([]);
  });

  it('does not light a quarter for a month or a year value', () => {
    const month = renderBody({
      defaultScale: 'quarter',
      value: { date: '2029-01-01', scale: 'month' }
    });
    expect(marked(month.container)).toEqual([]);
    month.unmount();

    const year = renderBody({
      defaultScale: 'quarter',
      value: { date: '2029-01-01', scale: 'year' }
    });
    expect(marked(year.container)).toEqual([]);
  });

  it('still lights the cell whose own scale the value carries', () => {
    const { container } = renderBody({
      defaultScale: 'quarter',
      value: { date: '2029-01-01', scale: 'quarter' }
    });
    expect(marked(container)).toEqual(['Q1 2029']);
  });

  it('still lights the draft a switch produces', () => {
    const { container } = renderBody({
      defaultValue: { date: '2026-08-15', scale: 'day' }
    });
    switchTo(container, 'quarter');
    expect(marked(container)).toEqual(['Q3 2026']);
  });
});

describe('CalendarPreview period lists drop unreachable years', () => {
  const groupYears = (container: HTMLElement) =>
    getAllSlots(container, 'calendar-preview-period-group').map(group =>
      group.getAttribute('data-year')
    );

  it('leaves out the years with nothing selectable in them', () => {
    const { container } = renderBody({
      minDate: new Date(2026, 6, 15),
      today: TODAY
    });
    switchTo(container, 'month');

    const years = groupYears(container);
    expect(years).not.toContain('2025');
    expect(years).not.toContain('2016');
    expect(years[0]).toBe('2026');
    expect(years).toContain('2036');
  });

  it('keeps every cell of a year the bound runs through', () => {
    const { container } = renderBody({
      minDate: new Date(2026, 6, 15),
      today: TODAY
    });
    switchTo(container, 'month');

    expect(period(container, 'Jan')).toBeInTheDocument();
    expect(period(container, 'Jan')).toBeDisabled();
    expect(period(container, 'Aug')).not.toBeDisabled();
  });

  it('drops nothing when there are no bounds', () => {
    const { container } = renderBody({ today: TODAY });
    switchTo(container, 'quarter');
    expect(groupYears(container)).toHaveLength(21);
  });

  it('keeps the dead years when every year is dead', () => {
    const { container } = renderBody({
      minDate: new Date(2026, 5, 1),
      maxDate: new Date(2026, 7, 1),
      today: TODAY
    });
    switchTo(container, 'year');

    const years = groupYears(container);
    expect(years.length).toBeGreaterThan(0);
    expect(
      getAllSlots(container, 'calendar-preview-period').every(cell =>
        cell.hasAttribute('data-unavailable')
      )
    ).toBe(true);
  });
});
