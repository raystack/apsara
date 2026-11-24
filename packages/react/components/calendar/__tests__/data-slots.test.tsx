import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { expectSlots, getAllSlots, getSlot } from '~/test-utils/data-slots';
import { Calendar } from '../calendar';

const TODAY = new Date(2026, 7, 15);
const AUGUST = new Date(2026, 7, 1);

function renderCalendar(ui?: React.ReactNode, props = {}) {
  return render(
    <Calendar today={TODAY} defaultMonth={AUGUST} {...props}>
      {ui ?? <Calendar.Days />}
    </Calendar>
  );
}

describe('Calendar data-slot contract', () => {
  it('exposes a slot for every element the default day view renders', () => {
    const { container } = renderCalendar();
    expectSlots(container, [
      'calendar',
      'calendar-days',
      'calendar-header',
      'calendar-prev-month',
      'calendar-caption',
      'calendar-next-month',
      'calendar-grid',
      'calendar-weeks',
      'calendar-table',
      'calendar-skeleton',
      'calendar-weekday',
      'calendar-day-trigger',
      'calendar-day',
      'calendar-day-number'
    ]);
  });

  it('renders exactly the documented slots, and no others', () => {
    const { container } = renderCalendar();
    const rendered = new Set(
      Array.from(container.querySelectorAll('[data-slot]'))
        .map(element => element.getAttribute('data-slot') ?? '')
        .filter(name => name.startsWith('calendar'))
    );
    /* Slot names are semver-covered public API. */
    expect([...rendered].sort()).toEqual(
      [
        'calendar',
        'calendar-day',
        'calendar-day-number',
        'calendar-day-trigger',
        'calendar-days',
        'calendar-caption',
        'calendar-grid',
        'calendar-header',
        'calendar-next-month',
        'calendar-prev-month',
        'calendar-skeleton',
        'calendar-table',
        'calendar-weekday',
        'calendar-weeks'
      ].sort()
    );
  });

  it('renders exactly the documented slots with the optional columns on', () => {
    const { container } = renderCalendar(
      <Calendar.Days>
        <Calendar.Grid showWeekNumber fixedWeeks showOutsideDays />
      </Calendar.Days>
    );
    const rendered = new Set(
      Array.from(container.querySelectorAll('[data-slot]'))
        .map(element => element.getAttribute('data-slot') ?? '')
        .filter(name => name.startsWith('calendar'))
    );

    expect([...rendered].sort()).toEqual(
      [
        'calendar',
        'calendar-day',
        'calendar-day-number',
        'calendar-day-trigger',
        'calendar-days',
        'calendar-grid',
        'calendar-skeleton',
        'calendar-table',
        'calendar-week-number',
        'calendar-week-number-header',
        'calendar-weekday',
        'calendar-weeks'
      ].sort()
    );
  });

  it('never renders an empty data-slot', () => {
    const { container } = renderCalendar(
      <Calendar.Days>
        <Calendar.Grid showWeekNumber fixedWeeks showOutsideDays />
      </Calendar.Days>
    );

    const blank = Array.from(container.querySelectorAll('[data-slot]')).filter(
      element => element.getAttribute('data-slot')?.trim() === ''
    );

    expect(blank).toHaveLength(0);
  });

  it('exposes a slot for every element the two-month day view renders', () => {
    const { container } = renderCalendar(<Calendar.Days numberOfMonths={2} />);
    expectSlots(container, [
      'calendar',
      'calendar-days',
      'calendar-month-header',
      'calendar-prev-month',
      'calendar-month-header-caption',
      'calendar-next-month',
      'calendar-grid',
      'calendar-table',
      'calendar-weekday',
      'calendar-day'
    ]);
    expect(getSlot(container, 'calendar-header')).toBeNull();
  });

  it('exposes the reset slot only when there is something to restore', () => {
    const { container } = renderCalendar(undefined, {
      defaultDate: new Date(2026, 7, 10),
      defaultValue: new Date(2026, 7, 20)
    });
    expect(getSlot(container, 'calendar-reset')).not.toBeNull();
  });

  it('exposes the footer slots when a footer is mounted', () => {
    const { container } = renderCalendar(
      <>
        <Calendar.Days />
        <Calendar.Footer>Dates are inclusive</Calendar.Footer>
      </>
    );
    expectSlots(container, ['calendar-footer', 'calendar-footer-text']);
  });

  it('exposes the day-info slot only where dateInfo returns something', () => {
    const { container } = renderCalendar(
      <Calendar.Days>
        <Calendar.Grid
          dateInfo={date => (date.getDate() === 15 ? 'INFO' : null)}
        />
      </Calendar.Days>
    );
    expect(getAllSlots(container, 'calendar-day-info')).toHaveLength(1);
  });

  it('omits the day-info slot when no dateInfo is given', () => {
    const { container } = renderCalendar();
    expect(getSlot(container, 'calendar-day-info')).toBeNull();
  });

  it('exposes the tooltip slot on hover when tooltips are enabled', async () => {
    renderCalendar(
      <Calendar.Days>
        <Calendar.Grid
          showTooltip
          tooltipMessages={date => (date.getDate() === 15 ? 'Fifteenth' : null)}
        />
      </Calendar.Days>
    );
    const user = userEvent.setup();
    const day = screen.getByText('15').closest('button');
    await user.hover(day as HTMLButtonElement);
    expect(await screen.findByText('Fifteenth')).toBeInTheDocument();
    expect(getSlot(document.body, 'calendar-day-tooltip')).not.toBeNull();
  });

  it('exposes the caption scroller slots once it is opened', () => {
    const { container } = renderCalendar(
      <Calendar.Days>
        <Calendar.Header>
          <Calendar.Caption dropdown />
        </Calendar.Header>
      </Calendar.Days>
    );
    const caption = getSlot(container, 'calendar-caption');
    fireEvent.pointerDown(caption as HTMLElement);
    fireEvent.click(caption as HTMLElement);
    expectSlots(document.body, [
      'calendar-caption-positioner',
      'calendar-caption-popup',
      'calendar-caption-months',
      'calendar-caption-month',
      'calendar-caption-divider',
      'calendar-caption-years',
      'calendar-caption-year'
    ]);
  });
});

