import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { CalendarPreview } from '../calendar-preview';

const MONTH = new Date(2024, 3, 1);
const day = (c: HTMLElement, iso: string) =>
  c.querySelector(`[data-day="${iso}"] button`) as HTMLButtonElement;

/*
 * The suite renders once, acts once and asserts, which is how a whole class of
 * second-render defects went unnoticed. These assert across a re-render.
 */
describe('survives a re-render', () => {
  it('keeps the same day node, so roving tabindex has something to hold', () => {
    const { container, rerender } = render(
      <CalendarPreview defaultMonth={MONTH}>
        <CalendarPreview.Grid />
      </CalendarPreview>
    );
    const before = day(container, '2024-04-17');
    rerender(
      <CalendarPreview defaultMonth={MONTH} readOnly>
        <CalendarPreview.Grid />
      </CalendarPreview>
    );
    expect(day(container, '2024-04-17')).toBe(before);
  });

  it('keeps DOM focus on the focused day across a re-render', () => {
    const { container, rerender } = render(
      <CalendarPreview defaultMonth={MONTH}>
        <CalendarPreview.Grid />
      </CalendarPreview>
    );
    const target = day(container, '2024-04-17');
    target.focus();
    expect(target).toHaveFocus();

    rerender(
      <CalendarPreview defaultMonth={MONTH} readOnly>
        <CalendarPreview.Grid />
      </CalendarPreview>
    );
    expect(day(container, '2024-04-17')).toHaveFocus();
  });

  it('keeps focus on the focused day when selecting re-renders the grid', async () => {
    // The realistic case: clicking a day re-renders with a new value, and the
    // roving tabindex needs the node it just focused to still be there.
    const user = userEvent.setup();
    const { container } = render(
      <CalendarPreview defaultMonth={MONTH}>
        <CalendarPreview.Grid />
      </CalendarPreview>
    );
    const target = day(container, '2024-04-17');
    await user.click(target);
    expect(day(container, '2024-04-17')).toBe(target);
    expect(target).toHaveFocus();
  });

  /*
   * Stepping the month genuinely replaces those cells — April's days are not
   * May's — so node identity is not expected to survive a there-and-back
   * navigation, and no amount of hoisting would make it.
   */
});
