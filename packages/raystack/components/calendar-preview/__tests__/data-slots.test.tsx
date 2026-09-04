import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { expectSlots, getAllSlots, getSlot } from '~/test-utils/data-slots';
import { CalendarPreview } from '../calendar-preview';

const TODAY = new Date(2026, 7, 15);
const AUGUST = new Date(2026, 7, 1);

function renderCalendar(ui?: React.ReactNode, props = {}) {
  return render(
    <CalendarPreview today={TODAY} defaultMonth={AUGUST} {...props}>
      {ui ?? <CalendarPreview.Days />}
    </CalendarPreview>
  );
}

describe('CalendarPreview data-slot contract', () => {
  it('exposes a slot for every element the default day view renders', () => {
    const { container } = renderCalendar();
    expectSlots(container, [
      'calendar-preview',
      'calendar-preview-days',
      'calendar-preview-header',
      'calendar-preview-prev-month',
      'calendar-preview-caption',
      'calendar-preview-next-month',
      'calendar-preview-grid',
      'calendar-preview-weeks',
      'calendar-preview-table',
      'calendar-preview-skeleton',
      'calendar-preview-weekday',
      'calendar-preview-day',
      'calendar-preview-day-number'
    ]);
  });

  it('renders exactly the documented slots, and no others', () => {
    const { container } = renderCalendar();
    const rendered = new Set(
      Array.from(container.querySelectorAll('[data-slot]'))
        .map(element => element.getAttribute('data-slot') ?? '')
        .filter(name => name.startsWith('calendar-preview'))
    );
    /* Fails on a typo or an undocumented addition as loudly as on a rename,
       which is the point: slot names are semver-covered public API. */
    expect([...rendered].sort()).toEqual(
      [
        'calendar-preview',
        'calendar-preview-day',
        'calendar-preview-day-number',
        'calendar-preview-days',
        'calendar-preview-caption',
        'calendar-preview-grid',
        'calendar-preview-header',
        'calendar-preview-next-month',
        'calendar-preview-prev-month',
        'calendar-preview-skeleton',
        'calendar-preview-table',
        'calendar-preview-weekday',
        'calendar-preview-weeks'
      ].sort()
    );
  });

  it('exposes a slot for every element the two-month day view renders', () => {
    const { container } = renderCalendar(
      <CalendarPreview.Days numberOfMonths={2} />
    );
    expectSlots(container, [
      'calendar-preview',
      'calendar-preview-days',
      'calendar-preview-month-header',
      'calendar-preview-prev-month',
      'calendar-preview-caption',
      'calendar-preview-next-month',
      'calendar-preview-grid',
      'calendar-preview-table',
      'calendar-preview-weekday',
      'calendar-preview-day'
    ]);
    /* The single-month header is the one slot this layout must not render —
       each month captions itself instead. */
    expect(getSlot(container, 'calendar-preview-header')).toBeNull();
  });

  it('exposes the reset slot only when there is something to restore', () => {
    const { container } = renderCalendar(undefined, {
      defaultDate: new Date(2026, 7, 10),
      defaultValue: new Date(2026, 7, 20)
    });
    expect(getSlot(container, 'calendar-preview-reset')).not.toBeNull();
  });

  it('exposes the footer slots when a footer is mounted', () => {
    const { container } = renderCalendar(
      <>
        <CalendarPreview.Days />
        <CalendarPreview.Footer>Dates are inclusive</CalendarPreview.Footer>
      </>
    );
    expectSlots(container, [
      'calendar-preview-footer',
      'calendar-preview-footer-text'
    ]);
  });

  it('exposes the day-info slot only where dateInfo returns something', () => {
    const { container } = renderCalendar(
      <CalendarPreview.Days>
        <CalendarPreview.Grid
          dateInfo={date => (date.getDate() === 15 ? 'INFO' : null)}
        />
      </CalendarPreview.Days>
    );
    expect(getAllSlots(container, 'calendar-preview-day-info')).toHaveLength(1);
  });

  it('omits the day-info slot when no dateInfo is given', () => {
    const { container } = renderCalendar();
    expect(getSlot(container, 'calendar-preview-day-info')).toBeNull();
  });

  it('exposes the tooltip slot on hover when tooltips are enabled', async () => {
    renderCalendar(
      <CalendarPreview.Days>
        <CalendarPreview.Grid
          showTooltip
          tooltipMessages={date => (date.getDate() === 15 ? 'Fifteenth' : null)}
        />
      </CalendarPreview.Days>
    );
    const user = userEvent.setup();
    const day = screen.getByText('15').closest('button');
    await user.hover(day as HTMLButtonElement);
    expect(await screen.findByText('Fifteenth')).toBeInTheDocument();
    expect(
      getSlot(document.body, 'calendar-preview-day-tooltip')
    ).not.toBeNull();
  });

  it('exposes the caption scroller slots once it is opened', () => {
    const { container } = renderCalendar(
      <CalendarPreview.Days>
        <CalendarPreview.Header>
          <CalendarPreview.Caption dropdown />
        </CalendarPreview.Header>
      </CalendarPreview.Days>
    );
    const caption = getSlot(container, 'calendar-preview-caption');
    fireEvent.pointerDown(caption as HTMLElement);
    fireEvent.click(caption as HTMLElement);
    expectSlots(document.body, [
      'calendar-preview-caption-positioner',
      'calendar-preview-caption-popup',
      'calendar-preview-caption-months',
      'calendar-preview-caption-month',
      'calendar-preview-caption-years',
      'calendar-preview-caption-year'
    ]);
  });
});

