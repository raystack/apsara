import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CalendarPreview } from '../calendar-preview';

/*
 * What the keyboard does: arrow keys in the day grid, and Enter / Escape / blur
 * in the typed fields. Both were places where a key press had no test at all —
 * the grid's arrows never moved focus, and a rejected commit erased the text it
 * was rejecting.
 */

/*
 * Arrow-key navigation is the stated reason the RFC depends on
 * react-day-picker, and it had no test anywhere in the suite. RDP moves a
 * `focused` modifier between days and never touches the DOM, so a `DayButton`
 * override that drops the ref and the focus effect leaves the keyboard dead
 * while every other test stays green.
 */
const MONTH = new Date(2024, 3, 1); // April 2024
const focused = () => document.activeElement?.textContent?.trim();

const grid = () =>
  render(
    <CalendarPreview defaultMonth={MONTH}>
      <CalendarPreview.Nav />
      <CalendarPreview.Grid />
    </CalendarPreview>
  );

describe('day grid keyboard navigation', () => {
  it('moves focus one day right', async () => {
    const user = userEvent.setup();
    grid();
    screen.getByRole('button', { name: /April 17th/ }).focus();
    await user.keyboard('{ArrowRight}');
    expect(focused()).toBe('18');
  });

  it('moves focus one day left', async () => {
    const user = userEvent.setup();
    grid();
    screen.getByRole('button', { name: /April 17th/ }).focus();
    await user.keyboard('{ArrowLeft}');
    expect(focused()).toBe('16');
  });

  it('moves focus a week down and back up', async () => {
    const user = userEvent.setup();
    grid();
    screen.getByRole('button', { name: /April 17th/ }).focus();
    await user.keyboard('{ArrowDown}');
    expect(focused()).toBe('24');
    await user.keyboard('{ArrowUp}');
    expect(focused()).toBe('17');
  });

  /*
   * The case that lost focus outright: stepping past the last day pages the
   * month, and the day it lands on is in markup that did not exist when the
   * key was pressed. Focus must follow it rather than fall to `<body>`.
   */
  it('follows focus across a month boundary instead of dropping it', async () => {
    const user = userEvent.setup();
    grid();
    screen.getByRole('button', { name: /April 30th/ }).focus();
    await user.keyboard('{ArrowRight}');

    expect(document.activeElement).not.toBe(document.body);
    expect(focused()).toBe('1');
    expect(
      document.querySelector('[data-slot="calendar-preview-nav-caption"]')
        ?.textContent
    ).toContain('May');
  });

  it('keeps the focused day reachable when paging backwards too', async () => {
    const user = userEvent.setup();
    grid();
    screen.getByRole('button', { name: /April 1st/ }).focus();
    await user.keyboard('{ArrowLeft}');

    expect(document.activeElement).not.toBe(document.body);
    expect(focused()).toBe('31');
  });
});

/*
 * A rejected commit used to erase the text it was rejecting. The field snapped
 * back to the old value while the consumer was handed
 * `{valid: false, reason: 'unparseable'}` — an error describing text no longer
 * on screen, and with validity latching there was no way to dismiss it either.
 *
 * Both typed fields cleared the draft unconditionally, in two places. They now
 * share one, so these cover `.Input` and `.RangeInput` together.
 */
describe('a rejected commit keeps what the user typed', () => {
  it('.Input keeps unparseable text on Enter', async () => {
    const user = userEvent.setup();
    const onValidityChange = vi.fn();
    render(
      <CalendarPreview
        value={new Date(2024, 3, 17)}
        defaultMonth={MONTH}
        onValidityChange={onValidityChange}
      >
        <CalendarPreview.Input />
      </CalendarPreview>
    );

    const field = screen.getByRole('textbox');
    await user.clear(field);
    await user.type(field, '32 Apr 2024{Enter}');

    expect(field).toHaveValue('32 Apr 2024');
    expect(onValidityChange).toHaveBeenLastCalledWith({
      valid: false,
      reason: 'unparseable'
    });
  });

  it('.Input keeps an out-of-bounds date on blur', async () => {
    const user = userEvent.setup();
    render(
      <CalendarPreview
        value={new Date(2024, 3, 17)}
        defaultMonth={MONTH}
        minDate={new Date(2024, 3, 10)}
        maxDate={new Date(2024, 3, 20)}
      >
        <CalendarPreview.Input />
      </CalendarPreview>
    );

    const field = screen.getByRole('textbox');
    await user.clear(field);
    await user.type(field, '25 Apr 2024');
    await user.tab();

    expect(field).toHaveValue('25 Apr 2024');
  });

  it('Escape is still the way back to the committed value', async () => {
    const user = userEvent.setup();
    render(
      <CalendarPreview value={new Date(2024, 3, 17)} defaultMonth={MONTH}>
        <CalendarPreview.Input />
      </CalendarPreview>
    );

    const field = screen.getByRole('textbox');
    await user.clear(field);
    await user.type(field, '32 Apr 2024{Enter}');
    expect(field).toHaveValue('32 Apr 2024');

    await user.keyboard('{Escape}');
    expect(field).toHaveValue('17 Apr 2024');
  });

  /*
   * Uncontrolled, so the commit actually lands. Under a controlled `value` whose
   * parent ignores the change the field correctly returns to the committed text,
   * which would pass this assertion for the wrong reason.
   */
  it('an accepted commit still replaces the draft with the canonical text', async () => {
    const user = userEvent.setup();
    render(
      <CalendarPreview
        defaultValue={new Date(2024, 3, 17)}
        defaultMonth={MONTH}
      >
        <CalendarPreview.Input />
      </CalendarPreview>
    );

    const field = screen.getByRole('textbox');
    await user.clear(field);
    await user.type(field, '18 Apr 2024{Enter}');

    expect(field).toHaveValue('18 Apr 2024');
  });

  it('.RangeInput keeps unparseable text in the endpoint typed', async () => {
    const user = userEvent.setup();
    render(
      <CalendarPreview
        selection='range'
        defaultMonth={MONTH}
        value={{ from: new Date(2024, 3, 17), to: new Date(2024, 3, 20) }}
      >
        <CalendarPreview.RangeInput />
      </CalendarPreview>
    );

    const start = screen.getByLabelText('Start date');
    await user.clear(start);
    await user.type(start, 'nonsense{Enter}');

    expect(start).toHaveValue('nonsense');
    // The endpoint the user did not touch is untouched.
    expect(screen.getByLabelText('End date')).toHaveValue('20 Apr 2024');
  });
});
