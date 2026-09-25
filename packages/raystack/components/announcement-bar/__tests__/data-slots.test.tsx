import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectSlots, getSlot } from '~/test-utils/data-slots';
import { AnnouncementBar } from '../announcement-bar';

describe('AnnouncementBar data-slot contract', () => {
  it('exposes slots for every rendered part', () => {
    const { container } = render(
      <AnnouncementBar
        text='Announcement'
        leadingIcon={<span>icon</span>}
        actionLabel='Action'
        actionIcon={<span>action-icon</span>}
      />
    );
    expectSlots(container, [
      'announcement-bar',
      'announcement-bar-icon',
      'announcement-bar-text',
      'announcement-bar-action',
      'announcement-bar-action-label',
      'announcement-bar-action-icon'
    ]);
  });

  it('omits icon and action slots when not provided', () => {
    const { container } = render(<AnnouncementBar text='Just text' />);
    expect(getSlot(container, 'announcement-bar-icon')).toBeNull();
    expect(getSlot(container, 'announcement-bar-action')).toBeNull();
    expect(getSlot(container, 'announcement-bar-action-icon')).toBeNull();
  });
});
