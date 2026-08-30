import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CalendarPreview } from '../calendar-preview';
import { dayKey } from '../date-adapter';

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