describe('Calendar state attributes', () => {
  it('marks the day view with its inert states', () => {
    const { container } = renderCalendar(undefined, {
      disabled: true,
      readOnly: true
    });
    const days = getSlot(container, 'calendar-days');
    expect(days).toHaveAttribute('data-disabled', 'true');
    expect(days).toHaveAttribute('data-readonly', 'true');
  });

  it('marks the day view busy while its grid is loading', () => {
    const { container } = renderCalendar(
      <Calendar.Days>
        <Calendar.Header />
        <Calendar.Grid loading />
      </Calendar.Days>
    );
    expect(getSlot(container, 'calendar-days')).toHaveAttribute(
      'data-busy',
      'true'
    );
    expect(getSlot(container, 'calendar-skeleton')).toHaveAttribute(
      'data-visible',
      'true'
    );
    expect(getSlot(container, 'calendar-table')).toHaveAttribute(
      'aria-busy',
      'true'
    );
  });

  it('carries the scale on the root and on every cell, and nowhere between', () => {
    const { container } = renderCalendar();
    expect(getSlot(container, 'calendar')).toHaveAttribute('data-scale', 'day');
    expect(getSlot(container, 'calendar-caption')).not.toHaveAttribute(
      'data-scale'
    );
    for (const cell of getAllSlots(container, 'calendar-day')) {
      expect(cell).toHaveAttribute('data-scale', 'day');
    }
  });

  it('marks the selected cell, and only that one', () => {
    const { container } = renderCalendar(undefined, {
      defaultValue: new Date(2026, 7, 20)
    });
    const selected = getAllSlots(container, 'calendar-day').filter(cell =>
      cell.hasAttribute('data-selected')
    );
    expect(selected).toHaveLength(1);
    expect(selected[0]).toHaveTextContent('20');
  });

  it("marks today's cell", () => {
    const { container } = renderCalendar();
    const today = getAllSlots(container, 'calendar-day').filter(cell =>
      cell.hasAttribute('data-today')
    );
    expect(today).toHaveLength(1);
    expect(today[0]).toHaveTextContent('15');
  });

  it('marks unavailable cells and leaves the rest unmarked', () => {
    const { container } = renderCalendar(undefined, {
      minDate: new Date(2026, 7, 10)
    });
    const cells = getAllSlots(container, 'calendar-day');
    const unavailable = cells.filter(cell =>
      cell.hasAttribute('data-unavailable')
    );
    expect(unavailable.length).toBeGreaterThan(0);
    expect(unavailable.length).toBeLessThan(cells.length);
    expect(unavailable[unavailable.length - 1]).toHaveTextContent('9');
  });

  it('renders no outside days by default', () => {
    const { container } = renderCalendar();
    /* August 2026 starts on a Saturday, so outside days would show five. */
    const outside = getAllSlots(container, 'calendar-day').filter(cell =>
      cell.hasAttribute('data-outside')
    );
    expect(outside).toHaveLength(0);
  });

  it('marks the days that fall outside the displayed month when asked', () => {
    const { container } = renderCalendar(
      <Calendar.Days>
        <Calendar.Grid showOutsideDays />
      </Calendar.Days>
    );
    const outside = getAllSlots(container, 'calendar-day').filter(cell =>
      cell.hasAttribute('data-outside')
    );
    expect(outside.length).toBeGreaterThan(0);
    expect(outside[0]).not.toHaveAttribute('data-today');
  });

  it('marks the focused cell as the draft until it is committed', () => {
    const { container } = renderCalendar();
    expect(
      getAllSlots(container, 'calendar-day').filter(cell =>
        cell.hasAttribute('data-draft')
      )
    ).toHaveLength(0);

    const day = screen.getByText('20').closest('button');
    fireEvent.focus(day as HTMLButtonElement);

    const drafted = getAllSlots(container, 'calendar-day').filter(cell =>
      cell.hasAttribute('data-draft')
    );
    expect(drafted).toHaveLength(1);
    expect(drafted[0]).toHaveTextContent('20');
    expect(drafted[0]).not.toHaveAttribute('data-selected');
  });

  it('marks the active row in each caption column', () => {
    const { container } = renderCalendar(
      <Calendar.Days>
        <Calendar.Header>
          <Calendar.Caption dropdown />
        </Calendar.Header>
      </Calendar.Days>
    );
    const caption = getSlot(container, 'calendar-caption');
    expect(caption).toHaveAttribute('data-dropdown', 'true');
    fireEvent.pointerDown(caption as HTMLElement);
    fireEvent.click(caption as HTMLElement);

    const activeMonth = getAllSlots(
      document.body,
      'calendar-caption-month'
    ).filter(option => option.hasAttribute('data-active'));
    expect(activeMonth).toHaveLength(1);
    expect(activeMonth[0]).toHaveTextContent('Aug');

    const activeYear = getAllSlots(
      document.body,
      'calendar-caption-year'
    ).filter(option => option.hasAttribute('data-active'));
    expect(activeYear).toHaveLength(1);
    expect(activeYear[0]).toHaveTextContent('2026');
  });
});
