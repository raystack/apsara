import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectSlots, getAllSlots, getSlot } from '~/test-utils/data-slots';
import { ChatPanel } from '../chat-panel';

describe('ChatPanel data-slot contract', () => {
  it('exposes slots for every rendered part when docked', () => {
    const { container } = render(
      <ChatPanel defaultMode='docked'>
        <ChatPanel.Header>
          <ChatPanel.Title>Assistant</ChatPanel.Title>
          <ChatPanel.Actions>
            <ChatPanel.MinimizeTrigger />
            <ChatPanel.ExpandTrigger />
          </ChatPanel.Actions>
        </ChatPanel.Header>
        <ChatPanel.Content>Thread</ChatPanel.Content>
        <ChatPanel.Trigger />
      </ChatPanel>
    );
    expectSlots(container, [
      'chat-panel',
      'chat-panel-header',
      'chat-panel-title',
      'chat-panel-actions',
      'chat-panel-minimize-trigger',
      'chat-panel-expand-trigger',
      'chat-panel-content'
    ]);
    // Trigger only renders while minimized.
    expect(getSlot(container, 'chat-panel-trigger')).toBeNull();
  });

  it('exposes the trigger slot while minimized', () => {
    const { container } = render(
      <ChatPanel defaultMode='minimized'>
        <ChatPanel.Trigger />
      </ChatPanel>
    );
    expect(getSlot(container, 'chat-panel-trigger')).not.toBeNull();
  });

  it('exposes resize-handle slots while floating', () => {
    const { container } = render(
      <ChatPanel defaultMode='floating' resize='both'>
        <ChatPanel.Content>Thread</ChatPanel.Content>
      </ChatPanel>
    );
    expect(getAllSlots(container, 'chat-panel-resize-handle').length).toBe(8);
  });

  it('omits resize-handle slots when resize is none', () => {
    const { container } = render(
      <ChatPanel defaultMode='floating' resize='none'>
        <ChatPanel.Content>Thread</ChatPanel.Content>
      </ChatPanel>
    );
    expect(getAllSlots(container, 'chat-panel-resize-handle')).toHaveLength(0);
  });
});
