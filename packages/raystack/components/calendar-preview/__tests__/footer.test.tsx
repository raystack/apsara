import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { getSlot } from '~/test-utils/data-slots';
import { CalendarPreview } from '../calendar-preview';
import { dayKey } from '../date-adapter';

const MONTH = new Date(2024, 3, 1);
const lastArg = (fn: { mock: { calls: unknown[][] } }) =>
  fn.mock.calls[fn.mock.calls.length - 1]?.[0];

const day = (iso: string) =>
  document.querySelector(`[data-day="${iso}"] button`) as HTMLButtonElement;

const tree = (props: Record<string, unknown> = {}) =>
  render(
    <CalendarPreview defaultMonth={MONTH} defaultOpen {...props}>
      <CalendarPreview.Trigger>Pick</CalendarPreview.Trigger>
      <CalendarPreview.Content>
        <CalendarPreview.Grid />
        <CalendarPreview.Footer>
          <CalendarPreview.Cancel />
          <CalendarPreview.Apply />
        </CalendarPreview.Footer>
      </CalendarPreview.Content>
    </CalendarPreview>
  );

describe('CalendarPreview.Footer', () => {
  it('renders all three slots', async () => {
    tree();
    await screen.findByRole('grid');
    for (const slot of ['footer', 'apply', 'cancel']) {
      expect(getSlot(document.body, `calendar-preview-${slot}`)).not.toBeNull();
    }
  });

  it('buffers edits under commit="explicit" until Apply', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    tree({ commit: 'explicit', onValueChange });
    await screen.findByRole('grid');

    await user.click(day('2024-04-17'));
    // Nothing has reached the parent yet.
    expect(onValueChange).not.toHaveBeenCalled();
    // But the grid shows the pending pick.
    expect(day('2024-04-17').closest('td')?.className).toContain('selected');

    await user.click(screen.getByRole('button', { name: 'Apply' }));
    expect(dayKey(lastArg(onValueChange) as Date)).toBe('2024-04-17');
  });

  it('discards buffered edits on Cancel', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    tree({ commit: 'explicit', onValueChange });
    await screen.findByRole('grid');

    await user.click(day('2024-04-17'));
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('discards buffered edits when the surface is dismissed', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const onOpenChange = vi.fn();
    tree({ commit: 'explicit', onValueChange, onOpenChange });
    await screen.findByRole('grid');

    await user.click(day('2024-04-17'));
    await user.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenLastCalledWith(false, expect.anything());
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('disables Apply until there is something to commit', async () => {
    const user = userEvent.setup();
    tree({ commit: 'explicit' });
    await screen.findByRole('grid');

    expect(screen.getByRole('button', { name: 'Apply' })).toBeDisabled();
    await user.click(day('2024-04-17'));
    expect(screen.getByRole('button', { name: 'Apply' })).not.toBeDisabled();
  });

  it('commits immediately by default, and Apply just closes', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    tree({ onValueChange });
    await screen.findByRole('grid');

    await user.click(day('2024-04-17'));
    expect(dayKey(lastArg(onValueChange) as Date)).toBe('2024-04-17');

    await user.click(screen.getByRole('button', { name: 'Apply' }));
    expect(getSlot(document.body, 'calendar-preview-content')).toBeNull();
  });
});
