import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectSlots, getSlot } from '~/test-utils/data-slots';
import { CalendarPreview } from '../calendar-preview';
import { dayKey } from '../date-adapter';

const MONTH = new Date(2024, 3, 1);
const lastArg = (fn: { mock: { calls: unknown[][] } }) =>
  fn.mock.calls[fn.mock.calls.length - 1]?.[0];

describe('CalendarPreview.Input', () => {
  it('renders its slot without clobbering Input own', () => {
    const { container } = render(
      <CalendarPreview defaultMonth={MONTH}>
        <CalendarPreview.Input />
      </CalendarPreview>
    );
    expect(getSlot(container, 'calendar-preview-input')).not.toBeNull();
    expect(container.querySelectorAll('[data-slot="input"]')).toHaveLength(1);
  });

  it('shows the committed value and commits typed text', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <CalendarPreview
        defaultMonth={MONTH}
        defaultValue={new Date(2024, 3, 17)}
        onValueChange={onValueChange}
      >
        <CalendarPreview.Input />
      </CalendarPreview>
    );

    const field = screen.getByRole('textbox');
    expect(field).toHaveValue('17 Apr 2024');

    await user.clear(field);
    await user.type(field, '20 Apr 2024{Enter}');
    expect(dayKey(lastArg(onValueChange) as Date)).toBe('2024-04-20');
  });

  it('reports validity and never throws with a timeZone set', async () => {
    const user = userEvent.setup();
    const onValidityChange = vi.fn();
    render(
      <CalendarPreview
        defaultMonth={MONTH}
        timeZone='UTC'
        onValidityChange={onValidityChange}
      >
        <CalendarPreview.Input />
      </CalendarPreview>
    );

    await user.type(screen.getByRole('textbox'), 'rubbish{Enter}');
    expect(onValidityChange).toHaveBeenLastCalledWith({
      valid: false,
      reason: 'unparseable'
    });
  });

  it('clears on empty, and reverts on Escape', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <CalendarPreview
        defaultMonth={MONTH}
        defaultValue={new Date(2024, 3, 17)}
        onValueChange={onValueChange}
      >
        <CalendarPreview.Input />
      </CalendarPreview>
    );

    const field = screen.getByRole('textbox');
    await user.clear(field);
    await user.type(field, 'x');
    await user.keyboard('{Escape}');
    expect(field).toHaveValue('17 Apr 2024');

    await user.clear(field);
    await user.keyboard('{Enter}');
    expect(lastArg(onValueChange)).toBeNull();
  });

  it('throws when used with selection="range"', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() =>
      render(
        <CalendarPreview selection='range'>
          <CalendarPreview.Input />
        </CalendarPreview>
      )
    ).toThrow('CalendarPreview.RangeInput for ranges');
    spy.mockRestore();
  });
});

describe('CalendarPreview.Nav', () => {
  it('renders caption and both buttons, and no Select', () => {
    const { container } = render(
      <CalendarPreview defaultMonth={MONTH}>
        <CalendarPreview.Nav />
        <CalendarPreview.Grid />
      </CalendarPreview>
    );
    expectSlots(container, [
      'calendar-preview-nav',
      'calendar-preview-nav-caption',
      'calendar-preview-nav-previous',
      'calendar-preview-nav-next'
    ]);
    expect(container.querySelector('select')).toBeNull();
    expect(getSlot(container, 'select-trigger')).toBeNull();
    expect(
      getSlot(container, 'calendar-preview-nav-caption')
    ).toHaveTextContent('April 2024');
  });

  it('steps the month and reports it', async () => {
    const user = userEvent.setup();
    const onMonthChange = vi.fn();
    render(
      <CalendarPreview defaultMonth={MONTH} onMonthChange={onMonthChange}>
        <CalendarPreview.Nav />
        <CalendarPreview.Grid />
      </CalendarPreview>
    );

    await user.click(screen.getByLabelText('Next month'));
    expect(dayKey(lastArg(onMonthChange) as Date)).toBe('2024-05-01');
    expect(screen.getByText('May 2024')).toBeInTheDocument();

    await user.click(screen.getByLabelText('Previous month'));
    await user.click(screen.getByLabelText('Previous month'));
    expect(dayKey(lastArg(onMonthChange) as Date)).toBe('2024-03-01');
  });

  it('offers a step whenever the target month holds any selectable day', () => {
    // minDate mid-March: stepping back from April must stay available.
    render(
      <CalendarPreview defaultMonth={MONTH} minDate={new Date(2024, 2, 15)}>
        <CalendarPreview.Nav />
      </CalendarPreview>
    );
    expect(screen.getByLabelText('Previous month')).not.toBeDisabled();
  });

  it('disables a step when the target month is wholly out of range', () => {
    render(
      <CalendarPreview defaultMonth={MONTH} minDate={new Date(2024, 3, 1)}>
        <CalendarPreview.Nav />
      </CalendarPreview>
    );
    expect(screen.getByLabelText('Previous month')).toBeDisabled();
    expect(screen.getByLabelText('Next month')).not.toBeDisabled();
  });

  it('disables both steps when the picker is disabled', () => {
    render(
      <CalendarPreview defaultMonth={MONTH} disabled>
        <CalendarPreview.Nav />
      </CalendarPreview>
    );
    expect(screen.getByLabelText('Previous month')).toBeDisabled();
    expect(screen.getByLabelText('Next month')).toBeDisabled();
  });

  it('drives the grid it sits beside', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <CalendarPreview defaultMonth={MONTH}>
        <CalendarPreview.Nav />
        <CalendarPreview.Grid />
      </CalendarPreview>
    );

    await user.click(screen.getByLabelText('Next month'));
    expect(container.querySelector('[data-day="2024-05-15"]')).not.toBeNull();
    expect(container.querySelector('[data-day="2024-04-15"]')).toBeNull();
  });
});
