import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectSlots } from '~/test-utils/data-slots';
import { Message } from '../message';

describe('Message data-slot contract', () => {
  it('exposes slots for every rendered part', () => {
    const { container } = render(
      <Message.Group>
        <Message>
          <Message.Avatar>A</Message.Avatar>
          <Message.Header>Ana</Message.Header>
          <Message.Content>
            <Message.Bubble>Hello</Message.Bubble>
          </Message.Content>
          <Message.Footer>1:52</Message.Footer>
          <Message.Actions>
            <button type='button'>Copy</button>
          </Message.Actions>
        </Message>
      </Message.Group>
    );
    expectSlots(container, [
      'message-group',
      'message',
      'message-avatar',
      'message-header',
      'message-content',
      'message-bubble',
      'message-footer',
      'message-actions'
    ]);
  });

  it('puts the bubble slot on the surface for every variant', () => {
    for (const variant of ['solid', 'outline', 'ghost'] as const) {
      const { container, unmount } = render(
        <Message.Bubble variant={variant}>Hello</Message.Bubble>
      );
      expect(
        container.querySelector('[data-slot="message-bubble"]')
      ).not.toBeNull();
      unmount();
    }
  });
});
