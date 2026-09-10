import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { getAllSlots, getSlot } from '~/test-utils/data-slots';
import { CalendarPreview } from '../calendar-preview';

const TODAY = new Date(2026, 7, 15);
const AUGUST = new Date(2026, 7, 1);

function renderRange(props = {}, children?: React.ReactNode) {
  return render(
    <CalendarPreview
      selection='range'
      today={TODAY}
      defaultMonth={AUGUST}
      {...props}
    >
      {children ?? <CalendarPreview.Days />}
    </CalendarPreview>
  );
}

function day(container: HTMLElement, text: string): HTMLElement {
  const match = getAllSlots(container, 'calendar-preview-day').find(
    cell =>
      getSlot(cell, 'calendar-preview-day-number')?.textContent === text &&
      !cell.hasAttribute('data-outside')
  );
  if (!match) throw new Error(`no cell for ${text}`);
  return match;
}

describe('CalendarPreview range machine', () => {
  it('does not emit on the first click', () => {
    const onValueChange = vi.fn();
    const { container } = renderRange({ onValueChange });
    fireEvent.click(day(container, '10'));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('emits once, with both edges, when the range completes', () => {
    const onValueChange = vi.fn();
    const { container } = renderRange({ onValueChange });
    fireEvent.click(day(container, '10'));
    fireEvent.click(day(container, '20'));
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange.mock.calls[0][0]).toEqual({
      from: new Date(2026, 7, 10),
      to: new Date(2026, 7, 20)
    });
  });

  it('treats an earlier second click as a new start, still emitting nothing', () => {
    const onValueChange = vi.fn();
    const { container } = renderRange({ onValueChange });
    fireEvent.click(day(container, '20'));
    fireEvent.click(day(container, '10'));
    expect(onValueChange).not.toHaveBeenCalled();
    /* The earlier day became the new start, so a later click completes. */
    fireEvent.click(day(container, '15'));
    expect(onValueChange.mock.calls[0][0]).toEqual({
      from: new Date(2026, 7, 10),
      to: new Date(2026, 7, 15)
    });
  });

  it('restarts from a click on a complete range, and emits nothing until it completes again', () => {
    const onValueChange = vi.fn();
    const { container } = renderRange({ onValueChange });
    fireEvent.click(day(container, '10'));
    fireEvent.click(day(container, '20'));
    expect(onValueChange).toHaveBeenCalledTimes(1);

    fireEvent.click(day(container, '5'));
    expect(onValueChange).toHaveBeenCalledTimes(1);

    fireEvent.click(day(container, '8'));
    expect(onValueChange).toHaveBeenCalledTimes(2);
    expect(onValueChange.mock.calls[1][0]).toEqual({
      from: new Date(2026, 7, 5),
      to: new Date(2026, 7, 8)
    });
  });

  it('marks the endpoints and the days between them', () => {
    const { container } = renderRange();
    fireEvent.click(day(container, '10'));
    fireEvent.click(day(container, '13'));

    expect(day(container, '10')).toHaveAttribute('data-range-start');
    expect(day(container, '13')).toHaveAttribute('data-range-end');
    for (const between of ['11', '12']) {
      expect(day(container, between)).toHaveAttribute('data-range-middle');
    }
    expect(day(container, '9')).not.toHaveAttribute('data-range-middle');
  });

  it('renders a controlled range without a click', () => {
    const { container } = renderRange({
      value: { from: new Date(2026, 7, 10), to: new Date(2026, 7, 12) }
    });
    expect(day(container, '10')).toHaveAttribute('data-range-start');
    expect(day(container, '12')).toHaveAttribute('data-range-end');
  });
});

describe('CalendarPreview range inputs', () => {
  const picker = (
    <>
      <CalendarPreview.Trigger>
        <CalendarPreview.Input field='start' />
        <CalendarPreview.Input field='end' />
      </CalendarPreview.Trigger>
      <CalendarPreview.Content>
        <CalendarPreview.Days />
      </CalendarPreview.Content>
    </>
  );

  const inputs = (container: HTMLElement) =>
    getAllSlots(container, 'calendar-preview-input') as HTMLInputElement[];

  it('gives each endpoint its own field and placeholder', () => {
    const { container } = renderRange({}, picker);
    const [start, end] = inputs(container);
    expect(start).toHaveAttribute('data-field', 'start');
    expect(end).toHaveAttribute('data-field', 'end');
    expect(start).toHaveAttribute('placeholder', 'Select start date');
    expect(end).toHaveAttribute('placeholder', 'Select end date');
  });

  it('advances the active endpoint to the end after the first click', () => {
    const { container } = renderRange({}, picker);
    const [start, end] = inputs(container);
    expect(start).toHaveAttribute('data-active', 'true');
    expect(end).not.toHaveAttribute('data-active');

    fireEvent.focus(start);
    fireEvent.click(day(document.body, '10'));

    expect(end).toHaveAttribute('data-active', 'true');
    expect(start).not.toHaveAttribute('data-active');
  });

  it('shows each endpoint in its own field', () => {
    const { container } = renderRange({}, picker);
    fireEvent.focus(inputs(container)[0]);
    fireEvent.click(day(document.body, '10'));
    fireEvent.click(day(document.body, '20'));
    const [start, end] = inputs(container);
    expect(start.value).toBe('10 Aug 2026');
    expect(end.value).toBe('20 Aug 2026');
  });

  /* `lock` is gone: a read-only endpoint is one read-only `.Input`. */
  it('never lets a grid click rewrite a read-only endpoint', () => {
    const onValueChange = vi.fn();
    const { container } = renderRange(
      {
        onValueChange,
        value: { from: new Date(2026, 7, 10), to: new Date(2026, 7, 20) }
      },
      <>
        <CalendarPreview.Trigger>
          <CalendarPreview.Input field='start' readOnly />
          <CalendarPreview.Input field='end' />
        </CalendarPreview.Trigger>
        <CalendarPreview.Content>
          <CalendarPreview.Days />
        </CalendarPreview.Content>
      </>
    );
    fireEvent.focus(inputs(container)[1]);
    /* A click that would restart the range has to rewrite `from`, which is
       read-only, so nothing moves. */
    fireEvent.click(day(document.body, '5'));
    expect(onValueChange).not.toHaveBeenCalled();
  });
});

describe('CalendarPreview range auto-close', () => {
  const picker = (
    <>
      <CalendarPreview.Trigger>
        <CalendarPreview.Input field='start' />
        <CalendarPreview.Input field='end' />
      </CalendarPreview.Trigger>
      <CalendarPreview.Content>
        <CalendarPreview.Days />
      </CalendarPreview.Content>
    </>
  );

  const isOpen = () =>
    getSlot(document.body, 'calendar-preview-content') !== null;

  it('closes through onOpenChange when the range completes', () => {
    const onOpenChange = vi.fn();
    const { container } = renderRange({ onOpenChange }, picker);
    fireEvent.focus(
      getAllSlots(container, 'calendar-preview-input')[0] as HTMLElement
    );
    expect(isOpen()).toBe(true);

    fireEvent.click(day(document.body, '10'));
    expect(isOpen()).toBe(true);

    fireEvent.click(day(document.body, '20'));
    expect(isOpen()).toBe(false);
    expect(onOpenChange).toHaveBeenLastCalledWith(false, expect.anything());
  });

  /* Completing a range hands focus back to the trigger, and an unguarded
     focus handler reopens the popover on the way out. jsdom does not restore
     focus the way a browser does, so this asserts the guard rather than the
     symptom: the close must be the last thing that happens. */
  it('does not reopen on the focus that follows an auto-close', () => {
    const onOpenChange = vi.fn();
    const { container } = renderRange({ onOpenChange }, picker);
    const [start] = getAllSlots(
      container,
      'calendar-preview-input'
    ) as HTMLElement[];
    fireEvent.focus(start);

    fireEvent.click(day(document.body, '10'));
    fireEvent.click(day(document.body, '20'));
    expect(isOpen()).toBe(false);

    /* The browser returns focus to the trigger here. */
    fireEvent.focus(start);
    expect(isOpen()).toBe(false);
    const calls = onOpenChange.mock.calls;
    expect(calls[calls.length - 1][0]).toBe(false);
  });

  /* Completing a range asks to close; a consumer holding `open` open wins. */
  it('does not fight a controlled open', () => {
    const onOpenChange = vi.fn();
    renderRange({ open: true, onOpenChange }, picker);
    fireEvent.click(day(document.body, '10'));
    fireEvent.click(day(document.body, '20'));
    expect(isOpen()).toBe(true);
    expect(onOpenChange).toHaveBeenLastCalledWith(false, expect.anything());
  });
});

describe('CalendarPreview range parts that read the value', () => {
  const RANGE = { from: new Date(2026, 7, 10), to: new Date(2026, 7, 20) };

  const typeAndCommit = (input: HTMLInputElement, text: string) => {
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: text } });
    fireEvent.keyDown(input, { key: 'Enter' });
  };

  const inputs = (container: HTMLElement) =>
    getAllSlots(container, 'calendar-preview-input') as HTMLInputElement[];

  const picker = (
    <>
      <CalendarPreview.Trigger>
        <CalendarPreview.Input field='start' />
        <CalendarPreview.Input field='end' />
      </CalendarPreview.Trigger>
      <CalendarPreview.Content>
        <CalendarPreview.Days />
      </CalendarPreview.Content>
    </>
  );

  /* `.Days` renders `.Header` renders `.Reset`, so this is the default
     composition — it threw on `dayKey(range)` before the shape guard. */
  it('renders the default composition with a range value and a defaultDate', () => {
    expect(() =>
      renderRange({ defaultValue: RANGE, defaultDate: RANGE.from })
    ).not.toThrow();
  });

  it('restores a range defaultDate, and disables itself once restored', () => {
    const onValueChange = vi.fn();
    const RESTORED = { from: new Date(2026, 7, 3), to: new Date(2026, 7, 7) };
    const { container } = renderRange({
      defaultValue: RANGE,
      defaultDate: RESTORED,
      onValueChange
    });
    const reset = getSlot(container, 'calendar-preview-reset') as HTMLElement;
    expect(reset).not.toBeNull();
    expect(reset).not.toBeDisabled();
    fireEvent.click(reset);
    expect(onValueChange).toHaveBeenCalledWith(
      RESTORED,
      expect.objectContaining({ reason: 'reset' })
    );
  });

  it('starts restored when the value already equals the range default', () => {
    const { container } = renderRange({
      defaultValue: RANGE,
      defaultDate: RANGE
    });
    const reset = getSlot(container, 'calendar-preview-reset') as HTMLElement;
    expect(reset).toBeDisabled();
    expect(reset).toHaveAttribute('data-restored');
  });

  /* Both edges have to match — a shared start is not a restored range. */
  it('is not restored when only one edge matches the default', () => {
    const { container } = renderRange({
      defaultValue: RANGE,
      defaultDate: { from: RANGE.from, to: new Date(2026, 7, 25) }
    });
    expect(getSlot(container, 'calendar-preview-reset')).not.toBeDisabled();
  });

  /* Clearing is shape-agnostic, so a `null` default keeps working. */
  it('keeps .Reset for a null defaultDate, and clears the range', () => {
    const onValueChange = vi.fn();
    const { container } = renderRange({
      defaultValue: RANGE,
      defaultDate: null,
      onValueChange
    });
    const reset = getSlot(container, 'calendar-preview-reset');
    expect(reset).not.toBeNull();
    fireEvent.click(reset as HTMLElement);
    expect(onValueChange).toHaveBeenCalledWith(null, expect.anything());
  });

  it('labels a childless .Trigger with both endpoints', () => {
    const { container } = renderRange(
      { defaultValue: RANGE },
      <CalendarPreview.Trigger />
    );
    const trigger = getSlot(container, 'calendar-preview-trigger');
    expect(trigger?.textContent).toContain('10 Aug 2026');
    expect(trigger?.textContent).toContain('20 Aug 2026');
  });

  it('edits the end without disturbing the start', () => {
    const onValueChange = vi.fn();
    const { container } = renderRange(
      { defaultValue: RANGE, onValueChange },
      picker
    );
    const [start, end] = inputs(container);
    typeAndCommit(end, '25/08/2026');
    expect(start.value).toBe('10 Aug 2026');
    expect(end.value).toBe('25 Aug 2026');
    expect(onValueChange).toHaveBeenCalledWith(
      { from: RANGE.from, to: new Date(2026, 7, 25) },
      expect.objectContaining({ reason: 'input' })
    );
  });

  it('edits the start without disturbing the end', () => {
    const onValueChange = vi.fn();
    const { container } = renderRange(
      { defaultValue: RANGE, onValueChange },
      picker
    );
    const [start, end] = inputs(container);
    typeAndCommit(start, '05/08/2026');
    expect(start.value).toBe('05 Aug 2026');
    expect(end.value).toBe('20 Aug 2026');
    expect(onValueChange).toHaveBeenCalledWith(
      { from: new Date(2026, 7, 5), to: RANGE.to },
      expect.objectContaining({ reason: 'input' })
    );
  });

  it('restarts, and emits nothing, when a typed end crosses the start', () => {
    const onValueChange = vi.fn();
    const { container } = renderRange(
      { defaultValue: RANGE, onValueChange },
      picker
    );
    const [, end] = inputs(container);
    typeAndCommit(end, '01/08/2026');
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('refuses a typed endpoint the consumer marked read-only', () => {
    const onValueChange = vi.fn();
    const { container } = renderRange(
      { defaultValue: RANGE, onValueChange },
      <CalendarPreview.Trigger>
        <CalendarPreview.Input field='start' readOnly />
        <CalendarPreview.Input field='end' />
      </CalendarPreview.Trigger>
    );
    const [start] = inputs(container);
    typeAndCommit(start, '05/08/2026');
    expect(onValueChange).not.toHaveBeenCalled();
  });
});

