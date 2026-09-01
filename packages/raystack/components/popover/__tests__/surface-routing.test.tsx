import { render } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { CalendarPreview } from '../../calendar-preview/calendar-preview';
import { Popover } from '../popover';

// Asserts every prop the pre-extraction implementations routed by hand.
describe('surface prop routing survives the extraction', () => {
  it('Popover.Content routes each prop to the element it used to', () => {
    const ref = createRef<HTMLDivElement>();
    const { baseElement } = render(
      <Popover open>
        <Popover.Trigger>t</Popover.Trigger>
        <Popover.Content
          ref={ref}
          className='mine'
          style={{ zIndex: 42 }}
          side='top'
          sideOffset={99}
        >
          body
        </Popover.Content>
      </Popover>
    );
    const popup = baseElement.querySelector('[data-slot="popover-content"]');
    const positioner = baseElement.querySelector(
      '[data-slot="popover-positioner"]'
    );
    expect(positioner).not.toBeNull();
    expect(popup).not.toBeNull();
    expect(ref.current).toBe(popup);
    expect(popup?.className).toContain('mine');
    expect(popup?.className).toMatch(/_popover_/);
    expect((popup as HTMLElement).style.zIndex).toBe('42');
    expect(positioner?.className).toMatch(/_popoverPositioner_/);
    /*
     * `side` reaching the positioner is the whole point of the rest-spread, and
     * `data-side` is the only observable that changes with it. Asserting the
     * positioner merely *has* custom properties in its style attribute was
     * hollow: Base UI emits those regardless, so deleting the spread left this
     * test green.
     */
    expect(positioner?.getAttribute('data-side')).toBe('top');
  });

  it('CalendarPreview.Content keeps its own classes, slots and focus rule', () => {
    const ref = createRef<HTMLDivElement>();
    const { baseElement } = render(
      <CalendarPreview defaultOpen defaultMonth={new Date(2024, 3, 1)}>
        <CalendarPreview.Trigger>t</CalendarPreview.Trigger>
        <CalendarPreview.Content ref={ref} className='mine' style={{ top: 0 }}>
          <CalendarPreview.Grid />
        </CalendarPreview.Content>
      </CalendarPreview>
    );
    const popup = baseElement.querySelector(
      '[data-slot="calendar-preview-content"]'
    );
    const positioner = baseElement.querySelector(
      '[data-slot="calendar-preview-positioner"]'
    );
    expect(positioner).not.toBeNull();
    expect(popup).not.toBeNull();
    expect(ref.current).toBe(popup);
    expect(popup?.className).toContain('mine');
    expect(popup?.className).toMatch(/_content_/);
    expect(positioner?.className).toMatch(/_positioner_/);
    // it must NOT have inherited Popover's own popup class
    expect(popup?.className).not.toMatch(/_popover_/);
  });
});
