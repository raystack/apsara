import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ChatPanel } from '../chat-panel';

const mockRect = (left: number, top: number, width: number, height: number) =>
  ({
    left,
    top,
    width,
    height,
    right: left + width,
    bottom: top + height,
    x: left,
    y: top,
    toJSON: () => ({})
  }) as DOMRect;

// dnd-kit keeps a click-swallowing capture listener on the document for 50ms
// after a drag ends; wait it out so later tests can click.
const flushDragSuppression = () =>
  new Promise(resolve => setTimeout(resolve, 60));

const BasicChatPanel = (props: Partial<Parameters<typeof ChatPanel>[0]>) => (
  <ChatPanel data-testid='panel' {...props}>
    <ChatPanel.Header data-testid='header'>
      <ChatPanel.Title>Assistant</ChatPanel.Title>
      <ChatPanel.Actions>
        <ChatPanel.MinimizeTrigger />
        <ChatPanel.ExpandTrigger />
      </ChatPanel.Actions>
    </ChatPanel.Header>
    <ChatPanel.Content data-testid='content'>Thread</ChatPanel.Content>
    <ChatPanel.Trigger data-testid='bubble' />
  </ChatPanel>
);

describe('ChatPanel', () => {
  describe('Basic Rendering', () => {
    it('renders docked on the right by default', () => {
      render(<BasicChatPanel />);
      const panel = screen.getByTestId('panel');
      expect(panel).toHaveAttribute('data-mode', 'docked');
      expect(panel).toHaveAttribute('data-side', 'right');
      expect(panel.tagName).toBe('ASIDE');
    });

    it('renders the title as a heading', () => {
      render(<BasicChatPanel />);
      expect(
        screen.getByRole('heading', { name: 'Assistant' })
      ).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<BasicChatPanel className='custom' />);
      expect(screen.getByTestId('panel')).toHaveClass('custom');
    });

    it('respects the side prop', () => {
      render(<BasicChatPanel side='left' />);
      expect(screen.getByTestId('panel')).toHaveAttribute('data-side', 'left');
    });

    it('throws when parts are used outside the root', () => {
      const spy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => undefined);
      expect(() => render(<ChatPanel.Trigger />)).toThrow(
        /must be used within <ChatPanel>/
      );
      spy.mockRestore();
    });
  });

  describe('Mode switching', () => {
    it('minimizes via the MinimizeTrigger and shows the bubble', async () => {
      const onModeChange = vi.fn();
      const user = userEvent.setup();
      render(<BasicChatPanel onModeChange={onModeChange} />);

      expect(screen.queryByTestId('bubble')).not.toBeInTheDocument();

      await user.click(
        screen.getByRole('button', { name: 'Minimize chat panel' })
      );

      expect(onModeChange).toHaveBeenCalledWith('minimized');
      expect(screen.getByTestId('panel')).toHaveAttribute(
        'data-mode',
        'minimized'
      );
      expect(screen.getByTestId('bubble')).toBeInTheDocument();
    });

    it('restores the previous mode from the bubble', async () => {
      const user = userEvent.setup();
      render(<BasicChatPanel defaultMode='floating' />);

      await user.click(
        screen.getByRole('button', { name: 'Minimize chat panel' })
      );
      expect(screen.getByTestId('panel')).toHaveAttribute(
        'data-mode',
        'minimized'
      );

      await user.click(screen.getByRole('button', { name: 'Open chat' }));
      expect(screen.getByTestId('panel')).toHaveAttribute(
        'data-mode',
        'floating'
      );
    });

    it('toggles docked and floating via the ExpandTrigger', async () => {
      const user = userEvent.setup();
      render(<BasicChatPanel />);

      await user.click(
        screen.getByRole('button', { name: 'Pop out chat panel' })
      );
      expect(screen.getByTestId('panel')).toHaveAttribute(
        'data-mode',
        'floating'
      );

      await user.click(screen.getByRole('button', { name: 'Dock chat panel' }));
      expect(screen.getByTestId('panel')).toHaveAttribute(
        'data-mode',
        'docked'
      );
    });

    it('supports controlled mode', () => {
      const { rerender } = render(<BasicChatPanel mode='docked' />);
      expect(screen.getByTestId('panel')).toHaveAttribute(
        'data-mode',
        'docked'
      );

      rerender(<BasicChatPanel mode='minimized' />);
      expect(screen.getByTestId('panel')).toHaveAttribute(
        'data-mode',
        'minimized'
      );
      expect(screen.getByTestId('bubble')).toBeInTheDocument();
    });

    it('does not change mode itself when controlled', async () => {
      const onModeChange = vi.fn();
      const user = userEvent.setup();
      render(<BasicChatPanel mode='docked' onModeChange={onModeChange} />);

      await user.click(
        screen.getByRole('button', { name: 'Minimize chat panel' })
      );
      expect(onModeChange).toHaveBeenCalledWith('minimized');
      // The parent did not update the prop, so the panel stays docked.
      expect(screen.getByTestId('panel')).toHaveAttribute(
        'data-mode',
        'docked'
      );
    });
  });

  describe('Floating mode', () => {
    it('applies the floating size as inline style', () => {
      render(
        <BasicChatPanel
          defaultMode='floating'
          defaultSize={{ width: 420, height: 500 }}
        />
      );
      const panel = screen.getByTestId('panel');
      expect(panel.style.width).toBe('420px');
      expect(panel.style.height).toBe('500px');
    });

    it('applies a provided position as inline style', () => {
      render(
        <BasicChatPanel
          defaultMode='floating'
          defaultPosition={{ x: 40, y: 60 }}
        />
      );
      const panel = screen.getByTestId('panel');
      expect(panel.style.left).toBe('40px');
      expect(panel.style.top).toBe('60px');
    });

    it('moves the window when the header is dragged', async () => {
      const onPositionChange = vi.fn();
      render(
        <BasicChatPanel
          defaultMode='floating'
          defaultPosition={{ x: 100, y: 100 }}
          onPositionChange={onPositionChange}
        />
      );
      // jsdom reports zero rects; give the panel its real geometry.
      screen.getByTestId('panel').getBoundingClientRect = () =>
        mockRect(100, 100, 400, 500);

      // dnd-kit activates on the header and tracks the pointer on the
      // document.
      fireEvent.pointerDown(screen.getByTestId('header'), {
        pointerId: 1,
        button: 0,
        isPrimary: true,
        clientX: 200,
        clientY: 200
      });
      fireEvent.pointerMove(document, {
        pointerId: 1,
        clientX: 240,
        clientY: 170
      });
      fireEvent.pointerUp(document, { pointerId: 1 });
      await flushDragSuppression();

      expect(onPositionChange).toHaveBeenCalled();
      const next =
        onPositionChange.mock.calls[onPositionChange.mock.calls.length - 1][0];
      expect(next).toEqual({ x: 140, y: 70 });
    });

    it('does not start a drag from header buttons', () => {
      const onPositionChange = vi.fn();
      render(
        <BasicChatPanel
          defaultMode='floating'
          defaultPosition={{ x: 100, y: 100 }}
          onPositionChange={onPositionChange}
        />
      );
      const button = screen.getByRole('button', {
        name: 'Minimize chat panel'
      });
      fireEvent.pointerDown(button, {
        pointerId: 1,
        button: 0,
        isPrimary: true,
        clientX: 200,
        clientY: 200
      });
      fireEvent.pointerMove(document, {
        pointerId: 1,
        clientX: 260,
        clientY: 260
      });
      fireEvent.pointerUp(document, { pointerId: 1 });
      expect(onPositionChange).not.toHaveBeenCalled();
    });

    it('does not drag while docked', () => {
      const onPositionChange = vi.fn();
      render(<BasicChatPanel onPositionChange={onPositionChange} />);
      fireEvent.pointerDown(screen.getByTestId('header'), {
        pointerId: 1,
        button: 0,
        isPrimary: true,
        clientX: 10,
        clientY: 10
      });
      fireEvent.pointerMove(document, {
        pointerId: 1,
        clientX: 50,
        clientY: 50
      });
      fireEvent.pointerUp(document, { pointerId: 1 });
      expect(onPositionChange).not.toHaveBeenCalled();
    });

    it('clamps the dragged position to the viewport', async () => {
      const onPositionChange = vi.fn();
      render(
        <BasicChatPanel
          defaultMode='floating'
          defaultPosition={{ x: 100, y: 100 }}
          onPositionChange={onPositionChange}
        />
      );
      screen.getByTestId('panel').getBoundingClientRect = () =>
        mockRect(100, 100, 400, 500);

      fireEvent.pointerDown(screen.getByTestId('header'), {
        pointerId: 1,
        button: 0,
        isPrimary: true,
        clientX: 200,
        clientY: 200
      });
      fireEvent.pointerMove(document, {
        pointerId: 1,
        clientX: -5000,
        clientY: -5000
      });
      fireEvent.pointerUp(document, { pointerId: 1 });
      await flushDragSuppression();

      const next =
        onPositionChange.mock.calls[onPositionChange.mock.calls.length - 1][0];
      expect(next).toEqual({ x: 0, y: 0 });
    });

    it('clamps the dragged position to the dragBoundary element', async () => {
      const onPositionChange = vi.fn();
      const boundary = document.createElement('div');
      boundary.getBoundingClientRect = () => mockRect(50, 60, 750, 640);

      render(
        <BasicChatPanel
          defaultMode='floating'
          defaultPosition={{ x: 100, y: 100 }}
          onPositionChange={onPositionChange}
          dragBoundary={{ current: boundary }}
        />
      );
      screen.getByTestId('panel').getBoundingClientRect = () =>
        mockRect(100, 100, 400, 500);

      fireEvent.pointerDown(screen.getByTestId('header'), {
        pointerId: 1,
        button: 0,
        isPrimary: true,
        clientX: 200,
        clientY: 200
      });
      fireEvent.pointerMove(document, {
        pointerId: 1,
        clientX: 5000,
        clientY: 5000
      });
      fireEvent.pointerUp(document, { pointerId: 1 });
      await flushDragSuppression();

      const next =
        onPositionChange.mock.calls[onPositionChange.mock.calls.length - 1][0];
      // Right edge: 50 + 750 - 400 wide = 400. Bottom edge keeps the header
      // reachable: 60 + 640 - 48 = 652.
      expect(next).toEqual({ x: 400, y: 652 });
    });

    it('renders no resize handles while docked', () => {
      const { container } = render(<BasicChatPanel />);
      expect(
        container.querySelectorAll('[class*="resize-handle"]').length
      ).toBe(0);
    });

    it('renders eight resize handles while floating', () => {
      const { container } = render(<BasicChatPanel defaultMode='floating' />);
      expect(
        container.querySelectorAll('[class*="resize-handle"]').length
      ).toBe(8);
    });

    it('resizes from the south-east corner', () => {
      const onSizeChange = vi.fn();
      const { container } = render(
        <BasicChatPanel
          defaultMode='floating'
          defaultSize={{ width: 400, height: 500 }}
          onSizeChange={onSizeChange}
        />
      );
      const handle = container.querySelector(
        '[class*="resize-se"]'
      ) as HTMLElement;
      handle.setPointerCapture = vi.fn();
      handle.releasePointerCapture = vi.fn();
      handle.hasPointerCapture = vi.fn().mockReturnValue(true);

      fireEvent.pointerDown(handle, {
        pointerId: 2,
        button: 0,
        clientX: 400,
        clientY: 500
      });
      fireEvent.pointerMove(handle, {
        pointerId: 2,
        clientX: 360,
        clientY: 460
      });
      fireEvent.pointerUp(handle, { pointerId: 2 });

      expect(onSizeChange).toHaveBeenCalled();
      const next =
        onSizeChange.mock.calls[onSizeChange.mock.calls.length - 1][0];
      // jsdom reports a zero rect, so the delta clamps to the minimum size.
      expect(next.width).toBeGreaterThanOrEqual(280);
      expect(next.height).toBeGreaterThanOrEqual(320);
    });
  });

  describe('Minimized mode', () => {
    it('renders the bubble only while minimized', () => {
      render(<BasicChatPanel defaultMode='minimized' />);
      expect(screen.getByTestId('bubble')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Open chat' })).toBeVisible();
    });

    it('restores to docked when minimized was the initial mode', async () => {
      const user = userEvent.setup();
      render(<BasicChatPanel defaultMode='minimized' />);
      await user.click(screen.getByRole('button', { name: 'Open chat' }));
      expect(screen.getByTestId('panel')).toHaveAttribute(
        'data-mode',
        'docked'
      );
    });
  });
});
