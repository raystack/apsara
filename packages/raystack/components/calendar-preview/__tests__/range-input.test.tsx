import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

/** `.at()` is outside the package's TS lib target. */
const lastArg = (fn: { mock: { calls: unknown[][] } }) =>
  fn.mock.calls[fn.mock.calls.length - 1]?.[0];

import { getSlot } from '~/test-utils/data-slots';
import { CalendarPreview } from '../calendar-preview';
import type { DateRangeValue } from '../calendar-preview-context';
import { dayKey } from '../date-adapter';

const MONTH = new Date(2024, 3, 1);

const setup = (props: Record<string, unknown> = {}) =>
  render(
    <CalendarPreview selection='range' defaultMonth={MONTH} {...props}>
      <CalendarPreview.RangeInput />
      <CalendarPreview.Grid />
    </CalendarPreview>
  );

const start = () => screen.getByLabelText('Start date');
const end = () => screen.getByLabelText('End date');

const dayButton = (container: HTMLElement, iso: string) =>
  container.querySelector(`[data-day="${iso}"] button`) as HTMLButtonElement;

describe('CalendarPreview.RangeInput', () => {
  it('renders both field slots', () => {
    const { container } = setup();
    expect(getSlot(container, 'calendar-preview-range-inputs')).not.toBeNull();
    expect(getSlot(container, 'calendar-preview-input-start')).not.toBeNull();
    expect(getSlot(container, 'calendar-preview-input-end')).not.toBeNull();
  });

  it('shows the committed value in the canonical format', () => {
    setup({
      defaultValue: { from: new Date(2024, 3, 17), to: new Date(2024, 3, 20) }
    });
    expect(start()).toHaveValue('17 Apr 2024');
    expect(end()).toHaveValue('20 Apr 2024');
  });

  it('commits typed text on Enter and reports it', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    setup({ onValueChange });

    await user.click(start());
    await user.type(start(), '17 Apr 2024{Enter}');

    const next = lastArg(onValueChange) as DateRangeValue;
    expect(dayKey(next.from as Date)).toBe('2024-04-17');
  });

  it('commits on blur as well as Enter', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    setup({ onValueChange });

    await user.click(start());
    await user.type(start(), '17 Apr 2024');
    await user.tab();

    const next = lastArg(onValueChange) as DateRangeValue;
    expect(dayKey(next.from as Date)).toBe('2024-04-17');
  });

  it('advances focus to the end field on Enter, not while typing', async () => {
    const user = userEvent.setup();
    setup();

    await user.click(start());
    await user.type(start(), '17 Apr 2024');
    expect(start()).toHaveFocus();

    await user.keyboard('{Enter}');
    expect(end()).toHaveFocus();
  });

  it('reports unparseable text without changing the value', async () => {
    const user = userEvent.setup();
    const onValidityChange = vi.fn();
    const onValueChange = vi.fn();
    setup({ onValidityChange, onValueChange });

    await user.click(start());
    await user.type(start(), 'not a date{Enter}');

    expect(onValidityChange).toHaveBeenLastCalledWith({
      valid: false,
      reason: 'unparseable'
    });
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('reports an out-of-bounds date without changing the value', async () => {
    const user = userEvent.setup();
    const onValidityChange = vi.fn();
    const onValueChange = vi.fn();
    setup({
      minDate: new Date(2024, 3, 10),
      onValidityChange,
      onValueChange
    });

    await user.click(start());
    await user.type(start(), '02 Apr 2024{Enter}');

    expect(onValidityChange).toHaveBeenLastCalledWith({
      valid: false,
      reason: 'out-of-bounds'
    });
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('treats an emptied field as clearing that endpoint, not an error', async () => {
    const user = userEvent.setup();
    const onValidityChange = vi.fn();
    const onValueChange = vi.fn();
    setup({
      defaultValue: { from: new Date(2024, 3, 17), to: new Date(2024, 3, 20) },
      onValidityChange,
      onValueChange
    });

    await user.clear(end());
    await user.tab();

    expect(onValidityChange).toHaveBeenLastCalledWith({ valid: true });
    const next = lastArg(onValueChange) as DateRangeValue;
    expect(next.to).toBeNull();
    expect(dayKey(next.from as Date)).toBe('2024-04-17');
  });

  it('clears the end when a typed start moves past it', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    setup({
      defaultValue: { from: new Date(2024, 3, 10), to: new Date(2024, 3, 12) },
      onValueChange
    });

    await user.clear(start());
    await user.type(start(), '25 Apr 2024{Enter}');

    const next = lastArg(onValueChange) as DateRangeValue;
    expect(dayKey(next.from as Date)).toBe('2024-04-25');
    expect(next.to).toBeNull();
  });

  it('reverts the draft on Escape', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    setup({
      defaultValue: { from: new Date(2024, 3, 17), to: null },
      onValueChange
    });

    await user.clear(start());
    await user.type(start(), '01 Jan 2020');
    await user.keyboard('{Escape}');

    expect(start()).toHaveValue('17 Apr 2024');
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('moves the visible month to a typed date', async () => {
    const user = userEvent.setup();
    const onMonthChange = vi.fn();
    render(
      <CalendarPreview
        selection='range'
        defaultMonth={MONTH}
        onMonthChange={onMonthChange}
      >
        <CalendarPreview.RangeInput />
        <CalendarPreview.Nav />
        <CalendarPreview.Grid />
      </CalendarPreview>
    );

    await user.click(start());
    await user.type(start(), '09 Sep 2025{Enter}');

    expect(dayKey(lastArg(onMonthChange) as Date)).toBe('2025-09-09');
    expect(screen.getByText('September 2025')).toBeInTheDocument();
  });

  it('drops the draft when the grid writes underneath it', async () => {
    const user = userEvent.setup();
    const { container } = setup();

    await user.click(start());
    await user.type(start(), '17 Ap');
    await user.click(dayButton(container, '2024-04-05'));

    expect(start()).toHaveValue('05 Apr 2024');
  });

  it('tracks the active field from focus', async () => {
    const user = userEvent.setup();
    const { container } = setup();

    expect(getSlot(container, 'calendar-preview-input-start')).toHaveAttribute(
      'data-active'
    );
    await user.click(end());
    expect(getSlot(container, 'calendar-preview-input-end')).toHaveAttribute(
      'data-active'
    );
  });
});

describe('CalendarPreview.RangeInput lock', () => {
  it('holds the locked field read-only without disabling the picker', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { container } = setup({
      lock: 'from',
      defaultValue: { from: new Date(2024, 3, 10), to: null },
      onValueChange
    });

    expect(start()).toHaveAttribute('readonly');
    expect(end()).not.toHaveAttribute('readonly');
    // The grid stays live — this is the whole point of `lock`.
    expect(dayButton(container, '2024-04-20')).not.toBeDisabled();

    await user.click(dayButton(container, '2024-04-20'));

    const next = lastArg(onValueChange) as DateRangeValue;
    expect(dayKey(next.from as Date)).toBe('2024-04-10');
    expect(dayKey(next.to as Date)).toBe('2024-04-20');
  });

  it('never makes the locked endpoint the active field', async () => {
    const user = userEvent.setup();
    const { container } = setup({ lock: 'from' });

    await user.click(start());
    expect(
      getSlot(container, 'calendar-preview-input-start')
    ).not.toHaveAttribute('data-active');
    expect(getSlot(container, 'calendar-preview-input-end')).toHaveAttribute(
      'data-active'
    );
  });

  it('holds the start when the end is locked', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { container } = setup({
      lock: 'to',
      defaultValue: { from: null, to: new Date(2024, 3, 25) },
      onValueChange
    });

    await user.click(dayButton(container, '2024-04-12'));

    const next = lastArg(onValueChange) as DateRangeValue;
    expect(dayKey(next.from as Date)).toBe('2024-04-12');
    expect(dayKey(next.to as Date)).toBe('2024-04-25');
  });

  it('throws when used outside selection="range"', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() =>
      render(
        <CalendarPreview>
          <CalendarPreview.RangeInput />
        </CalendarPreview>
      )
    ).toThrow('requires selection="range"');
    spy.mockRestore();
  });
});

