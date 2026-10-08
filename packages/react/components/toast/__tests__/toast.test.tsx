import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Toast, toastManager, useToastManager } from '../toast';

const renderWithProvider = (
  props?: Partial<React.ComponentProps<typeof Toast.Provider>>
) => {
  return render(
    <Toast.Provider {...props}>
      <div>App content</div>
    </Toast.Provider>
  );
};

describe('Toast', () => {
  describe('Toast.Provider', () => {
    it('renders provider with children', () => {
      renderWithProvider();
      expect(screen.getByText('App content')).toBeInTheDocument();
    });
  });

  describe('toastManager.add()', () => {
    beforeEach(() => {
      renderWithProvider();
    });

    it('shows basic toast with title', async () => {
      act(() => {
        toastManager.add({ title: 'Hello World' });
      });
      expect(await screen.findByText('Hello World')).toBeInTheDocument();
    });

    it('shows toast with title and description', async () => {
      act(() => {
        toastManager.add({
          title: 'Toast Title',
          description: 'Toast description text'
        });
      });
      expect(await screen.findByText('Toast Title')).toBeInTheDocument();
      expect(
        await screen.findByText('Toast description text')
      ).toBeInTheDocument();
    });

    const toastTypes = [
      'success',
      'error',
      'warning',
      'info',
      'loading'
    ] as const;

    toastTypes.forEach(type => {
      it(`supports ${type} type`, async () => {
        act(() => {
          toastManager.add({ title: `${type} message`, type });
        });
        const toastEl = await screen.findByText(`${type} message`);
        expect(toastEl).toBeInTheDocument();
        expect(toastEl.closest(`[data-type="${type}"]`)).toBeInTheDocument();
      });
    });
  });

  describe('toastManager.close()', () => {
    beforeEach(() => {
      renderWithProvider();
    });

    it('closes a specific toast by id', async () => {
      let id: string;
      act(() => {
        id = toastManager.add({ title: 'Dismissible toast' });
      });
      expect(await screen.findByText('Dismissible toast')).toBeInTheDocument();

      act(() => {
        toastManager.close(id!);
      });

      await waitFor(() => {
        expect(screen.queryByText('Dismissible toast')).not.toBeInTheDocument();
      });
    });
  });

  describe('toastManager.update()', () => {
    beforeEach(() => {
      renderWithProvider();
    });

    it('updates an existing toast', async () => {
      let id: string;
      act(() => {
        id = toastManager.add({ title: 'Original title' });
      });
      expect(await screen.findByText('Original title')).toBeInTheDocument();

      act(() => {
        toastManager.update(id!, { title: 'Updated title' });
      });

      await waitFor(() => {
        expect(screen.getByText('Updated title')).toBeInTheDocument();
      });
    });
  });

  describe('toastManager.promise()', () => {
    beforeEach(() => {
      renderWithProvider();
    });

    it('shows loading then success on resolution', async () => {
      const promise = new Promise(resolve =>
        setTimeout(() => resolve('ok'), 50)
      );

      act(() => {
        toastManager.promise(promise, {
          loading: 'Loading...',
          success: 'Success!',
          error: 'Error!'
        });
      });

      expect(await screen.findByText('Loading...')).toBeInTheDocument();

      await waitFor(
        () => {
          expect(screen.getByText('Success!')).toBeInTheDocument();
        },
        { timeout: 200 }
      );
    });

    it('shows loading then error on rejection', async () => {
      const promise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('fail')), 50)
      );

      let result: Promise<unknown>;
      act(() => {
        result = toastManager.promise(promise, {
          loading: 'Loading...',
          success: 'Success!',
          error: 'Error!'
        });
      });

      expect(await screen.findByText('Loading...')).toBeInTheDocument();

      // Catch the rejection to prevent unhandled promise rejection
      await result!.catch(() => undefined);

      await waitFor(
        () => {
          expect(screen.getByText('Error!')).toBeInTheDocument();
        },
        { timeout: 200 }
      );
    });
  });

  describe('Toast close button', () => {
    beforeEach(() => {
      renderWithProvider();
    });

    it('renders close button and dismisses toast on click', async () => {
      const user = userEvent.setup();

      act(() => {
        toastManager.add({ title: 'Closable toast' });
      });

      const closeBtn = await screen.findByLabelText('Close toast');
      expect(closeBtn).toBeInTheDocument();

      await user.click(closeBtn);

      await waitFor(() => {
        expect(screen.queryByText('Closable toast')).not.toBeInTheDocument();
      });
    });
  });

  describe('Toast action button', () => {
    beforeEach(() => {
      renderWithProvider();
    });

    it('renders action button from actionProps', async () => {
      const onClick = vi.fn();

      act(() => {
        toastManager.add({
          title: 'With Action',
          actionProps: { children: 'Undo', onClick }
        });
      });

      expect(await screen.findByText('Undo')).toBeInTheDocument();
    });
  });

  describe('Toast leadingIcon', () => {
    beforeEach(() => {
      renderWithProvider();
    });

    it('renders leadingIcon when provided', async () => {
      act(() => {
        toastManager.add({
          title: 'With icon',
          leadingIcon: <svg data-testid='leading-icon' />
        });
      });

      expect(await screen.findByText('With icon')).toBeInTheDocument();
      expect(screen.getByTestId('leading-icon')).toBeInTheDocument();
    });

    it('does not render leading-icon slot when leadingIcon is omitted', async () => {
      act(() => {
        toastManager.add({ title: 'No icon' });
      });

      expect(await screen.findByText('No icon')).toBeInTheDocument();
      expect(screen.queryByTestId('leading-icon')).not.toBeInTheDocument();
    });

    it('renders no icon when leadingIcon is explicitly null, even with a type default', async () => {
      act(() => {
        toastManager.add({
          title: 'No icon success',
          type: 'success',
          leadingIcon: null
        });
      });

      const toastEl = await screen.findByText('No icon success');
      const root = toastEl.closest('[data-type="success"]');
      expect(root).toBeInTheDocument();
      // The leading-icon wrapper (the only aria-hidden span in the toast) should not render.
      expect(root!.querySelector('[aria-hidden="true"]')).toBeNull();
    });

    it('forwards leadingIcon through update()', async () => {
      let id: string;
      act(() => {
        id = toastManager.add({ title: 'Initial' });
      });
      expect(await screen.findByText('Initial')).toBeInTheDocument();

      act(() => {
        toastManager.update(id!, {
          title: 'Updated',
          leadingIcon: <svg data-testid='updated-icon' />
        });
      });

      await waitFor(() => {
        expect(screen.getByText('Updated')).toBeInTheDocument();
        expect(screen.getByTestId('updated-icon')).toBeInTheDocument();
      });
    });
  });

  describe('Multiple toasts', () => {
    beforeEach(() => {
      renderWithProvider();
    });

    it('shows multiple toasts simultaneously', async () => {
      act(() => {
        toastManager.add({ title: 'First toast' });
        toastManager.add({ title: 'Second toast' });
        toastManager.add({ title: 'Third toast' });
      });

      expect(await screen.findByText('First toast')).toBeInTheDocument();
      expect(await screen.findByText('Second toast')).toBeInTheDocument();
      expect(await screen.findByText('Third toast')).toBeInTheDocument();
    });
  });

  describe('Anchored toasts', () => {
    const renderWithAnchor = () => {
      const manager = Toast.createToastManager();
      render(
        <Toast.Provider toastManager={manager}>
          <button type='button'>Copy</button>
        </Toast.Provider>
      );
      return { manager, anchor: screen.getByText('Copy') };
    };

    it('renders a toast with an anchor in a positioner with an arrow', async () => {
      const { manager, anchor } = renderWithAnchor();
      act(() => {
        manager.add({
          title: 'Copied',
          positionerProps: { anchor, side: 'bottom' }
        });
      });
      const toastEl = (await screen.findByText('Copied')).closest(
        '[data-slot="toast"]'
      );
      const positioner = toastEl?.closest('[data-slot="toast-positioner"]');
      expect(positioner).toHaveAttribute('data-side', 'bottom');
      expect(
        toastEl?.querySelector('[data-slot="toast-arrow"]')
      ).toBeInTheDocument();
      expect(
        toastEl?.closest('[data-slot="toast-anchored-viewport"]')
      ).toBeInTheDocument();
    });

    it('keeps toasts without an anchor in the stacked viewport', async () => {
      const { manager, anchor } = renderWithAnchor();
      act(() => {
        manager.add({ title: 'Anchored', positionerProps: { anchor } });
        manager.add({ title: 'Stacked' });
      });
      const stacked = (await screen.findByText('Stacked')).closest(
        '[data-slot="toast"]'
      );
      expect(stacked).toHaveAttribute('data-position', 'bottom-right');
      // The anchored toast does not count toward the stack.
      expect(
        (stacked as HTMLElement).style.getPropertyValue('--toast-index')
      ).toBe('0');
      expect(
        stacked?.closest('[data-slot="toast-positioner"]')
      ).not.toBeInTheDocument();
      expect(
        stacked?.querySelector('[data-slot="toast-arrow"]')
      ).not.toBeInTheDocument();
      expect(stacked?.closest('[data-slot="toast-viewport"]')).not.toBeNull();
    });

    it('closes an anchored toast by id', async () => {
      const { manager, anchor } = renderWithAnchor();
      const onClose = vi.fn();
      let id: string;
      act(() => {
        id = manager.add({
          title: 'Copied',
          positionerProps: { anchor },
          onClose
        });
      });
      await screen.findByText('Copied');
      act(() => {
        manager.close(id!);
      });
      await waitFor(() => {
        expect(onClose).toHaveBeenCalled();
      });
    });

    it('routes anchored toasts from useToastManager', async () => {
      function CopyButton() {
        const { add } = useToastManager();
        return (
          <button
            type='button'
            onClick={event =>
              add({
                title: 'Copied',
                positionerProps: { anchor: event.currentTarget }
              })
            }
          >
            Copy
          </button>
        );
      }
      render(
        <Toast.Provider toastManager={Toast.createToastManager()}>
          <CopyButton />
        </Toast.Provider>
      );
      await userEvent.click(screen.getByText('Copy'));
      const toastEl = await screen.findByText('Copied');
      expect(
        toastEl.closest('[data-slot="toast-positioner"]')
      ).toBeInTheDocument();
    });
  });

  describe('onClose callback', () => {
    beforeEach(() => {
      renderWithProvider();
    });

    it('fires onClose when toast is closed', async () => {
      const onClose = vi.fn();
      let id: string;

      act(() => {
        id = toastManager.add({ title: 'Callback toast', onClose });
      });

      expect(await screen.findByText('Callback toast')).toBeInTheDocument();

      act(() => {
        toastManager.close(id!);
      });

      await waitFor(() => {
        expect(onClose).toHaveBeenCalled();
      });
    });
  });
});
