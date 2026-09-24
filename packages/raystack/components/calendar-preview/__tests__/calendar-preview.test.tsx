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
    /* Silence the logged throw so it does not read as a failure. */
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

  it('never stops navigation at minDate', () => {
    const { container } = renderCalendar(undefined, {
      minDate: new Date(2026, 7, 1),
      maxDate: new Date(2026, 7, 31)
    });
    const prev = getSlot(container, 'calendar-preview-prev-month');
    expect(prev).not.toBeDisabled();

    fireEvent.click(prev as HTMLElement);
    expect(getSlot(container, 'calendar-preview-caption')).toHaveTextContent(
      'Jul 2026'
    );
    fireEvent.click(prev as HTMLElement);
    expect(getSlot(container, 'calendar-preview-caption')).toHaveTextContent(
      'Jun 2026'
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
      'Oct 2026'
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
      'Sep 2026'
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
      'Aug 2026'
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
      'Mar 2026'
    );
  });

  it('shows several months side by side, each captioned over its own grid', () => {
    const { container } = renderCalendar(
      <CalendarPreview.Days numberOfMonths={2} />
    );
    expect(getAllSlots(container, 'calendar-preview-table')).toHaveLength(2);

    const captions = getAllSlots(
      container,
      'calendar-preview-month-header-caption'
    );
    expect(captions.map(node => node.textContent)).toEqual([
      'Aug 2026',
      'Sep 2026'
    ]);
    expect(getSlot(container, 'calendar-preview-header')).toBeNull();
  });

  it('splits the nav to the outer edges when showing several months', () => {
    const { container } = renderCalendar(
      <CalendarPreview.Days numberOfMonths={2} />
    );
    const [first, second] = getAllSlots(
      container,
      'calendar-preview-month-header'
    );

    expect(getSlot(first, 'calendar-preview-prev-month')).not.toBeNull();
    expect(getSlot(first, 'calendar-preview-next-month')).toBeNull();
    expect(getSlot(second, 'calendar-preview-prev-month')).toBeNull();
    expect(getSlot(second, 'calendar-preview-next-month')).not.toBeNull();
    expect(getSlot(container, 'calendar-preview-reset')).toBeNull();
  });

  it('navigates both months together from the split nav', () => {
    const { container } = renderCalendar(
      <CalendarPreview.Days numberOfMonths={2} />,
      { defaultDate: new Date(2026, 7, 10) }
    );
    fireEvent.click(
      getSlot(container, 'calendar-preview-next-month') as HTMLElement
    );
    expect(
      getAllSlots(container, 'calendar-preview-month-header-caption').map(
        node => node.textContent
      )
    ).toEqual(['Sep 2026', 'Oct 2026']);
  });
});