describe('CalendarPreview range order validation', () => {
  const RANGE = { from: new Date(2026, 7, 10), to: new Date(2026, 7, 20) };

  const inputs = (container: HTMLElement) =>
    getAllSlots(container, 'calendar-preview-input') as HTMLInputElement[];

  const typeAndCommit = (input: HTMLInputElement, text: string) => {
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: text } });
    fireEvent.keyDown(input, { key: 'Enter' });
  };

  const picker = (onValidityChange?: (v: unknown) => void) => (
    <CalendarPreview.Trigger>
      <CalendarPreview.Input
        field='start'
        onValidityChange={onValidityChange}
      />
      <CalendarPreview.Input field='end' onValidityChange={onValidityChange} />
    </CalendarPreview.Trigger>
  );

  it('rejects an end typed before the start, and emits nothing', () => {
    const onValidityChange = vi.fn();
    const onValueChange = vi.fn();
    const { container } = renderRange(
      { defaultValue: RANGE, onValueChange },
      picker(onValidityChange)
    );
    const [start, end] = inputs(container);
    typeAndCommit(end, '01/08/2026');
    expect(onValidityChange).toHaveBeenLastCalledWith({
      valid: false,
      reason: 'out-of-order',
      message: 'End date cannot be before the start date'
    });
    expect(onValueChange).not.toHaveBeenCalled();
    expect(start.value).toBe('10 Aug 2026');
    expect(end).toHaveAttribute('data-invalid');
  });

  it('rejects a start typed after the end', () => {
    const onValidityChange = vi.fn();
    const { container } = renderRange(
      { defaultValue: RANGE },
      picker(onValidityChange)
    );
    const [start] = inputs(container);
    typeAndCommit(start, '25/08/2026');
    expect(onValidityChange).toHaveBeenLastCalledWith({
      valid: false,
      reason: 'out-of-order',
      message: 'Start date cannot be after the end date'
    });
    expect(start).toHaveAttribute('data-invalid');
  });

  it('allows the two endpoints to be the same day', () => {
    const onValueChange = vi.fn();
    const { container } = renderRange(
      { defaultValue: RANGE, onValueChange },
      picker()
    );
    const [, end] = inputs(container);
    typeAndCommit(end, '10/08/2026');
    expect(onValueChange).toHaveBeenCalledWith(
      { from: RANGE.from, to: RANGE.from },
      expect.objectContaining({ reason: 'input' })
    );
  });

  it('checks a half-built range against its own start', () => {
    const onValidityChange = vi.fn();
    const { container } = renderRange({}, picker(onValidityChange));
    const [start, end] = inputs(container);
    typeAndCommit(start, '10/08/2026');
    typeAndCommit(end, '05/08/2026');
    expect(onValidityChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ reason: 'out-of-order' })
    );
  });

  it('takes an errorMessages override for the new reason', () => {
    const onValidityChange = vi.fn();
    const { container } = renderRange(
      { defaultValue: RANGE },
      <CalendarPreview.Trigger>
        <CalendarPreview.Input field='start' />
        <CalendarPreview.Input
          field='end'
          errorMessages={{ 'out-of-order': 'Pick a day after the start' }}
          onValidityChange={onValidityChange}
        />
      </CalendarPreview.Trigger>
    );
    const [, end] = inputs(container);
    typeAndCommit(end, '01/08/2026');
    expect(onValidityChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ message: 'Pick a day after the start' })
    );
  });

  /* The grid keeps its restart rule — only typing is strict. */
  it('still lets a grid click restart the range from an earlier day', () => {
    const onValueChange = vi.fn();
    const { container } = renderRange({ defaultValue: RANGE, onValueChange });
    fireEvent.click(day(container, '5'));
    expect(onValueChange).not.toHaveBeenCalled();
    expect(day(container, '5')).toHaveAttribute('data-selected');
  });
});
