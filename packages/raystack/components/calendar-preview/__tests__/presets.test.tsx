import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { getAllSlots, getSlot } from '~/test-utils/data-slots';
import { CalendarPreview } from '../calendar-preview';
import type { DateRangeValue } from '../calendar-preview-context';
import { dayKey } from '../date-adapter';

const MONTH = new Date(2024, 3, 1);
const lastCall = (fn: { mock: { calls: unknown[][] } }) =>
  fn.mock.calls[fn.mock.calls.length - 1];

const LAST_7 = { from: new Date(2024, 3, 11), to: new Date(2024, 3, 17) };

describe('CalendarPreview.Presets', () => {
  it('renders its slots and orientation', () => {
    const { container } = render(
      <CalendarPreview defaultMonth={MONTH}>
        <CalendarPreview.Presets orientation='horizontal'>
          <CalendarPreview.Preset value={new Date(2024, 3, 17)}>
            Today
          </CalendarPreview.Preset>
        </CalendarPreview.Presets>
      </CalendarPreview>
    );
    expect(getSlot(container, 'calendar-preview-presets')).toHaveAttribute(
      'data-orientation',
      'horizontal'
    );
    expect(getAllSlots(container, 'calendar-preview-preset')).toHaveLength(1);
  });

  it('applies a single value and reports the granularity', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <CalendarPreview defaultMonth={MONTH} onValueChange={onValueChange}>
        <CalendarPreview.Presets>
          <CalendarPreview.Preset value={new Date(2024, 3, 17)}>
            A day
          </CalendarPreview.Preset>
        </CalendarPreview.Presets>
      </CalendarPreview>
    );

    await user.click(screen.getByRole('button', { name: 'A day' }));
    const [value, details] = lastCall(onValueChange);
    expect(dayKey(value as Date)).toBe('2024-04-17');
    expect(details).toEqual({ granularity: 'day' });
  });

  it('applies a range', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <CalendarPreview
        selection='range'
        defaultMonth={MONTH}
        onValueChange={onValueChange}
      >
        <CalendarPreview.Presets>
          <CalendarPreview.Preset range={LAST_7}>
            Last 7 days
          </CalendarPreview.Preset>
        </CalendarPreview.Presets>
      </CalendarPreview>
    );

    await user.click(screen.getByRole('button', { name: 'Last 7 days' }));
    const next = lastCall(onValueChange)[0] as DateRangeValue;
    expect(dayKey(next.from as Date)).toBe('2024-04-11');
    expect(dayKey(next.to as Date)).toBe('2024-04-17');
  });

  it('marks itself pressed while the value matches', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <CalendarPreview selection='range' defaultMonth={MONTH}>
        <CalendarPreview.Presets>
          <CalendarPreview.Preset range={LAST_7}>Last 7</CalendarPreview.Preset>
        </CalendarPreview.Presets>
      </CalendarPreview>
    );

    const preset = getSlot(container, 'calendar-preview-preset') as HTMLElement;
    expect(preset).toHaveAttribute('aria-pressed', 'false');
    await user.click(preset);
    expect(preset).toHaveAttribute('aria-pressed', 'true');
  });

  it('brings the applied period into view', async () => {
    const user = userEvent.setup();
    const onMonthChange = vi.fn();
    render(
      <CalendarPreview defaultMonth={MONTH} onMonthChange={onMonthChange}>
        <CalendarPreview.Presets>
          <CalendarPreview.Preset value={new Date(2025, 8, 9)}>
            Far away
          </CalendarPreview.Preset>
        </CalendarPreview.Presets>
        <CalendarPreview.Nav />
      </CalendarPreview>
    );

    await user.click(screen.getByRole('button', { name: 'Far away' }));
    expect(dayKey(lastCall(onMonthChange)[0] as Date)).toBe('2025-09-09');
    expect(screen.getByText('September 2025')).toBeInTheDocument();
  });

  it('buffers under commit="explicit" like any other edit', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <CalendarPreview
        commit='explicit'
        defaultMonth={MONTH}
        onValueChange={onValueChange}
      >
        <CalendarPreview.Presets>
          <CalendarPreview.Preset value={new Date(2024, 3, 17)}>
            A day
          </CalendarPreview.Preset>
        </CalendarPreview.Presets>
        <CalendarPreview.Footer>
          <CalendarPreview.Apply />
        </CalendarPreview.Footer>
      </CalendarPreview>
    );

    await user.click(screen.getByRole('button', { name: 'A day' }));
    expect(onValueChange).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'Apply' }));
    expect(dayKey(lastCall(onValueChange)[0] as Date)).toBe('2024-04-17');
  });

  it('refuses writes when disabled or readOnly', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { container } = render(
      <CalendarPreview
        defaultMonth={MONTH}
        readOnly
        onValueChange={onValueChange}
      >
        <CalendarPreview.Presets>
          <CalendarPreview.Preset value={new Date(2024, 3, 17)}>
            A day
          </CalendarPreview.Preset>
        </CalendarPreview.Presets>
      </CalendarPreview>
    );

    expect(getSlot(container, 'calendar-preview-preset')).toBeDisabled();
    await user.click(screen.getByRole('button', { name: 'A day' }));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('renders as another element through render', () => {
    const { container } = render(
      <CalendarPreview defaultMonth={MONTH}>
        <CalendarPreview.Presets>
          <CalendarPreview.Preset
            value={new Date(2024, 3, 17)}
            render={<a href='#x' />}
          >
            As a link
          </CalendarPreview.Preset>
        </CalendarPreview.Presets>
      </CalendarPreview>
    );
    expect(getSlot(container, 'calendar-preview-preset')?.tagName).toBe('A');
  });

  it('rejects a range preset on a single picker', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() =>
      render(
        <CalendarPreview defaultMonth={MONTH}>
          <CalendarPreview.Presets>
            <CalendarPreview.Preset range={LAST_7}>
              Wrong
            </CalendarPreview.Preset>
          </CalendarPreview.Presets>
        </CalendarPreview>
      )
    ).toThrow('requires selection="range"');
    spy.mockRestore();
  });

  it('rejects a value preset on a range picker', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() =>
      render(
        <CalendarPreview selection='range' defaultMonth={MONTH}>
          <CalendarPreview.Presets>
            <CalendarPreview.Preset value={new Date(2024, 3, 17)}>
              Wrong
            </CalendarPreview.Preset>
          </CalendarPreview.Presets>
        </CalendarPreview>
      )
    ).toThrow('needs `range`');
    spy.mockRestore();
  });
});
