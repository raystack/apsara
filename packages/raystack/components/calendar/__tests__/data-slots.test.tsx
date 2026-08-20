import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectSlots, getSlot } from '~/test-utils/data-slots';
import { Calendar } from '../calendar';
import { DatePicker } from '../date-picker';
import { RangePicker } from '../range-picker';

// Mock scrollIntoView for test environment (calendar dropdowns render Selects)
Object.defineProperty(Element.prototype, 'scrollIntoView', {
  value: vi.fn(),
  writable: true
});

describe('Calendar data-slot contract', () => {
  it('exposes slots for the default calendar surface', () => {
    const { container } = render(<Calendar />);
    expectSlots(container, [
      'calendar',
      'calendar-nav-previous',
      'calendar-nav-next',
      'calendar-month-grid',
      'calendar-grid-table',
      'calendar-grid-skeleton',
      'calendar-day',
      'calendar-day-number'
    ]);
  });

  it('exposes the dropdown slot with captionLayout=dropdown', () => {
    const { container } = render(<Calendar captionLayout='dropdown' />);
    expect(getSlot(container, 'calendar-dropdown')).not.toBeNull();
  });

  it('exposes the dropdown content slot when a dropdown is opened', () => {
    render(<Calendar captionLayout='dropdown' />);
    const dropdown = screen.getAllByRole('combobox')[0];
    fireEvent.click(dropdown);
    expect(getSlot(document.body, 'calendar-dropdown-content')).not.toBeNull();
  });

  it('exposes the day-info slot only when dateInfo resolves for a day', () => {
    const { container } = render(
      <Calendar
        month={new Date(2024, 0, 1)}
        dateInfo={{ '15-01-2024': 'INFO-15' }}
      />
    );
    expect(getSlot(container, 'calendar-day-info')).not.toBeNull();
  });

  it('omits the day-info slot when no dateInfo is provided', () => {
    const { container } = render(<Calendar />);
    expect(getSlot(container, 'calendar-day-info')).toBeNull();
  });

  it('exposes the day tooltip slot on hover when enabled', async () => {
    const user = userEvent.setup();
    render(
      <Calendar
        month={new Date(2024, 0, 1)}
        showTooltip
        tooltipMessages={{ '15-01-2024': 'Test message' }}
      />
    );
    const dayNumber = screen.getByText('15');
    const dayButton = dayNumber.closest('button');
    expect(dayButton).not.toBeNull();
    await user.hover(dayButton as HTMLButtonElement);
    expect(await screen.findByText('Test message')).toBeInTheDocument();
    expect(getSlot(document.body, 'calendar-day-tooltip')).not.toBeNull();
  });
});

describe('DatePicker data-slot contract', () => {
  it('exposes the trigger and input slots when closed', () => {
    const { container } = render(<DatePicker />);
    expectSlots(container, ['date-picker-trigger', 'date-picker-input']);
  });

  it('exposes the content slots and nested calendar slots when open', () => {
    render(<DatePicker />);
    fireEvent.focus(screen.getByPlaceholderText('Select date'));
    expectSlots(document.body, [
      'date-picker-positioner',
      'date-picker-content',
      'calendar'
    ]);
  });
});

describe('RangePicker data-slot contract', () => {
  it('exposes the trigger, group and input slots when closed', () => {
    const { container } = render(<RangePicker />);
    expectSlots(container, [
      'range-picker-trigger',
      'range-picker-trigger-group',
      'range-picker-start-input',
      'range-picker-end-input'
    ]);
  });

  it('exposes the content slot and nested calendar slots when open', () => {
    render(<RangePicker />);
    fireEvent.click(screen.getByPlaceholderText('Select start date'));
    expectSlots(document.body, [
      'range-picker-positioner',
      'range-picker-content',
      'calendar'
    ]);
  });

  it('exposes the footer slot only when a footer is provided', () => {
    render(<RangePicker footer={<span>Footer</span>} />);
    fireEvent.click(screen.getByPlaceholderText('Select start date'));
    expect(getSlot(document.body, 'range-picker-footer')).not.toBeNull();
  });

  it('omits the footer slot when no footer is provided', () => {
    render(<RangePicker />);
    fireEvent.click(screen.getByPlaceholderText('Select start date'));
    expect(getSlot(document.body, 'range-picker-footer')).toBeNull();
  });
});
