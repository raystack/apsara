import { fireEvent, render, screen, within } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { getAllSlots, getSlot } from '~/test-utils/data-slots';
import { CalendarPreview } from '../calendar-preview';
import { defaultFormatValue } from '../calendar-preview-root';
import { CalendarPreview as CalendarPreviewFromBarrel } from '../index';
import { useCalendar } from '../use-calendar';

const TODAY = new Date(2026, 7, 15);
const AUGUST = new Date(2026, 7, 1);

function renderCalendar(ui?: React.ReactNode, props = {}) {
  return render(
    <CalendarPreview today={TODAY} defaultMonth={AUGUST} {...props}>
      {ui ?? <CalendarPreview.Days />}
    </CalendarPreview>
  );
}

/**
 * The day button for a day of the displayed month, ignoring the outside days.
 *
 * Matched on the day-number slot rather than the cell's text, so a cell
 * carrying `dateInfo` above the number still resolves.
 */
function dayCell(container: HTMLElement, day: string): HTMLElement {
  const match = getAllSlots(container, 'calendar-preview-day').find(
    cell =>
      getSlot(cell, 'calendar-preview-day-number')?.textContent === day &&
      !cell.hasAttribute('data-outside')
  );
  if (!match) throw new Error(`No cell for day ${day}`);
  return match;
}

function openCaption(container: HTMLElement): void {
  const caption = getSlot(container, 'calendar-preview-caption') as HTMLElement;
  fireEvent.pointerDown(caption);
  fireEvent.click(caption);
}