describe('CalendarPreview state attributes', () => {
  it('marks the day view with its scale and its inert states', () => {
    const { container } = renderCalendar(undefined, {
      disabled: true,
      readOnly: true
    });
    const days = getSlot(container, 'calendar-preview-days');
    expect(days).toHaveAttribute('data-scale', 'day');
    expect(days).toHaveAttribute('data-disabled', 'true');
    expect(days).toHaveAttribute('data-readonly', 'true');
  });

  it('marks the day view busy while its grid is loading', () => {
    const { container } = renderCalendar(
      <CalendarPreview.Days>
        <CalendarPreview.Header />
        <CalendarPreview.Grid loading />
      </CalendarPreview.Days>
    );
    expect(getSlot(container, 'calendar-preview-days')).toHaveAttribute(
      'data-busy',
      'true'
    );
    expect(getSlot(container, 'calendar-preview-skeleton')).toHaveAttribute(
      'data-visible',
      'true'
    );
    expect(getSlot(container, 'calendar-preview-table')).toHaveAttribute(
      'aria-busy',
      'true'
    );
  });

  it('carries the scale on the caption and on every cell', () => {
    const { container } = renderCalendar();
    expect(getSlot(container, 'calendar-preview-caption')).toHaveAttribute(
      'data-scale',
      'day'
    );
    for (const cell of getAllSlots(container, 'calendar-preview-day')) {
      expect(cell).toHaveAttribute('data-scale', 'day');
    }
  });

  it('marks the selected cell, and only that one', () => {
    const { container } = renderCalendar(undefined, {
      defaultValue: new Date(2026, 7, 20)
    });
    const selected = getAllSlots(container, 'calendar-preview-day').filter(
      cell => cell.hasAttribute('data-selected')
    );
    expect(selected).toHaveLength(1);
    expect(selected[0]).toHaveTextContent('20');
  });

  it("marks today's cell", () => {
    const { container } = renderCalendar();
    const today = getAllSlots(container, 'calendar-preview-day').filter(cell =>
      cell.hasAttribute('data-today')
    );
    expect(today).toHaveLength(1);
    expect(today[0]).toHaveTextContent('15');
  });

  it('marks unavailable cells and leaves the rest unmarked', () => {
    const { container } = renderCalendar(undefined, {
      minDate: new Date(2026, 7, 10)
    });
    const cells = getAllSlots(container, 'calendar-preview-day');
    const unavailable = cells.filter(cell =>
      cell.hasAttribute('data-unavailable')
    );
    expect(unavailable.length).toBeGreaterThan(0);
    expect(unavailable.length).toBeLessThan(cells.length);
    expect(unavailable[unavailable.length - 1]).toHaveTextContent('9');
  });

  it('renders no outside days by default', () => {
    const { container } = renderCalendar();
    /* August 2026 starts on a Saturday, so a grid that showed outside days
       would open with five of them. Reference A leaves those cells blank. */
    const outside = getAllSlots(container, 'calendar-preview-day').filter(
      cell => cell.hasAttribute('data-outside')
    );
    expect(outside).toHaveLength(0);
  });

  it('marks the days that fall outside the displayed month when asked', () => {
    const { container } = renderCalendar(
      <CalendarPreview.Days>
        <CalendarPreview.Grid showOutsideDays />
      </CalendarPreview.Days>
    );
    const outside = getAllSlots(container, 'calendar-preview-day').filter(
      cell => cell.hasAttribute('data-outside')
    );
    expect(outside.length).toBeGreaterThan(0);
    expect(outside[0]).not.toHaveAttribute('data-today');
  });

  it('marks the focused cell as the draft until it is committed', () => {
    const { container } = renderCalendar();
    expect(
      getAllSlots(container, 'calendar-preview-day').filter(cell =>
        cell.hasAttribute('data-draft')
      )
    ).toHaveLength(0);

    const day = screen.getByText('20').closest('button');
    fireEvent.focus(day as HTMLButtonElement);

    const drafted = getAllSlots(container, 'calendar-preview-day').filter(
      cell => cell.hasAttribute('data-draft')
    );
    expect(drafted).toHaveLength(1);
    expect(drafted[0]).toHaveTextContent('20');
    expect(drafted[0]).not.toHaveAttribute('data-selected');
  });

  it('marks the active row in each caption column', () => {
    const { container } = renderCalendar(
      <CalendarPreview.Days>
        <CalendarPreview.Header>
          <CalendarPreview.Caption dropdown />
        </CalendarPreview.Header>
      </CalendarPreview.Days>
    );
    const caption = getSlot(container, 'calendar-preview-caption');
    expect(caption).toHaveAttribute('data-dropdown', 'true');
    fireEvent.pointerDown(caption as HTMLElement);
    fireEvent.click(caption as HTMLElement);

    const activeMonth = getAllSlots(
      document.body,
      'calendar-preview-caption-month'
    ).filter(option => option.hasAttribute('data-active'));
    expect(activeMonth).toHaveLength(1);
    expect(activeMonth[0]).toHaveTextContent('Aug');

    const activeYear = getAllSlots(
      document.body,
      'calendar-preview-caption-year'
    ).filter(option => option.hasAttribute('data-active'));
    expect(activeYear).toHaveLength(1);
    expect(activeYear[0]).toHaveTextContent('2026');
  });
});
