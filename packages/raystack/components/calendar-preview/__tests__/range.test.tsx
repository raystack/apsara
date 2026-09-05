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
    expect(start.value).toBe('10/08/2026');
    expect(end.value).toBe('20/08/2026');
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
