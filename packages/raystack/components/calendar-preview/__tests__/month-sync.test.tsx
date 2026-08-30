import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CalendarPreview } from '../calendar-preview';

const caption = () =>
  document.querySelector('[data-slot="calendar-preview-nav-caption"]')
    ?.textContent;

/*
 * The visible month was initialised once at mount and then left alone, so a
 * value that arrived after mount was never shown and reopening the popover
 * did not return to the selection.
 */
describe('the visible month follows the value', () => {
  it('shows a value that arrives after mount, next time it opens', async () => {
    const user = userEvent.setup();
    const view = (value: Date | null) => (
      <CalendarPreview value={value}>
        <CalendarPreview.Trigger>Pick</CalendarPreview.Trigger>
        <CalendarPreview.Content>
          <CalendarPreview.Nav />
          <CalendarPreview.Grid />
        </CalendarPreview.Content>
      </CalendarPreview>
    );

    // Mounted empty, as a picker waiting on a fetch is.
    const { rerender } = render(view(null));
    rerender(view(new Date(2023, 8, 14)));

    await user.click(screen.getByText('Pick'));
    await screen.findByRole('grid');
    expect(caption()).toBe('September 2023');
  });

  it('returns to the selection when reopened, not to where the user left', async () => {
    const user = userEvent.setup();
    render(
      <CalendarPreview defaultValue={new Date(2024, 3, 10)}>
        <CalendarPreview.Trigger>Pick</CalendarPreview.Trigger>
        <CalendarPreview.Content>
          <CalendarPreview.Nav />
          <CalendarPreview.Grid />
        </CalendarPreview.Content>
      </CalendarPreview>
    );

    await user.click(screen.getByText('Pick'));
    await screen.findByRole('grid');
    expect(caption()).toBe('April 2024');

    await user.click(screen.getByLabelText('Next month'));
    await user.click(screen.getByLabelText('Next month'));
    expect(caption()).toBe('June 2024');

    await user.keyboard('{Escape}');
    await user.click(screen.getByText('Pick'));
    await screen.findByRole('grid');
    expect(caption()).toBe('April 2024');
  });

  it('leaves navigation alone while the popover stays open', async () => {
    const user = userEvent.setup();
    render(
      <CalendarPreview defaultValue={new Date(2024, 3, 10)} defaultOpen>
        <CalendarPreview.Nav />
        <CalendarPreview.Grid />
      </CalendarPreview>
    );

    await user.click(screen.getByLabelText('Next month'));
    expect(caption()).toBe('May 2024');
    // A re-render with nothing relevant changed must not pull it back.
    await user.click(document.body);
    expect(caption()).toBe('May 2024');
  });

  it('does not yank an open calendar back to today when the value is cleared', async () => {
    const user = userEvent.setup();
    const view = (value: Date | null) => (
      <CalendarPreview value={value} defaultOpen>
        <CalendarPreview.Nav />
        <CalendarPreview.Grid />
      </CalendarPreview>
    );
    const { rerender } = render(view(new Date(2024, 3, 10)));
    await user.click(screen.getByLabelText('Next month'));
    expect(caption()).toBe('May 2024');

    rerender(view(null));
    expect(caption()).toBe('May 2024');
  });

  it('never writes the month a consumer controls', async () => {
    const user = userEvent.setup();
    const onMonthChange = vi.fn();
    render(
      <CalendarPreview
        defaultValue={new Date(2023, 0, 5)}
        month={new Date(2024, 3, 1)}
        onMonthChange={onMonthChange}
      >
        <CalendarPreview.Trigger>Pick</CalendarPreview.Trigger>
        <CalendarPreview.Content>
          <CalendarPreview.Nav />
          <CalendarPreview.Grid />
        </CalendarPreview.Content>
      </CalendarPreview>
    );

    await user.click(screen.getByText('Pick'));
    await screen.findByRole('grid');
    expect(caption()).toBe('April 2024');
    expect(onMonthChange).not.toHaveBeenCalled();
  });
});
