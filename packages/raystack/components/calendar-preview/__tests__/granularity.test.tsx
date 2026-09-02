import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { getSlot } from '~/test-utils/data-slots';
import { CalendarPreview } from '../calendar-preview';

const MONTH = new Date(2024, 3, 1);
const ALL = ['day', 'month', 'quarter', 'half-year', 'year'] as const;
const lastArg = (fn: { mock: { calls: unknown[][] } }) =>
  fn.mock.calls[fn.mock.calls.length - 1]?.[0];

describe('CalendarPreview.GranularityTabs', () => {
  it('renders nothing when only one granularity is offered', () => {
    const { container } = render(
      <CalendarPreview defaultMonth={MONTH}>
        <CalendarPreview.GranularityTabs />
      </CalendarPreview>
    );
    expect(getSlot(container, 'calendar-preview-granularity')).toBeNull();
  });

  it('renders the design labels in the design order', () => {
    render(
      <CalendarPreview defaultMonth={MONTH} granularities={[...ALL]}>
        <CalendarPreview.GranularityTabs />
      </CalendarPreview>
    );
    expect(screen.getAllByRole('tab').map(t => t.textContent)).toEqual([
      'Day',
      'Month',
      'Quarter',
      'Half-year',
      'Year'
    ]);
  });

  it('keeps the canonical order whatever order the prop gave', () => {
    render(
      <CalendarPreview
        defaultMonth={MONTH}
        granularities={['year', 'day', 'quarter']}
      >
        <CalendarPreview.GranularityTabs />
      </CalendarPreview>
    );
    expect(screen.getAllByRole('tab').map(t => t.textContent)).toEqual([
      'Day',
      'Quarter',
      'Year'
    ]);
  });

  it('does not clobber Tabs own data-slot', () => {
    const { container } = render(
      <CalendarPreview defaultMonth={MONTH} granularities={['day', 'month']}>
        <CalendarPreview.GranularityTabs />
      </CalendarPreview>
    );
    expect(getSlot(container, 'calendar-preview-granularity')).not.toBeNull();
    expect(getSlot(container, 'tabs')).not.toBeNull();
    expect(container.querySelectorAll('[data-slot="tabs-tab"]')).toHaveLength(
      2
    );
  });

  it('switches granularity and reports it', async () => {
    const user = userEvent.setup();
    const onGranularityChange = vi.fn();
    render(
      <CalendarPreview
        defaultMonth={MONTH}
        granularities={['day', 'month']}
        onGranularityChange={onGranularityChange}
      >
        <CalendarPreview.GranularityTabs />
      </CalendarPreview>
    );

    await user.click(screen.getByRole('tab', { name: 'Month' }));
    expect(lastArg(onGranularityChange)).toBe('month');
    expect(screen.getByRole('tab', { name: 'Month' })).toHaveAttribute(
      'aria-selected',
      'true'
    );
  });

  it('honours a controlled granularity', async () => {
    const user = userEvent.setup();
    const onGranularityChange = vi.fn();
    render(
      <CalendarPreview
        defaultMonth={MONTH}
        granularity='day'
        granularities={['day', 'month']}
        onGranularityChange={onGranularityChange}
      >
        <CalendarPreview.GranularityTabs />
      </CalendarPreview>
    );

    await user.click(screen.getByRole('tab', { name: 'Month' }));
    expect(onGranularityChange).toHaveBeenCalledWith('month');
    // The parent never wrote back, so Day stays selected.
    expect(screen.getByRole('tab', { name: 'Day' })).toHaveAttribute(
      'aria-selected',
      'true'
    );
  });

  it('accepts label overrides', () => {
    render(
      <CalendarPreview
        defaultMonth={MONTH}
        granularities={['day', 'half-year']}
      >
        <CalendarPreview.GranularityTabs labels={{ 'half-year': 'H1 / H2' }} />
      </CalendarPreview>
    );
    expect(screen.getByRole('tab', { name: 'H1 / H2' })).toBeInTheDocument();
  });

  it('disables every tab when the picker is disabled', () => {
    render(
      <CalendarPreview
        defaultMonth={MONTH}
        granularities={['day', 'month']}
        disabled
      >
        <CalendarPreview.GranularityTabs />
      </CalendarPreview>
    );
    for (const tab of screen.getAllByRole('tab')) {
      expect(tab).toHaveAttribute('aria-disabled', 'true');
    }
  });
});

describe('granularity gates the grid', () => {
  it('renders the day grid only for the day granularity', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <CalendarPreview defaultMonth={MONTH} granularities={['day', 'month']}>
        <CalendarPreview.GranularityTabs />
        <CalendarPreview.Grid />
      </CalendarPreview>
    );

    expect(getSlot(container, 'calendar-preview-grid')).not.toBeNull();

    await user.click(screen.getByRole('tab', { name: 'Month' }));
    // `.MonthGrid` covers the rest; showing the day grid under a Month tab
    // would be a lie about what is selectable.
    expect(getSlot(container, 'calendar-preview-grid')).toBeNull();

    await user.click(screen.getByRole('tab', { name: 'Day' }));
    expect(getSlot(container, 'calendar-preview-grid')).not.toBeNull();
  });

  it('defaultGranularity picks the starting tab', () => {
    const { container } = render(
      <CalendarPreview
        defaultMonth={MONTH}
        granularities={['day', 'month']}
        defaultGranularity='month'
      >
        <CalendarPreview.GranularityTabs />
        <CalendarPreview.Grid />
      </CalendarPreview>
    );
    expect(screen.getByRole('tab', { name: 'Month' })).toHaveAttribute(
      'aria-selected',
      'true'
    );
    expect(getSlot(container, 'calendar-preview-grid')).toBeNull();
  });
});

/*
 * Moved here from `regressions.test.tsx`, which grouped fixes by the audit
 * pass that found them. The assertions are unchanged; each now sits with the
 * behaviour it guards.
 */
describe('regressions', () => {
  it('hides the nav outside the day granularity, as the design does', () => {
    const { container } = render(
      <CalendarPreview
        defaultMonth={new Date(2024, 3, 1)}
        granularities={['day', 'year']}
        defaultGranularity='year'
      >
        <CalendarPreview.Nav />
      </CalendarPreview>
    );
    expect(getSlot(container, 'calendar-preview-nav')).toBeNull();
  });

  it('never renders a tab strip with nothing selected', () => {
    render(
      <CalendarPreview
        defaultMonth={new Date(2024, 3, 1)}
        defaultGranularity='month'
      >
        <CalendarPreview.GranularityTabs />
      </CalendarPreview>
    );
    // granularities defaults to the active granularity, so a lone tab is not
    // worth showing at all.
    expect(screen.queryAllByRole('tab')).toHaveLength(0);
  });
});
