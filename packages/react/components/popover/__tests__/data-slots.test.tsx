import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectSlots, getSlot } from '~/test-utils/data-slots';
import { Popover } from '../popover';

describe('Popover data-slot contract', () => {
  it('exposes slots for every rendered part', () => {
    render(
      <Popover open>
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Content>Content</Popover.Content>
      </Popover>
    );
    // Popover content portals to the body.
    expectSlots(document.body, ['popover-positioner', 'popover-content']);
  });

  it('exposes the arrow slot with showArrow', () => {
    render(
      <Popover open>
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Content showArrow>Content</Popover.Content>
      </Popover>
    );
    expectSlots(document.body, ['popover-arrow']);
  });

  it('omits the arrow slot by default', () => {
    render(
      <Popover open>
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Content>Content</Popover.Content>
      </Popover>
    );
    expect(getSlot(document.body, 'popover-arrow')).toBeNull();
  });
});
