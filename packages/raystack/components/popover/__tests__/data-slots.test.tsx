import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import { expectSlots } from '~/test-utils/data-slots';
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
});
