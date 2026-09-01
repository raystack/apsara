import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { CalendarPreview } from '../calendar-preview';

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
