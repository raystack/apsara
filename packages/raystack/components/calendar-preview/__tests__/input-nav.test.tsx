import { render, screen, waitFor } from '@testing-library/react';
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

describe('CalendarPreview.Nav revert button', () => {
  const withDefault = (props: Record<string, unknown> = {}) =>
    render(
      <CalendarPreview
        defaultMonth={MONTH}
        defaultValue={new Date(2024, 3, 10)}
        {...props}
      >
        <CalendarPreview.Nav />
        <CalendarPreview.Grid />
      </CalendarPreview>
    );

  it('is absent while the value still equals the default', () => {
    const { container } = withDefault();
    expect(getSlot(container, 'calendar-preview-nav-undo')).toBeNull();
  });

  it('is absent when no default was given at all', () => {
    const { container } = render(
      <CalendarPreview defaultMonth={MONTH} value={new Date(2024, 3, 17)}>
        <CalendarPreview.Nav />
      </CalendarPreview>
    );
    expect(getSlot(container, 'calendar-preview-nav-undo')).toBeNull();
  });

  it('appears once the selection differs from the default', async () => {
    const user = userEvent.setup();
    const { container } = withDefault();
    expect(getSlot(container, 'calendar-preview-nav-undo')).toBeNull();

    await user.click(
      container.querySelector('[data-day="2024-04-17"] button') as HTMLElement
    );
    expect(getSlot(container, 'calendar-preview-nav-undo')).not.toBeNull();
  });

  it('restores the default value and then hides itself again', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { container } = withDefault({ onValueChange });

    await user.click(
      container.querySelector('[data-day="2024-04-17"] button') as HTMLElement
    );
    await user.click(screen.getByLabelText('Reset to default date'));

    expect(dayKey(lastArg(onValueChange) as Date)).toBe('2024-04-10');
    expect(getSlot(container, 'calendar-preview-nav-undo')).toBeNull();
  });

  it('counts a time-of-day change as differing from the default', () => {
    const { container } = render(
      <CalendarPreview
        defaultMonth={MONTH}
        defaultValue={new Date(2024, 3, 10, 9, 0)}
        value={new Date(2024, 3, 10, 17, 30)}
      >
        <CalendarPreview.Nav />
      </CalendarPreview>
    );
    expect(getSlot(container, 'calendar-preview-nav-undo')).not.toBeNull();
  });

  it('works for a range default too', () => {
    const { container } = render(
      <CalendarPreview
        selection='range'
        defaultMonth={MONTH}
        defaultValue={{ from: new Date(2024, 3, 1), to: new Date(2024, 3, 5) }}
        value={{ from: new Date(2024, 3, 1), to: new Date(2024, 3, 9) }}
      >
        <CalendarPreview.Nav />
      </CalendarPreview>
    );
    expect(getSlot(container, 'calendar-preview-nav-undo')).not.toBeNull();
  });

  it('is disabled rather than active when the picker is readOnly', async () => {
    const user = userEvent.setup();
    const { container } = withDefault({ readOnly: true });
    // readOnly still lets the grid render, so reach the differing state via a
    // controlled value instead.
    expect(getSlot(container, 'calendar-preview-nav-undo')).toBeNull();

    const { container: c2 } = render(
      <CalendarPreview
        defaultMonth={MONTH}
        defaultValue={new Date(2024, 3, 10)}
        value={new Date(2024, 3, 17)}
        readOnly
      >
        <CalendarPreview.Nav />
      </CalendarPreview>
    );
    expect(getSlot(c2, 'calendar-preview-nav-undo')).toBeDisabled();
    await user.click(screen.getAllByLabelText('Reset to default date')[0]);
  });
});

describe('consumer handlers compose rather than replace', () => {
  it('.Input still commits when a consumer passes onKeyDown', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const consumerKeyDown = vi.fn();
    render(
      <CalendarPreview
        defaultMonth={new Date(2024, 3, 1)}
        onValueChange={onValueChange}
      >
        <CalendarPreview.Input onKeyDown={consumerKeyDown} />
      </CalendarPreview>
    );

    await user.type(screen.getByRole('textbox'), '17 Apr 2024{Enter}');
    expect(
      dayKey(
        onValueChange.mock.calls[onValueChange.mock.calls.length - 1][0] as Date
      )
    ).toBe('2024-04-17');
    expect(consumerKeyDown).toHaveBeenCalled();
  });

  it('.Input still commits when a consumer passes onBlur', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const onBlur = vi.fn();
    render(
      <CalendarPreview
        defaultMonth={new Date(2024, 3, 1)}
        onValueChange={onValueChange}
      >
        <CalendarPreview.Input onBlur={onBlur} />
      </CalendarPreview>
    );

    await user.type(screen.getByRole('textbox'), '17 Apr 2024');
    await user.tab();
    expect(
      dayKey(
        onValueChange.mock.calls[onValueChange.mock.calls.length - 1][0] as Date
      )
    ).toBe('2024-04-17');
    expect(onBlur).toHaveBeenCalled();
  });
});

