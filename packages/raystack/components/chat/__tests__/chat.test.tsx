import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Chat } from '../chat';
import styles from '../chat.module.css';
import { type ChatMessagesActions, useChatMessages } from '../chat-context';

// Base UI's ScrollArea calls viewport.getAnimations() on scroll, which jsdom
// does not implement. Polyfilled here (per-file) rather than globally: an
// Element-wide polyfill changes how Base UI popups close in other suites.
if (typeof Element.prototype.getAnimations !== 'function') {
  Element.prototype.getAnimations = () => [];
}

describe('Chat', () => {
  describe('Chat.Item', () => {
    it('stamps the message id as a data attribute', () => {
      render(
        <Chat.Messages>
          <Chat.Item messageId='m1'>hello</Chat.Item>
        </Chat.Messages>
      );
      expect(screen.getByText('hello')).toHaveAttribute(
        'data-message-id',
        'm1'
      );
    });

    it('renders with the item class', () => {
      render(<Chat.Item data-testid='item'>hello</Chat.Item>);
      expect(screen.getByTestId('item')).toHaveClass(styles.item);
    });

    it('renders outside Chat.Messages without registering', () => {
      render(<Chat.Item messageId='m1'>standalone</Chat.Item>);
      expect(screen.getByText('standalone')).toBeInTheDocument();
    });

    it('forwards ref', () => {
      const ref = createRef<HTMLDivElement>();
      render(<Chat.Item ref={ref}>hi</Chat.Item>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('Chat.Separator', () => {
    it('renders its children', () => {
      render(<Chat.Separator>Today 1:52 AM</Chat.Separator>);
      expect(screen.getByText('Today 1:52 AM')).toBeInTheDocument();
    });
  });

  describe('Chat.Composer', () => {
    it('renders its children and applies custom className', () => {
      render(
        <Chat.Composer data-testid='composer' className='custom'>
          <textarea placeholder='Reply…' />
        </Chat.Composer>
      );
      expect(screen.getByPlaceholderText('Reply…')).toBeInTheDocument();
      expect(screen.getByTestId('composer')).toHaveClass('custom');
    });
  });

  describe('Chat.Attachment', () => {
    it('renders title and description', () => {
      render(<Chat.Attachment title='spec.pdf' description='1.2 MB' />);
      expect(screen.getByText('spec.pdf')).toBeInTheDocument();
      expect(screen.getByText('1.2 MB')).toBeInTheDocument();
    });

    it('reflects the state as a data attribute', () => {
      const { container, rerender } = render(
        <Chat.Attachment title='spec.pdf' />
      );
      expect(container.firstElementChild).toHaveAttribute('data-state', 'done');
      rerender(<Chat.Attachment title='spec.pdf' state='uploading' />);
      expect(container.firstElementChild).toHaveAttribute(
        'data-state',
        'uploading'
      );
    });

    it('shows a remove button only when onRemove is provided', async () => {
      const onRemove = vi.fn();
      const user = userEvent.setup();
      const { rerender } = render(<Chat.Attachment title='spec.pdf' />);
      expect(
        screen.queryByRole('button', { name: 'Remove attachment' })
      ).not.toBeInTheDocument();

      rerender(<Chat.Attachment title='spec.pdf' onRemove={onRemove} />);
      await user.click(
        screen.getByRole('button', { name: 'Remove attachment' })
      );
      expect(onRemove).toHaveBeenCalledTimes(1);
    });
  });

  describe('Chat.Messages', () => {
    it('renders children inside an accessible log', () => {
      render(
        <Chat.Messages>
          <Chat.Item>hello</Chat.Item>
        </Chat.Messages>
      );
      const log = screen.getByRole('log', { name: 'Conversation' });
      expect(log).toBeInTheDocument();
      expect(screen.getByText('hello')).toBeInTheDocument();
    });

    it('supports a custom aria-label', () => {
      render(<Chat.Messages aria-label='Support thread' />);
      expect(
        screen.getByRole('log', { name: 'Support thread' })
      ).toBeInTheDocument();
    });

    it('renders the jump button and scrolls to bottom on click', async () => {
      const user = userEvent.setup();
      render(
        <Chat.Messages>
          <Chat.Item>hello</Chat.Item>
          <Chat.JumpButton data-testid='jump' />
        </Chat.Messages>
      );
      // jsdom reports zero scroll metrics, so the reader counts as at-bottom.
      const jump = screen.getByTestId('jump');
      expect(jump).toHaveAttribute('tabindex', '-1');
      await user.click(jump);
    });

    it('exposes scroll commands through actionsRef', () => {
      const actionsRef = createRef<ChatMessagesActions>();
      render(
        <Chat.Messages actionsRef={actionsRef}>
          <Chat.Item messageId='m1'>hello</Chat.Item>
        </Chat.Messages>
      );
      expect(actionsRef.current).not.toBeNull();
      expect(() => {
        actionsRef.current?.scrollToBottom('auto');
        actionsRef.current?.scrollToMessage('m1', { behavior: 'auto' });
        actionsRef.current?.scrollToMessage('missing');
      }).not.toThrow();
    });

    it('provides state and commands via useChatMessages', () => {
      const seen: { atBottom?: boolean; visible?: string[] } = {};
      const Probe = () => {
        const { atBottom, visibleMessageIds, scrollToBottom } =
          useChatMessages();
        seen.atBottom = atBottom;
        seen.visible = visibleMessageIds;
        expect(typeof scrollToBottom).toBe('function');
        return null;
      };
      render(
        <Chat.Messages>
          <Probe />
        </Chat.Messages>
      );
      expect(seen.atBottom).toBe(true);
      expect(seen.visible).toEqual([]);
    });

    it('throws when the hook is used outside Chat.Messages', () => {
      const spy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => undefined);
      const Probe = () => {
        useChatMessages();
        return null;
      };
      expect(() => render(<Probe />)).toThrow(
        /must be used within <Chat.Messages>/
      );
      spy.mockRestore();
    });
  });

  describe('Chat root', () => {
    it('renders a column container', () => {
      render(<Chat data-testid='chat'>content</Chat>);
      expect(screen.getByTestId('chat')).toHaveClass(styles.chat);
    });
  });
});