describe('CalendarPreview root', () => {
  it('renders an inline calendar from the root and the day view alone', () => {
    const { container } = render(
      <CalendarPreview>
        <CalendarPreview.Days />
      </CalendarPreview>
    );
    expect(getSlot(container, 'calendar-preview-days')).toBeInTheDocument();
    expect(getSlot(container, 'calendar-preview-grid')).toBeInTheDocument();
  });

  it('throws a message naming the part when used outside a root', () => {
    /* React logs the thrown error before it propagates; silence it so the
       expected throw does not look like a failure in the run output. */
    const error = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    expect(() => render(<CalendarPreview.Days />)).toThrow(
      'CalendarPreview.Days must be used within <CalendarPreview>'
    );
    error.mockRestore();
  });

  it('commits a clicked day and reports the period and the day acted on', () => {
    const onValueChange = vi.fn();
    const { container } = renderCalendar(undefined, { onValueChange });

    fireEvent.click(dayCell(container, '20'));

    expect(onValueChange).toHaveBeenCalledTimes(1);
    const [value, details] = onValueChange.mock.calls[0];
    expect(value).toEqual(new Date(2026, 7, 20));
    expect(details.reason).toBe('select');
    expect(details.period).toEqual({ start: '2026-08-20', end: '2026-08-20' });
    expect(details.toDate()).toEqual(new Date(2026, 7, 20));
  });

  it('clears on a second click when clearable, and reports the day acted on', () => {
    const onValueChange = vi.fn();
    const { container } = renderCalendar(undefined, {
      defaultValue: new Date(2026, 7, 20),
      onValueChange
    });

    fireEvent.click(dayCell(container, '20'));

    const [value, details] = onValueChange.mock.calls[0];
    expect(value).toBeNull();
    expect(details.reason).toBe('clear');
    expect(details.toDate()).toEqual(new Date(2026, 7, 20));
  });

  it('keeps the selection when clearable is false', () => {
    const onValueChange = vi.fn();
    const { container } = renderCalendar(undefined, {
      defaultValue: new Date(2026, 7, 20),
      clearable: false,
      onValueChange
    });

    fireEvent.click(dayCell(container, '20'));

    expect(onValueChange.mock.calls[0][0]).toEqual(new Date(2026, 7, 20));
    expect(dayCell(container, '20')).toHaveAttribute('data-selected');
  });

  it('renders with no value when clearing is switched off', () => {
    const { container } = renderCalendar(undefined, { clearable: false });
    expect(
      getAllSlots(container, 'calendar-preview-day').filter(cell =>
        cell.hasAttribute('data-selected')
      )
    ).toHaveLength(0);
  });

  it('commits nothing while readOnly', () => {
    const onValueChange = vi.fn();
    const { container } = renderCalendar(undefined, {
      readOnly: true,
      onValueChange
    });
    fireEvent.click(dayCell(container, '20'));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('disables every day when the root is disabled', () => {
    const { container } = renderCalendar(undefined, { disabled: true });
    for (const cell of getAllSlots(container, 'calendar-preview-day')) {
      expect(cell).toHaveAttribute('data-unavailable');
    }
  });
});

describe('CalendarPreview selection bounds', () => {
  it('disables days outside minDate and maxDate but leaves the rest alone', () => {
    const { container } = renderCalendar(undefined, {
      minDate: new Date(2026, 7, 10),
      maxDate: new Date(2026, 7, 20)
    });
    expect(dayCell(container, '9')).toHaveAttribute('data-unavailable');
    expect(dayCell(container, '10')).not.toHaveAttribute('data-unavailable');
    expect(dayCell(container, '20')).not.toHaveAttribute('data-unavailable');
    expect(dayCell(container, '21')).toHaveAttribute('data-unavailable');
  });

  it('treats a bound carrying a time of day as covering that whole day', () => {
    const { container } = renderCalendar(undefined, {
      minDate: new Date(2026, 7, 10, 23, 59)
    });
    expect(dayCell(container, '10')).not.toHaveAttribute('data-unavailable');
  });

  it('rejects individual days through isDateUnavailable', () => {
    const { container } = renderCalendar(undefined, {
      isDateUnavailable: (date: Date) => date.getDate() === 12
    });
    expect(dayCell(container, '12')).toHaveAttribute('data-unavailable');
    expect(dayCell(container, '13')).not.toHaveAttribute('data-unavailable');
  });

  it('does not commit a day that is out of bounds', () => {
    const onValueChange = vi.fn();
    const { container } = renderCalendar(undefined, {
      minDate: new Date(2026, 7, 10),
      onValueChange
    });
    fireEvent.click(dayCell(container, '9'));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  /* The behavioural change the RFC calls out: `startMonth`/`endMonth` used to
     clamp how far the user could navigate. Bounds now limit selection only. */
  it('never stops navigation at minDate', () => {
    const { container } = renderCalendar(undefined, {
      minDate: new Date(2026, 7, 1),
      maxDate: new Date(2026, 7, 31)
    });
    const prev = getSlot(container, 'calendar-preview-prev-month');
    expect(prev).not.toBeDisabled();

    fireEvent.click(prev as HTMLElement);
    expect(getSlot(container, 'calendar-preview-caption')).toHaveTextContent(
      'July 2026'
    );
    fireEvent.click(prev as HTMLElement);
    expect(getSlot(container, 'calendar-preview-caption')).toHaveTextContent(
      'June 2026'
    );
  });

  it('never stops navigation at maxDate', () => {
    const { container } = renderCalendar(undefined, {
      minDate: new Date(2026, 7, 1),
      maxDate: new Date(2026, 7, 31)
    });
    const next = getSlot(container, 'calendar-preview-next-month');
    expect(next).not.toBeDisabled();

    fireEvent.click(next as HTMLElement);
    fireEvent.click(next as HTMLElement);
    expect(getSlot(container, 'calendar-preview-caption')).toHaveTextContent(
      'October 2026'
    );
  });

  it('still disables the days it navigated to when they are out of bounds', () => {
    const { container } = renderCalendar(undefined, {
      minDate: new Date(2026, 7, 1)
    });
    fireEvent.click(
      getSlot(container, 'calendar-preview-prev-month') as HTMLElement
    );
    for (const cell of getAllSlots(container, 'calendar-preview-day')) {
      if (!cell.hasAttribute('data-outside')) {
        expect(cell).toHaveAttribute('data-unavailable');
      }
    }
  });
});

describe('CalendarPreview month navigation', () => {
  it('steps the view a month at a time', () => {
    const { container } = renderCalendar();
    fireEvent.click(
      getSlot(container, 'calendar-preview-next-month') as HTMLElement
    );
    expect(getSlot(container, 'calendar-preview-caption')).toHaveTextContent(
      'September 2026'
    );
  });

  it('reports every move through onMonthChange', () => {
    const onMonthChange = vi.fn();
    const { container } = renderCalendar(undefined, { onMonthChange });
    fireEvent.click(
      getSlot(container, 'calendar-preview-prev-month') as HTMLElement
    );
    expect(onMonthChange).toHaveBeenCalledWith(new Date(2026, 6, 1));
  });

  it('does not move a controlled month on its own', () => {
    const onMonthChange = vi.fn();
    const { container } = renderCalendar(undefined, {
      month: AUGUST,
      onMonthChange
    });
    fireEvent.click(
      getSlot(container, 'calendar-preview-next-month') as HTMLElement
    );
    expect(onMonthChange).toHaveBeenCalledWith(new Date(2026, 8, 1));
    expect(getSlot(container, 'calendar-preview-caption')).toHaveTextContent(
      'August 2026'
    );
  });

  it('steps from the first month back and forth without drifting', () => {
    const { container } = renderCalendar(undefined, {
      defaultMonth: new Date(2026, 0, 31)
    });
    const next = getSlot(
      container,
      'calendar-preview-next-month'
    ) as HTMLElement;
    fireEvent.click(next);
    fireEvent.click(next);
    expect(getSlot(container, 'calendar-preview-caption')).toHaveTextContent(
      'March 2026'
    );
  });

  it('shows several months side by side and captions the span', () => {
    const { container } = renderCalendar(
      <CalendarPreview.Days numberOfMonths={2} />
    );
    expect(getAllSlots(container, 'calendar-preview-table')).toHaveLength(2);
    expect(getSlot(container, 'calendar-preview-caption')).toHaveTextContent(
      'August 2026 – September 2026'
    );
  });
});

describe('CalendarPreview.Reset', () => {
  it('does not render without a defaultDate', () => {
    const { container } = renderCalendar(undefined, {
      defaultValue: new Date(2026, 7, 20)
    });
    expect(getSlot(container, 'calendar-preview-reset')).toBeNull();
  });

  it('does not render when the value already equals the defaultDate', () => {
    const { container } = renderCalendar(undefined, {
      defaultDate: new Date(2026, 7, 20),
      defaultValue: new Date(2026, 7, 20)
    });
    expect(getSlot(container, 'calendar-preview-reset')).toBeNull();
  });

  it('renders once the value differs from the defaultDate', () => {
    const { container } = renderCalendar(undefined, {
      defaultDate: new Date(2026, 7, 20),
      defaultValue: new Date(2026, 7, 10)
    });
    expect(getSlot(container, 'calendar-preview-reset')).toBeInTheDocument();
  });

  it('renders when there is a defaultDate and no value at all', () => {
    const { container } = renderCalendar(undefined, {
      defaultDate: new Date(2026, 7, 20)
    });
    expect(getSlot(container, 'calendar-preview-reset')).toBeInTheDocument();
  });

  it('restores the defaultDate on click', () => {
    const onValueChange = vi.fn();
    const { container } = renderCalendar(undefined, {
      defaultDate: new Date(2026, 7, 20),
      defaultValue: new Date(2026, 7, 10),
      onValueChange
    });

    fireEvent.click(
      getSlot(container, 'calendar-preview-reset') as HTMLElement
    );

    expect(onValueChange.mock.calls[0][0]).toEqual(new Date(2026, 7, 20));
    expect(dayCell(container, '20')).toHaveAttribute('data-selected');
    /* Gone again, because there is no longer anything to restore. */
    expect(getSlot(container, 'calendar-preview-reset')).toBeNull();
  });

  /* `defaultValue` is ignored by `useControlled` once `value` is passed, which
     is exactly why the reset target is its own prop. */
  it('renders and resets under a controlled value', () => {
    const onValueChange = vi.fn();
    const { container } = renderCalendar(undefined, {
      defaultDate: new Date(2026, 7, 20),
      value: new Date(2026, 7, 10),
      onValueChange
    });
    expect(getSlot(container, 'calendar-preview-reset')).toBeInTheDocument();

    fireEvent.click(
      getSlot(container, 'calendar-preview-reset') as HTMLElement
    );
    expect(onValueChange.mock.calls[0][0]).toEqual(new Date(2026, 7, 20));
  });

  it('is a value reset, not a view reset', () => {
    const onMonthChange = vi.fn();
    const { container } = renderCalendar(undefined, {
      defaultDate: new Date(2026, 7, 20),
      defaultValue: new Date(2026, 7, 10),
      onMonthChange
    });
    fireEvent.click(
      getSlot(container, 'calendar-preview-next-month') as HTMLElement
    );
    onMonthChange.mockClear();

    fireEvent.click(
      getSlot(container, 'calendar-preview-reset') as HTMLElement
    );

    expect(onMonthChange).not.toHaveBeenCalled();
    expect(getSlot(container, 'calendar-preview-caption')).toHaveTextContent(
      'September 2026'
    );
  });

  it('is inert while readOnly', () => {
    const { container } = renderCalendar(undefined, {
      defaultDate: new Date(2026, 7, 20),
      readOnly: true
    });
    expect(getSlot(container, 'calendar-preview-reset')).toBeDisabled();
  });
});

describe('CalendarPreview.Caption', () => {
  it('labels the displayed month', () => {
    const { container } = renderCalendar();
    expect(getSlot(container, 'calendar-preview-caption')).toHaveTextContent(
      'August 2026'
    );
  });

  it('lets children replace the computed label, as Tour.Title does', () => {
    const { container } = renderCalendar(
      <CalendarPreview.Days>
        <CalendarPreview.Header>
          <CalendarPreview.Caption>Q3 2026</CalendarPreview.Caption>
        </CalendarPreview.Header>
      </CalendarPreview.Days>
    );
    expect(getSlot(container, 'calendar-preview-caption')).toHaveTextContent(
      'Q3 2026'
    );
  });

  it('is not a button unless it opens the scroller', () => {
    const { container } = renderCalendar();
    expect(getSlot(container, 'calendar-preview-caption')?.tagName).toBe(
      'SPAN'
    );
  });

  /* The reason the scroller is ours: a `Select` portal is what the deleted
     `use-picker-popover.ts` spent 185 lines teaching a popover to recognise. */
  it('mounts no Select anywhere when the scroller is open', () => {
    const { container } = renderCalendar(
      <CalendarPreview.Days>
        <CalendarPreview.Header>
          <CalendarPreview.Caption dropdown />
        </CalendarPreview.Header>
      </CalendarPreview.Days>
    );
    openCaption(container);

    expect(
      getSlot(document.body, 'calendar-preview-caption-popup')
    ).toBeInTheDocument();
    expect(document.body.querySelectorAll('select')).toHaveLength(0);
    expect(screen.queryAllByRole('combobox')).toHaveLength(0);
    expect(screen.queryAllByRole('listbox')).toHaveLength(0);
    expect(
      document.body.querySelectorAll('[data-slot^="select"]')
    ).toHaveLength(0);
  });

  it('moves the view when a month is picked, without selecting anything', () => {
    const onValueChange = vi.fn();
    const { container } = renderCalendar(
      <CalendarPreview.Days>
        <CalendarPreview.Header>
          <CalendarPreview.Caption dropdown />
        </CalendarPreview.Header>
        <CalendarPreview.Grid />
      </CalendarPreview.Days>,
      { onValueChange }
    );
    openCaption(container);

    const march = getAllSlots(
      document.body,
      'calendar-preview-caption-month'
    ).find(option => option.textContent === 'March');
    fireEvent.click(march as HTMLElement);

    expect(getSlot(container, 'calendar-preview-caption')).toHaveTextContent(
      'March 2026'
    );
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('moves the view when a year is picked', () => {
    const { container } = renderCalendar(
      <CalendarPreview.Days>
        <CalendarPreview.Header>
          <CalendarPreview.Caption dropdown />
        </CalendarPreview.Header>
        <CalendarPreview.Grid />
      </CalendarPreview.Days>
    );
    openCaption(container);

    const year = getAllSlots(
      document.body,
      'calendar-preview-caption-year'
    ).find(option => option.textContent === '2030');
    fireEvent.click(year as HTMLElement);

    expect(getSlot(container, 'calendar-preview-caption')).toHaveTextContent(
      'August 2030'
    );
  });

  it('offers ten years either side of today by default', () => {
    const { container } = renderCalendar(
      <CalendarPreview.Days>
        <CalendarPreview.Header>
          <CalendarPreview.Caption dropdown />
        </CalendarPreview.Header>
      </CalendarPreview.Days>
    );
    openCaption(container);
    const years = getAllSlots(
      document.body,
      'calendar-preview-caption-year'
    ).map(option => option.textContent);
    expect(years[0]).toBe('2016');
    expect(years[years.length - 1]).toBe('2036');
  });

  /* A bound the year column cannot reach would be a trap, so the default span
     stretches to cover it — without limiting navigation either way. */
  it('stretches the default year span to cover a distant bound', () => {
    const { container } = renderCalendar(
      <CalendarPreview.Days>
        <CalendarPreview.Header>
          <CalendarPreview.Caption dropdown />
        </CalendarPreview.Header>
      </CalendarPreview.Days>,
      { maxDate: new Date(2050, 0, 1) }
    );
    openCaption(container);
    const years = getAllSlots(
      document.body,
      'calendar-preview-caption-year'
    ).map(option => option.textContent);
    expect(years[years.length - 1]).toBe('2050');
  });

  it('honours an explicit yearRange', () => {
    const { container } = renderCalendar(
      <CalendarPreview.Days>
        <CalendarPreview.Header>
          <CalendarPreview.Caption dropdown />
        </CalendarPreview.Header>
      </CalendarPreview.Days>,
      { yearRange: { from: 2025, to: 2027 } }
    );
    openCaption(container);
    expect(
      getAllSlots(document.body, 'calendar-preview-caption-year')
    ).toHaveLength(3);
  });
});

describe('CalendarPreview.Grid', () => {
  it('mounts no Select and no navigation of its own', () => {
    const { container } = renderCalendar();
    expect(container.querySelectorAll('select')).toHaveLength(0);
    expect(container.querySelectorAll('.rdp-nav')).toHaveLength(0);
    expect(screen.queryByLabelText('Choose the Month')).toBeNull();
  });

  it('keeps the month accessible to a screen reader without a second caption', () => {
    const { container } = renderCalendar();
    const grid = container.querySelector('[role="grid"]');
    expect(grid).toHaveAttribute(
      'aria-label',
      expect.stringContaining('August')
    );
    expect(getSlot(container, 'calendar-preview-caption')).toBeInTheDocument();
  });

  it('renders dateInfo above the date number', () => {
    const { container } = renderCalendar(
      <CalendarPreview.Days>
        <CalendarPreview.Grid
          dateInfo={date => (date.getDate() === 15 ? 'INFO' : null)}
        />
      </CalendarPreview.Days>
    );
    const cell = dayCell(container, '15');
    const parts = Array.from(cell.children).map(child =>
      child.getAttribute('data-slot')
    );
    expect(parts).toEqual([
      'calendar-preview-day-info',
      'calendar-preview-day-number'
    ]);
  });

  it('shows no tooltip when tooltips are off', async () => {
    renderCalendar(
      <CalendarPreview.Days>
        <CalendarPreview.Grid tooltipMessages={() => 'Never shown'} />
      </CalendarPreview.Days>
    );
    expect(screen.queryByText('Never shown')).toBeNull();
  });

  it('disables navigation while the grid is loading', () => {
    const { container } = renderCalendar(
      <CalendarPreview.Days>
        <CalendarPreview.Header />
        <CalendarPreview.Grid loading />
      </CalendarPreview.Days>
    );
    expect(getSlot(container, 'calendar-preview-prev-month')).toBeDisabled();
    expect(getSlot(container, 'calendar-preview-next-month')).toBeDisabled();
  });

  it('leaves navigation alone once loading finishes', () => {
    const { container, rerender } = render(
      <CalendarPreview today={TODAY} defaultMonth={AUGUST}>
        <CalendarPreview.Days>
          <CalendarPreview.Header />
          <CalendarPreview.Grid loading />
        </CalendarPreview.Days>
      </CalendarPreview>
    );
    rerender(
      <CalendarPreview today={TODAY} defaultMonth={AUGUST}>
        <CalendarPreview.Days>
          <CalendarPreview.Header />
          <CalendarPreview.Grid loading={false} />
        </CalendarPreview.Days>
      </CalendarPreview>
    );
    expect(
      getSlot(container, 'calendar-preview-prev-month')
    ).not.toBeDisabled();
  });

  it('forwards weekStartsOn to the grid', () => {
    const { container } = renderCalendar(
      <CalendarPreview.Days>
        <CalendarPreview.Grid weekStartsOn={1} />
      </CalendarPreview.Days>
    );
    const first = getAllSlots(container, 'calendar-preview-weekday')[0];
    expect(first).toHaveTextContent('Mo');
  });

  it('lets a consumer wrap the day slot through components', () => {
    const { container } = renderCalendar(
      <CalendarPreview.Days>
        <CalendarPreview.Grid
          components={{
            DayButton: props => (
              <CalendarPreview.Day {...props} data-custom='true' />
            )
          }}
        />
      </CalendarPreview.Days>
    );
    expect(dayCell(container, '15')).toHaveAttribute('data-custom', 'true');
  });

  it('spreads consumer props onto the grid root, last', () => {
    const { container } = renderCalendar(
      <CalendarPreview.Days>
        <CalendarPreview.Grid id='my-grid' className='mine' />
      </CalendarPreview.Days>
    );
    const grid = getSlot(container, 'calendar-preview-grid');
    expect(grid).toHaveAttribute('id', 'my-grid');
    expect(grid).toHaveClass('mine');
  });
});

describe('CalendarPreview.Footer', () => {
  it('renders a string', () => {
    const { container } = renderCalendar(
      <CalendarPreview.Footer>Dates are inclusive</CalendarPreview.Footer>
    );
    const footer = getSlot(container, 'calendar-preview-footer');
    expect(footer).toHaveTextContent('Dates are inclusive');
    expect(
      getSlot(container, 'calendar-preview-footer-text')
    ).toBeInTheDocument();
  });

  it('renders any node as given', () => {
    const { container } = renderCalendar(
      <CalendarPreview.Footer>
        <button type='button'>Pick a preset</button>
      </CalendarPreview.Footer>
    );
    const footer = getSlot(container, 'calendar-preview-footer');
    expect(within(footer as HTMLElement).getByRole('button')).toHaveTextContent(
      'Pick a preset'
    );
    expect(getSlot(container, 'calendar-preview-footer-text')).toBeNull();
  });
});

describe('CalendarPreview part contract', () => {
  /* Every part takes `render`, `className`, `ref` and carries a `data-slot`,
     with the consumer's props spread last. */
  const parts: Array<[string, string, React.ReactNode]> = [
    [
      'Days',
      'calendar-preview-days',
      <CalendarPreview.Days key='d' className='mine' data-mine='true' />
    ],
    [
      'Header',
      'calendar-preview-header',
      <CalendarPreview.Header key='h' className='mine' data-mine='true' />
    ],
    [
      'PrevMonth',
      'calendar-preview-prev-month',
      <CalendarPreview.PrevMonth key='p' className='mine' data-mine='true' />
    ],
    [
      'NextMonth',
      'calendar-preview-next-month',
      <CalendarPreview.NextMonth key='n' className='mine' data-mine='true' />
    ],
    [
      'Caption',
      'calendar-preview-caption',
      <CalendarPreview.Caption key='c' className='mine' data-mine='true' />
    ],
    [
      'Grid',
      'calendar-preview-grid',
      <CalendarPreview.Grid key='g' className='mine' data-mine='true' />
    ],
    [
      'Footer',
      'calendar-preview-footer',
      <CalendarPreview.Footer key='f' className='mine' data-mine='true' />
    ]
  ];

  it.each(
    parts
  )('%s carries its slot and spreads props last', (_name, slot, element) => {
    const { container } = renderCalendar(element);
    const node = getSlot(container, slot);
    expect(node).toBeInTheDocument();
    expect(node).toHaveClass('mine');
    expect(node).toHaveAttribute('data-mine', 'true');
  });

  it('renders .Reset with its slot and the consumer props', () => {
    const { container } = renderCalendar(
      <CalendarPreview.Reset className='mine' data-mine='true' />,
      { defaultDate: new Date(2026, 7, 20) }
    );
    const node = getSlot(container, 'calendar-preview-reset');
    expect(node).toHaveClass('mine');
    expect(node).toHaveAttribute('data-mine', 'true');
  });

  it('lets render replace the element each part produces', () => {
    const { container } = renderCalendar(
      <CalendarPreview.Days render={<section />}>
        <CalendarPreview.Header render={<nav />}>
          <CalendarPreview.Caption render={<h2 />} />
        </CalendarPreview.Header>
      </CalendarPreview.Days>
    );
    expect(getSlot(container, 'calendar-preview-days')?.tagName).toBe(
      'SECTION'
    );
    expect(getSlot(container, 'calendar-preview-header')?.tagName).toBe('NAV');
    expect(getSlot(container, 'calendar-preview-caption')?.tagName).toBe('H2');
  });

  it('forwards ref to the element each part produces', () => {
    const days = { current: null as HTMLDivElement | null };
    const header = { current: null as HTMLDivElement | null };
    const grid = { current: null as HTMLDivElement | null };
    renderCalendar(
      <CalendarPreview.Days ref={days}>
        <CalendarPreview.Header ref={header} />
        <CalendarPreview.Grid ref={grid} />
      </CalendarPreview.Days>
    );
    expect(days.current).toHaveAttribute('data-slot', 'calendar-preview-days');
    expect(header.current).toHaveAttribute(
      'data-slot',
      'calendar-preview-header'
    );
    expect(grid.current).toHaveAttribute('data-slot', 'calendar-preview-grid');
  });
});

describe('CalendarPreview part boundaries', () => {
  it('names the part when a cell is used outside a grid', () => {
    const error = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    expect(() =>
      render(
        <CalendarPreview today={TODAY}>
          <CalendarPreview.Day
            day={{ date: TODAY, outside: false } as never}
            modifiers={{}}
          />
        </CalendarPreview>
      )
    ).toThrow('CalendarPreview.Day must be used within <CalendarPreview.Grid>');
    error.mockRestore();
  });

  it('runs a consumer onClick alongside the reset', () => {
    const onClick = vi.fn();
    const onValueChange = vi.fn();
    const { container } = renderCalendar(
      <CalendarPreview.Reset onClick={onClick} />,
      { defaultDate: new Date(2026, 7, 20), onValueChange }
    );
    fireEvent.click(
      getSlot(container, 'calendar-preview-reset') as HTMLElement
    );
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledTimes(1);
  });

  it('leaves the reset inert while the calendar is disabled', () => {
    const { container } = renderCalendar(<CalendarPreview.Reset />, {
      defaultDate: new Date(2026, 7, 20),
      disabled: true
    });
    expect(getSlot(container, 'calendar-preview-reset')).toBeDisabled();
  });

  it('scrolls the active row of the caption scroller into view', () => {
    const scrollIntoView = vi.fn();
    Object.defineProperty(Element.prototype, 'scrollIntoView', {
      value: scrollIntoView,
      writable: true,
      configurable: true
    });
    const { container } = renderCalendar(
      <CalendarPreview.Days>
        <CalendarPreview.Header>
          <CalendarPreview.Caption dropdown />
        </CalendarPreview.Header>
      </CalendarPreview.Days>
    );
    openCaption(container);
    /* One per column — the active month and the active year. */
    expect(scrollIntoView).toHaveBeenCalledTimes(2);
    expect(scrollIntoView).toHaveBeenCalledWith({ block: 'center' });
    Reflect.deleteProperty(Element.prototype, 'scrollIntoView');
  });
});

describe('CalendarPreview public surface', () => {
  /* The scope boundary for this phase, asserted rather than described: the
     popover, the input and the period views land in later PRs, and a part
     appearing here early would be public API shipped by accident. */
  /* `displayName` is an own property of the root function `Object.assign`
     writes the parts onto, so it is not one of them. */
  const partNames = Object.keys(CalendarPreviewFromBarrel).filter(
    key => key !== 'displayName'
  );

  it('exports exactly the parts this phase builds', () => {
    expect(partNames.sort()).toEqual(
      [
        'Caption',
        'Day',
        'Days',
        'Footer',
        'Grid',
        'Header',
        'NextMonth',
        'PrevMonth',
        'Reset',
        'Weekday'
      ].sort()
    );
  });

  it('gives every part a displayName', () => {
    expect(CalendarPreviewFromBarrel.displayName).toBe('CalendarPreview');
    for (const name of partNames) {
      const part = CalendarPreviewFromBarrel[
        name as keyof typeof CalendarPreviewFromBarrel
      ] as { displayName?: string };
      expect(part.displayName, `${name} has no displayName`).toBe(
        `CalendarPreview.${name}`
      );
    }
  });
});

describe('defaultFormatValue', () => {
  it('formats a day as DD/MM/YYYY', () => {
    expect(defaultFormatValue(new Date(2027, 4, 20), 'day')).toBe('20/05/2027');
  });

  it('formats the coarser scales by their own shorthand', () => {
    const value = { date: '2026-08-31', scale: 'month' as const };
    expect(defaultFormatValue(value, 'month')).toBe('Aug 2026');
    expect(defaultFormatValue(value, 'quarter')).toBe('Q3 2026');
    expect(defaultFormatValue(value, 'halfYear')).toBe('H2 2026');
    expect(defaultFormatValue(value, 'year')).toBe('2026');
    expect(
      defaultFormatValue({ date: '2026-02-01', scale: 'day' }, 'halfYear')
    ).toBe('H1 2026');
  });
});

describe('useCalendar', () => {
  function Probe() {
    const { value, setValue, month, setMonth, scale, isDateUnavailable } =
      useCalendar();
    return (
      <div>
        <span data-testid='value'>{value ? value.getDate() : 'none'}</span>
        <span data-testid='month'>{month.getMonth()}</span>
        <span data-testid='scale'>{scale}</span>
        <span data-testid='blocked'>
          {String(isDateUnavailable(new Date(2026, 7, 1)))}
        </span>
        <button type='button' onClick={() => setValue(new Date(2026, 7, 20))}>
          set
        </button>
        <button type='button' onClick={() => setMonth(new Date(2026, 9, 1))}>
          move
        </button>
        <button type='button' onClick={() => setValue(null)}>
          clear
        </button>
      </div>
    );
  }

  it('reads the value, the view month, the scale and the predicate', () => {
    render(
      <CalendarPreview
        today={TODAY}
        defaultMonth={AUGUST}
        minDate={new Date(2026, 7, 10)}
      >
        <Probe />
      </CalendarPreview>
    );
    expect(screen.getByTestId('value')).toHaveTextContent('none');
    expect(screen.getByTestId('month')).toHaveTextContent('7');
    expect(screen.getByTestId('scale')).toHaveTextContent('day');
    expect(screen.getByTestId('blocked')).toHaveTextContent('true');
  });

  it('commits through the same state the parts use', () => {
    function Harness() {
      const [value, setValue] = useState<Date | null>(null);
      return (
        <CalendarPreview
          today={TODAY}
          defaultMonth={AUGUST}
          value={value}
          onValueChange={setValue}
        >
          <Probe />
          <CalendarPreview.Days />
        </CalendarPreview>
      );
    }
    const { container } = render(<Harness />);

    fireEvent.click(screen.getByText('set'));
    expect(screen.getByTestId('value')).toHaveTextContent('20');
    expect(dayCell(container, '20')).toHaveAttribute('data-selected');

    fireEvent.click(screen.getByText('move'));
    expect(getSlot(container, 'calendar-preview-caption')).toHaveTextContent(
      'October 2026'
    );

    fireEvent.click(screen.getByText('clear'));
    expect(screen.getByTestId('value')).toHaveTextContent('none');
  });
});
