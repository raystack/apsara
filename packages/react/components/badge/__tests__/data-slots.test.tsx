import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectSlots, getSlot } from '~/test-utils/data-slots';
import { Badge } from '../badge';

describe('Badge data-slot contract', () => {
  it('exposes slots for every rendered part', () => {
    const { container } = render(
      <Badge icon={<span>i</span>} screenReaderText='3 unread messages'>
        3
      </Badge>
    );
    expectSlots(container, ['badge', 'badge-icon', 'badge-screen-reader-text']);
  });

  it('omits optional slots when their parts are absent', () => {
    const { container } = render(<Badge>New</Badge>);
    expect(getSlot(container, 'badge')).not.toBeNull();
    expect(getSlot(container, 'badge-icon')).toBeNull();
    expect(getSlot(container, 'badge-screen-reader-text')).toBeNull();
  });
});
