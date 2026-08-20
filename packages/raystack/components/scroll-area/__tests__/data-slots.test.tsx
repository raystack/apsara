import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import { expectSlots } from '~/test-utils/data-slots';
import { ScrollArea } from '../scroll-area';

describe('ScrollArea data-slot contract', () => {
  it('exposes slots for every rendered part', () => {
    const { container } = render(
      <ScrollArea style={{ height: 100 }}>
        <div style={{ height: 500 }}>content</div>
      </ScrollArea>
    );
    // Corner only mounts when Base UI detects overflow on both axes, which
    // jsdom's unmeasured layout never reports — its slot is exercised via
    // source inspection rather than a DOM assertion here.
    expectSlots(container, [
      'scroll-area',
      'scroll-area-viewport',
      'scroll-area-content',
      'scroll-area-scrollbar',
      'scroll-area-thumb'
    ]);
  });
});
