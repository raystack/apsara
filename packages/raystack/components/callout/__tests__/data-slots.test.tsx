import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectSlots, getSlot } from '~/test-utils/data-slots';
import { Callout } from '../callout';

describe('Callout data-slot contract', () => {
  it('exposes slots for every rendered part', () => {
    const { container } = render(
      <Callout action={<button type='button'>Undo</button>} dismissible>
        This is a message
      </Callout>
    );
    expectSlots(container, [
      'callout-transition',
      'callout-transition-body',
      'callout',
      'callout-container',
      'callout-message-container',
      'callout-icon',
      'callout-message',
      'callout-actions',
      'callout-action',
      'callout-dismiss'
    ]);
  });

  it('omits the icon, action, and dismiss slots when their props are absent', () => {
    const { container } = render(<Callout icon={null}>Plain message</Callout>);
    expect(getSlot(container, 'callout-icon')).toBeNull();
    expect(getSlot(container, 'callout-action')).toBeNull();
    expect(getSlot(container, 'callout-dismiss')).toBeNull();
  });
});
