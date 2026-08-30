import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { getAllSlots, getSlot } from '~/test-utils/data-slots';
import { CalendarPreview } from '../calendar-preview';

const MONTH = new Date(2024, 3, 1);

const full = (props: Record<string, unknown> = {}) =>
  render(
    <CalendarPreview
      defaultMonth={MONTH}
      granularities={['day', 'month']}
      defaultValue={new Date(2024, 3, 10)}
      {...props}
    >
      <CalendarPreview.Input />
      <CalendarPreview.GranularityTabs />
      <CalendarPreview.Presets>
        <CalendarPreview.Preset value={new Date(2024, 3, 20)}>
          A preset
        </CalendarPreview.Preset>
      </CalendarPreview.Presets>
      <CalendarPreview.Nav />
      <CalendarPreview.Grid />
      <CalendarPreview.Footer>
        <CalendarPreview.Cancel />
        <CalendarPreview.Apply />
      </CalendarPreview.Footer>
    </CalendarPreview>
  );

describe('CalendarPreview loading', () => {
  it('replaces the caption and the grid with a shimmer', () => {
    const { container } = full({ loading: true });
    expect(getAllSlots(container, 'calendar-preview-skeleton')).toHaveLength(2);
    expect(getSlot(container, 'calendar-preview-nav-caption')).toBeNull();
    expect(getSlot(container, 'calendar-preview-grid')).toBeNull();
    expect(getSlot(container, 'calendar-preview-day')).toBeNull();
  });

  it('replaces the grid outright rather than overlaying it', () => {
    // The old family shimmered five rows over a live grid, leaving the days
    // underneath focusable.
    const { container } = full({ loading: true });
    expect(container.querySelectorAll('[data-day]')).toHaveLength(0);
    expect(getSlot(container, 'calendar-preview-skeleton')).toHaveAttribute(
      'aria-busy',
      'true'
    );
  });

  it('disables every control, not just the grid', () => {
    const { container } = full({ loading: true });
    expect(container.querySelector('input')).toBeDisabled();
    for (const tab of screen.getAllByRole('tab')) {
      expect(tab).toHaveAttribute('aria-disabled', 'true');
    }
    expect(getSlot(container, 'calendar-preview-preset')).toBeDisabled();
    expect(screen.getByLabelText('Previous month')).toBeDisabled();
    expect(screen.getByLabelText('Next month')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Apply' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled();
  });

  it('accepts no writes while loading', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    full({ loading: true, onValueChange });
    await user.click(screen.getByRole('button', { name: 'A preset' }));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('shimmers the month grid too', () => {
    const { container } = render(
      <CalendarPreview defaultGranularity='month' loading>
        <CalendarPreview.MonthGrid />
      </CalendarPreview>
    );
    expect(getSlot(container, 'calendar-preview-skeleton')).not.toBeNull();
    expect(getSlot(container, 'calendar-preview-month-cell')).toBeNull();
  });

  it('restores everything when loading clears', () => {
    const { container, rerender } = full({ loading: true });
    expect(getSlot(container, 'calendar-preview-grid')).toBeNull();

    rerender(
      <CalendarPreview
        defaultMonth={MONTH}
        granularities={['day', 'month']}
        defaultValue={new Date(2024, 3, 10)}
      >
        <CalendarPreview.Nav />
        <CalendarPreview.Grid />
      </CalendarPreview>
    );
    expect(getSlot(container, 'calendar-preview-grid')).not.toBeNull();
    expect(getSlot(container, 'calendar-preview-nav-caption')).not.toBeNull();
    expect(getAllSlots(container, 'calendar-preview-skeleton')).toHaveLength(0);
  });

  it('leaves an explicit disabled untouched when not loading', () => {
    const { container } = full({ disabled: true });
    expect(getAllSlots(container, 'calendar-preview-skeleton')).toHaveLength(0);
    expect(container.querySelector('input')).toBeDisabled();
  });
});