describe('CalendarPreview.Reset', () => {
  it('does not render without a defaultDate', () => {
    const { container } = renderCalendar(undefined, {
      defaultValue: new Date(2026, 7, 20)
    });
    expect(getSlot(container, 'calendar-preview-reset')).toBeNull();
  });

  it('stays mounted and inert when the value equals the defaultDate', () => {
    const onValueChange = vi.fn();
    const { container } = renderCalendar(undefined, {
      defaultDate: new Date(2026, 7, 20),
      defaultValue: new Date(2026, 7, 20),
      onValueChange
    });

    const reset = getSlot(container, 'calendar-preview-reset') as HTMLElement;
    expect(reset).toBeInTheDocument();
    expect(reset).toHaveAttribute('aria-disabled', 'true');
    expect(reset).toHaveAttribute('data-restored');
    fireEvent.click(reset);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('stays disabled when a caller passes disabled={false}', () => {
    const onValueChange = vi.fn();
    const { container } = renderCalendar(
      <CalendarPreview.Days>
        <CalendarPreview.Header>
          <CalendarPreview.Reset disabled={false} />
        </CalendarPreview.Header>
        <CalendarPreview.Grid />
      </CalendarPreview.Days>,
      {
        defaultDate: new Date(2026, 7, 20),
        defaultValue: new Date(2026, 7, 20),
        onValueChange
      }
    );

    const reset = getSlot(
      container,
      'calendar-preview-reset'
    ) as HTMLButtonElement;
    expect(reset).toHaveAttribute('aria-disabled', 'true');

    fireEvent.click(reset);
    expect(onValueChange).not.toHaveBeenCalled();
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

  it('clears the selection when the defaultDate is null', () => {
    const onValueChange = vi.fn();
    const { container } = renderCalendar(undefined, {
      defaultDate: null,
      defaultValue: new Date(2026, 7, 10),
      onValueChange
    });

    fireEvent.click(
      getSlot(container, 'calendar-preview-reset') as HTMLElement
    );

    expect(onValueChange.mock.calls[0][0]).toBeNull();
    expect(dayCell(container, '10')).not.toHaveAttribute('data-selected');
  });

  it('reports a null-default clear as a clear of the day it cleared', () => {
    const onValueChange = vi.fn();
    const { container } = renderCalendar(undefined, {
      defaultDate: null,
      defaultValue: new Date(2026, 7, 10),
      onValueChange
    });

    fireEvent.click(
      getSlot(container, 'calendar-preview-reset') as HTMLElement
    );

    const details = onValueChange.mock.calls[0][1];
    expect(details.reason).toBe('clear');
    expect(details.toDate()).toEqual(new Date(2026, 7, 10));
  });

  it('is inert under a null defaultDate while nothing is selected', () => {
    const { container } = renderCalendar(undefined, { defaultDate: null });

    const reset = getSlot(container, 'calendar-preview-reset');
    expect(reset).toBeInTheDocument();
    expect(reset).toHaveAttribute('aria-disabled', 'true');
    expect(reset).toHaveAttribute('data-restored');
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
    const reset = getSlot(container, 'calendar-preview-reset');
    expect(reset).toBeInTheDocument();
    expect(reset).toHaveAttribute('aria-disabled', 'true');
    expect(reset).not.toBeDisabled();
  });

  it('keeps focus on itself after restoring the default', () => {
    const { container } = renderCalendar(undefined, {
      defaultDate: new Date(2026, 7, 20),
      defaultValue: new Date(2026, 7, 10)
    });

    const reset = getSlot(container, 'calendar-preview-reset') as HTMLElement;
    reset.focus();
    expect(document.activeElement).toBe(reset);

    fireEvent.click(reset);

    expect(document.activeElement).toBe(reset);
    expect(document.activeElement).not.toBe(document.body);
  });

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
      'Sep 2026'
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
      'Aug 2026'
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
    expect(screen.queryAllByRole('option')).toHaveLength(0);
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
    ).find(option => option.textContent === 'Mar');
    fireEvent.click(march as HTMLElement);

    expect(getSlot(container, 'calendar-preview-caption')).toHaveTextContent(
      'Mar 2026'
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
      'Aug 2030'
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
    expect(screen.queryByLabelText('Choose the Month')).toBeNull();

    const ours = new Set([
      getSlot(container, 'calendar-preview-prev-month'),
      getSlot(container, 'calendar-preview-next-month')
    ]);
    const strays = screen
      .queryAllByRole('button', { name: /previous month|next month/i })
      .filter(button => !ours.has(button));
    expect(strays).toHaveLength(0);
    expect(container.querySelectorAll('nav')).toHaveLength(0);
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

  it('names each month grid without absorbing the nav button labels', () => {
    const { container } = renderCalendar(
      <CalendarPreview.Days numberOfMonths={2} />
    );

    const grids = Array.from(container.querySelectorAll('[role="grid"]'));
    expect(grids).toHaveLength(2);
    expect(grids[0]).toHaveAttribute('aria-label', 'August 2026');
    expect(grids[1]).toHaveAttribute('aria-label', 'September 2026');

    for (const grid of grids) {
      expect(grid).not.toHaveAttribute('aria-labelledby');
      expect(grid.getAttribute('aria-label')).not.toMatch(/month/i);
    }
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

  it.each([
    [false],
    [true]
  ])('keeps the day trigger with showTooltip=%s', showTooltip => {
    const { container, unmount } = renderCalendar(
      <CalendarPreview.Days>
        <CalendarPreview.Grid
          showTooltip={showTooltip}
          tooltipMessages={() => 'Anything'}
        />
      </CalendarPreview.Days>
    );
    expect(getAllSlots(container, 'calendar-preview-day-trigger').length).toBe(
      getAllSlots(container, 'calendar-preview-day').length
    );
    unmount();
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

  /* The nav was gated on `busy` but the caption was not, so the month and year
     scroller stayed open over a grid that was about to change. */
  it('disables the caption dropdown while the grid is loading', () => {
    const { container } = renderCalendar(
      <CalendarPreview.Days>
        <CalendarPreview.Header>
          <CalendarPreview.Caption dropdown />
        </CalendarPreview.Header>
        <CalendarPreview.Grid loading />
      </CalendarPreview.Days>
    );
    expect(getSlot(container, 'calendar-preview-caption')).toBeDisabled();
  });

  it('leaves the caption dropdown alone when the grid is not loading', () => {
    const { container } = renderCalendar(
      <CalendarPreview.Days>
        <CalendarPreview.Header>
          <CalendarPreview.Caption dropdown />
        </CalendarPreview.Header>
        <CalendarPreview.Grid />
      </CalendarPreview.Days>
    );
    expect(getSlot(container, 'calendar-preview-caption')).not.toBeDisabled();
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

  it('starts the week on Sunday and spells the weekdays in three letters', () => {
    const { container } = renderCalendar();
    expect(
      getAllSlots(container, 'calendar-preview-weekday').map(
        node => node.textContent
      )
    ).toEqual(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
  });

  it('forwards weekStartsOn to the grid', () => {
    const { container } = renderCalendar(
      <CalendarPreview.Days>
        <CalendarPreview.Grid weekStartsOn={1} />
      </CalendarPreview.Days>
    );
    const first = getAllSlots(container, 'calendar-preview-weekday')[0];
    expect(first).toHaveTextContent('Mon');
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

  it('carries its own slot on the root, and spreads props last', () => {
    const { container } = render(
      <CalendarPreview today={TODAY} className='mine' data-mine='true'>
        <CalendarPreview.Days />
      </CalendarPreview>
    );
    const root = getSlot(container, 'calendar-preview');
    expect(root).toBeInTheDocument();
    expect(root).toHaveClass('mine');
    expect(root).toHaveAttribute('data-mine', 'true');
    expect(root).toHaveAttribute('data-scale', 'day');
  });

  it('contains the day view and the footer rather than emitting them loose', () => {
    const { container } = render(
      <CalendarPreview today={TODAY}>
        <CalendarPreview.Days />
        <CalendarPreview.Footer>Dates are inclusive</CalendarPreview.Footer>
      </CalendarPreview>
    );
    const root = getSlot(container, 'calendar-preview') as HTMLElement;
    expect(getSlot(root, 'calendar-preview-days')?.parentElement).toBe(root);
    expect(getSlot(root, 'calendar-preview-footer')?.parentElement).toBe(root);
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
    expect(scrollIntoView).toHaveBeenCalledTimes(2);
    expect(scrollIntoView).toHaveBeenCalledWith({ block: 'center' });
    Reflect.deleteProperty(Element.prototype, 'scrollIntoView');
  });
});

describe('CalendarPreview public surface', () => {
  /* `displayName` is a property of the root function, not one of the parts. */
  const partNames = Object.keys(CalendarPreviewFromBarrel).filter(
    key => key !== 'displayName'
  );

  it('exports exactly the parts it means to', () => {
    expect(partNames.sort()).toEqual(
      [
        'Body',
        'Caption',
        'Content',
        'Day',
        'Days',
        'Footer',
        'Grid',
        'HalfYears',
        'Header',
        'Input',
        'Label',
        'Months',
        'NextMonth',
        'Panel',
        'PrevMonth',
        'Quarters',
        'Reset',
        'Scale',
        'Scales',
        'Separator',
        'Trigger',
        'Weekday',
        'Years'
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

describe('inertness', () => {
  function Setter({ day }: { day: Date }) {
    const { setValue } = useCalendar();
    return (
      <button type='button' onClick={() => setValue(day)}>
        set
      </button>
    );
  }

  it.each([
    'readOnly',
    'disabled'
  ] as const)('ignores useCalendar().setValue when %s', flag => {
    const onValueChange = vi.fn();
    const { container } = renderCalendar(
      <>
        <CalendarPreview.Days />
        <Setter day={new Date(2026, 7, 20)} />
      </>,
      { [flag]: true, onValueChange }
    );

    fireEvent.click(screen.getByText('set'));

    expect(onValueChange).not.toHaveBeenCalled();
    expect(dayCell(container, '20')).not.toHaveAttribute('data-selected');
  });

  it.each([
    'readOnly',
    'disabled'
  ] as const)('renders .Reset disabled and commits nothing when %s', flag => {
    const onValueChange = vi.fn();
    const { container } = renderCalendar(
      <>
        <CalendarPreview.Header>
          <CalendarPreview.Reset />
        </CalendarPreview.Header>
        <CalendarPreview.Days />
      </>,
      {
        [flag]: true,
        defaultDate: new Date(2026, 7, 9),
        defaultValue: new Date(2026, 7, 20),
        onValueChange
      }
    );

    const reset = getSlot(container, 'calendar-preview-reset');
    expect(reset).toBeInTheDocument();
    expect(reset).toBeDisabled();

    fireEvent.click(reset as HTMLElement);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('still commits when neither flag is set', () => {
    const onValueChange = vi.fn();
    const { container } = renderCalendar(
      <>
        <CalendarPreview.Days />
        <Setter day={new Date(2026, 7, 20)} />
      </>,
      { onValueChange }
    );

    fireEvent.click(screen.getByText('set'));

    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(dayCell(container, '20')).toHaveAttribute('data-selected');
  });
});

describe('CalendarPreview.Grid children', () => {
  it('renders the day grid even when given children', () => {
    const { container } = renderCalendar(
      <CalendarPreview.Days>
        <CalendarPreview.Grid>HIJACKED</CalendarPreview.Grid>
      </CalendarPreview.Days>
    );

    expect(container).not.toHaveTextContent('HIJACKED');
    expect(getAllSlots(container, 'calendar-preview-day').length).toBe(31);
    expect(dayCell(container, '15')).toHaveAttribute('data-today');
  });
});

describe('change reasons', () => {
  function Clearer() {
    const { setValue } = useCalendar();
    return (
      <button type='button' onClick={() => setValue(null)}>
        clear
      </button>
    );
  }

  it("reports a restore as 'reset', not as a pick", () => {
    const onValueChange = vi.fn();
    const { container } = renderCalendar(
      <>
        <CalendarPreview.Header>
          <CalendarPreview.Reset />
        </CalendarPreview.Header>
        <CalendarPreview.Days />
      </>,
      {
        defaultDate: new Date(2026, 7, 20),
        defaultValue: new Date(2026, 7, 10),
        onValueChange
      }
    );

    fireEvent.click(
      getSlot(container, 'calendar-preview-reset') as HTMLElement
    );

    expect(onValueChange.mock.calls[0][1].reason).toBe('reset');
  });

  it("reports a click as 'select'", () => {
    const onValueChange = vi.fn();
    const { container } = renderCalendar(undefined, { onValueChange });

    fireEvent.click(dayCell(container, '20'));

    expect(onValueChange.mock.calls[0][1].reason).toBe('select');
  });

  it("reports a hook clear as 'clear', carrying the day cleared", () => {
    const onValueChange = vi.fn();
    renderCalendar(
      <>
        <CalendarPreview.Days />
        <Clearer />
      </>,
      { defaultValue: new Date(2026, 7, 10), onValueChange }
    );

    fireEvent.click(screen.getByText('clear'));

    const [value, details] = onValueChange.mock.calls[0];
    expect(value).toBeNull();
    expect(details.reason).toBe('clear');
    expect(details.toDate()).toEqual(new Date(2026, 7, 10));
  });
});

describe('keyboard navigation', () => {
  function focused(): string | null {
    const active = document.activeElement;
    return (
      active?.querySelector('[data-slot="calendar-preview-day-number"]')
        ?.textContent ?? null
    );
  }

  /* `.focus()` alone does not reach React's `onFocus` under jsdom, so RDP registers no focus target. */
  function focusDay(container: HTMLElement, day: string): HTMLElement {
    const cell = dayCell(container, day);
    cell.focus();
    fireEvent.focus(cell);
    return cell;
  }

  it.each([
    ['ArrowRight', '16'],
    ['ArrowLeft', '14'],
    ['ArrowDown', '22'],
    ['ArrowUp', '8']
  ])('moves the focused day on %s', (key, expected) => {
    const { container } = renderCalendar();
    const start = focusDay(container, '15');

    fireEvent.keyDown(start, { key });

    expect(focused()).toBe(expected);
  });

  /* August 2026 starts on a Saturday, so the 19th is a Wednesday. */
  it('moves to the start and end of the week on Home and End', () => {
    const { container } = renderCalendar();
    const start = focusDay(container, '19');

    fireEvent.keyDown(start, { key: 'Home' });
    expect(focused()).toBe('16');

    fireEvent.keyDown(document.activeElement as HTMLElement, { key: 'End' });
    expect(focused()).toBe('22');
  });

  it('commits the focused day on Enter', () => {
    const onValueChange = vi.fn();
    const { container } = renderCalendar(undefined, { onValueChange });
    const day = focusDay(container, '20');

    fireEvent.keyDown(day, { key: 'Enter' });
    fireEvent.click(day);

    expect(onValueChange).toHaveBeenCalled();
    expect(dayCell(container, '20')).toHaveAttribute('data-selected');
  });

  it('keeps exactly one day in the tab order', () => {
    const { container } = renderCalendar();
    const tabbable = getAllSlots(container, 'calendar-preview-day').filter(
      cell => cell.getAttribute('tabindex') === '0'
    );

    expect(tabbable).toHaveLength(1);
  });

  it('still moves between days when readOnly', () => {
    const { container } = renderCalendar(undefined, { readOnly: true });
    const start = focusDay(container, '15');

    fireEvent.keyDown(start, { key: 'ArrowRight' });

    expect(focused()).toBe('16');
    expect(document.activeElement).toBe(dayCell(container, '16'));
    expect(dayCell(container, '15')).toHaveAttribute('aria-disabled', 'true');
    expect(dayCell(container, '15')).not.toBeDisabled();
  });
});

describe('the month the calendar opens on', () => {
  function caption(container: HTMLElement): string {
    return getSlot(container, 'calendar-preview-caption')?.textContent ?? '';
  }

  it('prefers an explicit defaultMonth over everything else', () => {
    const { container } = render(
      <CalendarPreview
        today={TODAY}
        defaultMonth={new Date(2027, 2, 1)}
        value={new Date(2027, 10, 9)}
      >
        <CalendarPreview.Days />
      </CalendarPreview>
    );
    expect(caption(container)).toContain('Mar 2027');
  });

  it('falls back to the month of a controlled value', () => {
    const { container } = render(
      <CalendarPreview today={TODAY} value={new Date(2027, 2, 9)}>
        <CalendarPreview.Days />
      </CalendarPreview>
    );
    expect(caption(container)).toContain('Mar 2027');
  });

  it('falls back to the month of an uncontrolled defaultValue', () => {
    const { container } = render(
      <CalendarPreview today={TODAY} defaultValue={new Date(2027, 2, 9)}>
        <CalendarPreview.Days />
      </CalendarPreview>
    );
    expect(caption(container)).toContain('Mar 2027');
  });

  it('falls back to today when there is no value at all', () => {
    const { container } = render(
      <CalendarPreview today={TODAY}>
        <CalendarPreview.Days />
      </CalendarPreview>
    );
    expect(caption(container)).toContain('Aug 2026');
  });
});

describe('timeZone', () => {
  const NOON_UTC = new Date(Date.UTC(2026, 7, 15, 12));
  const AUGUST_UTC = new Date(Date.UTC(2026, 7, 1, 12));

  it.each([
    ['Pacific/Kiritimati', '16'],
    ['Pacific/Niue', '15'],
    ['UTC', '15']
  ])('marks today by the day the instant falls on in %s', (zone, day) => {
    const { container } = renderCalendar(<CalendarPreview.Days />, {
      today: NOON_UTC,
      defaultMonth: AUGUST_UTC,
      timeZone: zone
    });

    expect(dayCell(container, day)).toHaveAttribute('data-today');
  });

  it.each([
    'Pacific/Kiritimati',
    'Pacific/Niue',
    'UTC'
  ])('opens on the month the instant falls in, in %s', zone => {
    const { container } = renderCalendar(<CalendarPreview.Days />, {
      today: NOON_UTC,
      defaultMonth: AUGUST_UTC,
      timeZone: zone
    });

    const caption = getSlot(container, 'calendar-preview-caption');
    expect(caption?.textContent).toContain('Aug 2026');
  });

  /* RDP already shifts its date into the zone; a plain instant is the path that needs the fix. */
  function Setter({ day }: { day: Date }) {
    const { setValue } = useCalendar();
    return (
      <button type='button' onClick={() => setValue(day)}>
        set
      </button>
    );
  }

  it.each([
    ['Pacific/Kiritimati', '2026-08-21'],
    ['Pacific/Niue', '2026-08-20'],
    ['UTC', '2026-08-20']
  ])('keys the change period in the calendar zone, not the ambient one (%s)', (zone, expected) => {
    const onValueChange = vi.fn();
    renderCalendar(
      <>
        <CalendarPreview.Days />
        <Setter day={new Date(Date.UTC(2026, 7, 20, 23, 30))} />
      </>,
      {
        today: NOON_UTC,
        defaultMonth: AUGUST_UTC,
        timeZone: zone,
        onValueChange
      }
    );

    fireEvent.click(screen.getByText('set'));

    const [, details] = onValueChange.mock.calls[0];
    expect(details.period.start).toBe(expected);
    expect(details.period.end).toBe(expected);
  });
});

describe('defaultFormatValue', () => {
  it('formats a day as DD MMM YYYY', () => {
    expect(defaultFormatValue(new Date(2027, 4, 20), 'day')).toBe(
      '20 May 2027'
    );
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
        <span data-testid='value'>
          {value instanceof Date ? value.getDate() : 'none'}
        </span>
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
      'Oct 2026'
    );

    fireEvent.click(screen.getByText('clear'));
    expect(screen.getByTestId('value')).toHaveTextContent('none');
  });

  it('reads the half-built range', () => {
    function DraftProbe() {
      const { draft } = useCalendar();
      return (
        <span data-testid='draft'>
          {draft?.from ? String(draft.from.getDate()) : 'none'}
        </span>
      );
    }
    const { container } = render(
      <CalendarPreview today={TODAY} defaultMonth={AUGUST} selection='range'>
        <DraftProbe />
        <CalendarPreview.Days />
      </CalendarPreview>
    );
    expect(screen.getByTestId('draft')).toHaveTextContent('none');
    fireEvent.click(dayCell(container, '10'));
    expect(screen.getByTestId('draft')).toHaveTextContent('10');
  });

  it('reads the period a scale switch is holding', () => {
    function ScaleDraftProbe() {
      const { scaleDraft } = useCalendar();
      return (
        <span data-testid='scale-draft'>{scaleDraft?.date ?? 'none'}</span>
      );
    }
    const { container } = render(
      <CalendarPreview
        today={TODAY}
        defaultMonth={AUGUST}
        scales={['day', 'quarter']}
      >
        <ScaleDraftProbe />
        <CalendarPreview.Body />
      </CalendarPreview>
    );
    expect(screen.getByTestId('scale-draft')).toHaveTextContent('none');
    const chip = getAllSlots(container, 'calendar-preview-scale').find(
      node => node.getAttribute('data-scale') === 'quarter'
    );
    fireEvent.click(chip as HTMLElement);
    expect(screen.getByTestId('scale-draft')).toHaveTextContent('2026-07-01');
  });
});

describe('CalendarPreview week numbers and the padded row', () => {
  /* September fills five rows; August reaches into its sixth with the 30th. */
  const SEPTEMBER = new Date(2026, 8, 1);

  const weekNumbers = (container: HTMLElement) =>
    getAllSlots(container, 'calendar-preview-week-number').map(
      cell => cell.textContent
    );

  const grid = (props = {}) => (
    <CalendarPreview.Days>
      <CalendarPreview.Header />
      <CalendarPreview.Grid showWeekNumber fixedWeeks {...props} />
    </CalendarPreview.Days>
  );

  it('leaves the padded row unnumbered', () => {
    const { container } = renderCalendar(grid(), { defaultMonth: SEPTEMBER });
    const numbers = weekNumbers(container);
    expect(numbers).toHaveLength(6);
    expect(numbers[numbers.length - 1]).toBe('');
    expect(numbers.slice(0, 5).every(Boolean)).toBe(true);
  });

  it('keeps the cell it empties', () => {
    const { container } = renderCalendar(grid(), { defaultMonth: SEPTEMBER });
    const rows = Array.from(container.querySelectorAll('tbody tr'));
    const cells = rows.map(row => row.children.length);
    expect(new Set(cells).size).toBe(1);
  });

  it('numbers the padded row when its days are shown', () => {
    const { container } = renderCalendar(grid({ showOutsideDays: true }), {
      defaultMonth: SEPTEMBER
    });
    expect(weekNumbers(container).every(Boolean)).toBe(true);
  });

  it('numbers a sixth row that the month reaches into', () => {
    const { container } = renderCalendar(grid());
    const numbers = weekNumbers(container);
    expect(numbers).toHaveLength(6);
    expect(numbers.every(Boolean)).toBe(true);
  });
});
