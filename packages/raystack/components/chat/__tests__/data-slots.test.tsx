import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectSlots, getSlot } from '~/test-utils/data-slots';
import { Chat } from '../chat';

// Base UI's ScrollArea calls viewport.getAnimations() on scroll, which jsdom
// does not implement. Polyfilled here (per-file) rather than globally: an
// Element-wide polyfill changes how Base UI popups close in other suites.
if (typeof Element.prototype.getAnimations !== 'function') {
  Element.prototype.getAnimations = () => [];
}

describe('Chat data-slot contract', () => {
  it('exposes slots for every rendered part', () => {
    const { container } = render(
      <Chat>
        <Chat.Messages>
          <Chat.Separator>Today</Chat.Separator>
          <Chat.Item messageId='m1'>hello</Chat.Item>
          <Chat.JumpButton />
        </Chat.Messages>
        <Chat.Composer>
          <Chat.Attachment title='spec.pdf' onRemove={() => {}} />
          <textarea placeholder='Reply…' />
        </Chat.Composer>
      </Chat>
    );
    expectSlots(container, [
      'chat',
      'chat-messages',
      'chat-messages-viewport',
      'chat-messages-content',
      'chat-messages-scrollbar',
      'chat-separator',
      'chat-item',
      'chat-jump-button',
      'chat-jump-button-icon',
      'chat-composer',
      'chat-attachment',
      'chat-attachment-media',
      'chat-attachment-body',
      'chat-attachment-title',
      'chat-attachment-remove'
    ]);
  });

  it('omits the attachment body and description slots when absent', () => {
    const { container } = render(<Chat.Attachment />);
    expect(getSlot(container, 'chat-attachment-body')).toBeNull();
    expect(getSlot(container, 'chat-attachment-title')).toBeNull();
    expect(getSlot(container, 'chat-attachment-description')).toBeNull();
    expect(getSlot(container, 'chat-attachment-remove')).toBeNull();
  });

  it('omits the jump button icon slot when explicitly hidden', () => {
    const { container } = render(
      <Chat>
        <Chat.Messages>
          <Chat.JumpButton leadingIcon={null} />
        </Chat.Messages>
      </Chat>
    );
    expect(getSlot(container, 'chat-jump-button-icon')).toBeNull();
  });
});
