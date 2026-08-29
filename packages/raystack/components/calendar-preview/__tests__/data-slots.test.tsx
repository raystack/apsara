import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectSlots, getAllSlots, getSlot } from '~/test-utils/data-slots';
import { CalendarPreview } from '../calendar-preview';

const MONTH = new Date(2024, 3, 1);

describe('CalendarPreview data-slot contract', () => {
  it('exposes grid slots when composed inline, with no popover', () => {
    const { container } = render(
      <CalendarPreview defaultMonth={MONTH}>
        <CalendarPreview.Grid />
      </CalendarPreview>
    );

    expectSlots(container, [
      'calendar-preview-grid',
      'calendar-preview-weeks',
      'calendar-preview-table',
      'calendar-preview-day',
      'calendar-preview-day-number'
    ]);
    // Nothing portals when there is no `.Content`.
    expect(getSlot(document.body, 'calendar-preview-content')).toBeNull();
  });

  it('exposes trigger, positioner and content slots when open', () => {
    render(
      <CalendarPreview defaultMonth={MONTH} defaultOpen>
        <CalendarPreview.Trigger>Pick a date</CalendarPreview.Trigger>
        <CalendarPreview.Content>
          <CalendarPreview.Grid />
        </CalendarPreview.Content>
      </CalendarPreview>
    );

    // Portaled parts are asserted against the document, not the container.
    expectSlots(document.body, [
      'calendar-preview-trigger',
      'calendar-preview-positioner',
      'calendar-preview-content',
      'calendar-preview-grid'
    ]);
  });

  it('omits the content slot while closed', () => {
    render(
      <CalendarPreview defaultMonth={MONTH}>
        <CalendarPreview.Trigger>Pick a date</CalendarPreview.Trigger>
        <CalendarPreview.Content>
          <CalendarPreview.Grid />
        </CalendarPreview.Content>
      </CalendarPreview>
    );

    expect(getSlot(document.body, 'calendar-preview-trigger')).not.toBeNull();
    expect(getSlot(document.body, 'calendar-preview-content')).toBeNull();
  });

  it('renders one day slot per day button', () => {
    const { container } = render(
      <CalendarPreview defaultMonth={MONTH}>
        <CalendarPreview.Grid />
      </CalendarPreview>
    );

    // April 2024 has 30 days and outside days are off by default.
    expect(getAllSlots(container, 'calendar-preview-day')).toHaveLength(30);
    expect(screen.getByText('April 2024')).toBeInTheDocument();
  });

  it('renders two months of day slots when months is 2', () => {
    const { container } = render(
      <CalendarPreview defaultMonth={MONTH}>
        <CalendarPreview.Grid months={2} />
      </CalendarPreview>
    );

    // April (30) + May (31).
    expect(getAllSlots(container, 'calendar-preview-day')).toHaveLength(61);
    expect(getAllSlots(container, 'calendar-preview-table')).toHaveLength(2);
  });

  it('never mounts a Select — the caption is a plain label', () => {
    const { container } = render(
      <CalendarPreview defaultMonth={MONTH}>
        <CalendarPreview.Grid />
      </CalendarPreview>
    );

    expect(getSlot(container, 'select-trigger')).toBeNull();
    expect(getSlot(container, 'calendar-preview-nav-month')).toBeNull();
    expect(container.querySelector('select')).toBeNull();
  });
});