/*
 * Moved here from `audit-fixed.test.tsx`, which collected findings by the
 * number they were reported under. Each assertion is unchanged; only its home
 * is, so a failure lands beside the behaviour it describes.
 */
/*
 * Regressions that arrived from review passes rather than from the spec.
 * Each assertion sits with the behaviour it guards; which pass found it is
 * history, not structure.
 */
describe('regressions', () => {
  it('a trigger holding a typed field claims no button semantics', async () => {
    const { container } = render(
      <CalendarPreview>
        <CalendarPreview.Trigger>
          <CalendarPreview.Input />
        </CalendarPreview.Trigger>
        <CalendarPreview.Content>
          <CalendarPreview.Grid />
        </CalendarPreview.Content>
      </CalendarPreview>
    );

    const trigger = getSlot(
      container,
      'calendar-preview-trigger'
    ) as HTMLElement;
    // In ARIA a button's children are presentational, so the field inside was
    // at risk of never being announced as editable; the tab stop it added sat
    // in front of the input doing nothing a keyboard user wants.
    await waitFor(() => expect(trigger).not.toHaveAttribute('role'));
    expect(trigger).toHaveAttribute('tabindex', '-1');
    expect(trigger.querySelector('input')).not.toBeNull();
  });

  it('a plain trigger keeps the button semantics it should have', () => {
    const { container } = render(
      <CalendarPreview>
        <CalendarPreview.Trigger>Pick a date</CalendarPreview.Trigger>
      </CalendarPreview>
    );
    const trigger = getSlot(
      container,
      'calendar-preview-trigger'
    ) as HTMLElement;
    expect(trigger).toHaveAttribute('role', 'button');
    expect(trigger).toHaveAttribute('tabindex', '0');
  });

  it('clicking the field a second time does not close the calendar', async () => {
    const user = userEvent.setup();
    render(
      <CalendarPreview defaultMonth={MONTH}>
        <CalendarPreview.Trigger>
          <CalendarPreview.Input />
        </CalendarPreview.Trigger>
        <CalendarPreview.Content>
          <CalendarPreview.Grid />
        </CalendarPreview.Content>
      </CalendarPreview>
    );

    const field = screen.getByRole('textbox');
    await user.click(field);
    expect(await screen.findByRole('grid')).toBeInTheDocument();

    // Repositioning the caret is an ordinary thing to do mid-edit.
    await user.click(field);
    expect(screen.queryByRole('grid')).toBeInTheDocument();
  });

  it('clicking the trigger outside the field still toggles', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <CalendarPreview defaultMonth={MONTH}>
        <CalendarPreview.Trigger>
          <CalendarPreview.Input />
        </CalendarPreview.Trigger>
        <CalendarPreview.Content>
          <CalendarPreview.Grid />
        </CalendarPreview.Content>
      </CalendarPreview>
    );

    const trigger = getSlot(
      container,
      'calendar-preview-trigger'
    ) as HTMLElement;
    await user.click(trigger);
    expect(await screen.findByRole('grid')).toBeInTheDocument();
    await user.click(trigger);
    await waitFor(() =>
      expect(screen.queryByRole('grid')).not.toBeInTheDocument()
    );
  });

  it('captions a two-month grid as a range', () => {
    const { container } = render(
      <CalendarPreview defaultMonth={new Date(2024, 3, 1)}>
        <CalendarPreview.Nav months={2} />
        <CalendarPreview.Grid months={2} />
      </CalendarPreview>
    );
    expect(
      getSlot(container, 'calendar-preview-nav-caption')
    ).toHaveTextContent('April 2024 – May 2024');
    expect(
      container.querySelectorAll('[data-slot="calendar-preview-table"]')
    ).toHaveLength(2);
  });
});