/*
 * The RFC puts `.RangeInput` under `.Trigger`; the Figma puts the typed field
 * inside the popover surface instead. These tests pin what each placement
 * actually costs, so the decision can be made on evidence.
 */
describe('CalendarPreview.RangeInput placement', () => {
  it('works inside .Content, alongside the grid', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <CalendarPreview
        selection='range'
        defaultMonth={MONTH}
        defaultOpen
        onValueChange={onValueChange}
      >
        <CalendarPreview.Trigger>Pick</CalendarPreview.Trigger>
        <CalendarPreview.Content>
          <CalendarPreview.RangeInput />
          <CalendarPreview.Grid />
        </CalendarPreview.Content>
      </CalendarPreview>
    );

    await user.type(await screen.findByLabelText('Start date'), '17 Apr 2024');
    await user.keyboard('{Enter}');

    const next = lastArg(onValueChange) as DateRangeValue;
    expect(dayKey(next.from as Date)).toBe('2024-04-17');
  });

  /*
   * Inside `.Trigger` the popup takes initial focus on open, so focus lands on
   * the grid's focused day and the keystrokes never reach the field — Enter
   * then selects that day instead of committing the text. `.Content` has to
   * decline initial focus for a typable trigger to work at all.
   */
  it('loses keystrokes inside .Trigger under the default focus behaviour', async () => {
    const user = userEvent.setup();
    render(
      <CalendarPreview selection='range' defaultMonth={MONTH}>
        <CalendarPreview.Trigger>
          <CalendarPreview.RangeInput />
        </CalendarPreview.Trigger>
        <CalendarPreview.Content>
          <CalendarPreview.Grid />
        </CalendarPreview.Content>
      </CalendarPreview>
    );

    await user.click(screen.getByLabelText('Start date'));

    expect(document.activeElement).toHaveAttribute(
      'data-slot',
      'calendar-preview-day'
    );
  });

  it('works inside .Trigger when .Content declines initial focus', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <CalendarPreview
        selection='range'
        defaultMonth={MONTH}
        onValueChange={onValueChange}
      >
        <CalendarPreview.Trigger>
          <CalendarPreview.RangeInput />
        </CalendarPreview.Trigger>
        <CalendarPreview.Content initialFocus={false}>
          <CalendarPreview.Grid />
        </CalendarPreview.Content>
      </CalendarPreview>
    );

    const startField = screen.getByLabelText('Start date');
    await user.click(startField);
    expect(startField).toHaveFocus();

    await user.type(startField, '17 Apr 2024');
    await user.keyboard('{Enter}');

    const next = lastArg(onValueChange) as DateRangeValue;
    expect(dayKey(next.from as Date)).toBe('2024-04-17');
  });
});
