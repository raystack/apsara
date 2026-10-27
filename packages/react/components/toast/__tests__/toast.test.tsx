import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useEffect, useRef } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import tooltipStyles from '../../tooltip/tooltip.module.css';
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

    it('renders one Notifications region', () => {
      renderWithProvider();
      expect(
        screen.getAllByRole('region', { name: 'Notifications' })
      ).toHaveLength(1);
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

    it('accepts a function that receives the current toast', async () => {
      let id: string;
      act(() => {
        id = toastManager.add({ title: 'Count 1' });
      });
      expect(await screen.findByText('Count 1')).toBeInTheDocument();

      act(() => {
        toastManager.update(id!, prev => ({
          title: `${prev.title} + 1`,
          leadingIcon: <svg data-testid='fn-icon' />
        }));
      });

      await waitFor(() => {
        expect(screen.getByText('Count 1 + 1')).toBeInTheDocument();
        expect(screen.getByTestId('fn-icon')).toBeInTheDocument();
      });
    });

    it('updates in place when add() gets an existing id', async () => {
      act(() => {
        toastManager.add({ id: 'upload', title: 'Uploading' });
      });
      expect(await screen.findByText('Uploading')).toBeInTheDocument();

      let id: string;
      act(() => {
        id = toastManager.add({ id: 'upload', title: 'Uploaded' });
      });

      await waitFor(() => {
        expect(screen.getByText('Uploaded')).toBeInTheDocument();
      });
      expect(id!).toBe('upload');
      expect(screen.queryByText('Uploading')).not.toBeInTheDocument();
      expect(screen.getAllByText('Uploaded')).toHaveLength(1);
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

    it('restores the default icon when update() sets leadingIcon to undefined', async () => {
      let id: string;
      act(() => {
        id = toastManager.add({
          title: 'Custom',
          leadingIcon: <svg data-testid='custom-icon' />
        });
      });
      expect(await screen.findByTestId('custom-icon')).toBeInTheDocument();

      act(() => {
        toastManager.update(id!, () => ({ leadingIcon: undefined }));
      });

      await waitFor(() => {
        expect(screen.queryByTestId('custom-icon')).not.toBeInTheDocument();
      });
      const toast = screen.getByText('Custom').closest('[data-slot="toast"]');
      expect(
        toast?.querySelector('[data-slot="toast-leading-icon"]')
      ).toBeInTheDocument();
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

    it('renders an anchored toast like a tooltip, with only its title', async () => {
      const { manager, anchor } = renderWithAnchor();
      act(() => {
        manager.add({
          title: 'Copied',
          description: 'The link is on your clipboard',
          type: 'success',
          positionerProps: { anchor, side: 'bottom' }
        });
      });
      const toastEl = (await screen.findByText('Copied')).closest(
        '[data-slot="toast"]'
      );
      const positioner = toastEl?.closest('[data-slot="toast-positioner"]');
      expect(positioner).toHaveAttribute('data-side', 'bottom');
      expect(
        toastEl?.closest('[data-slot="toast-anchored-viewport"]')
      ).toBeInTheDocument();
      expect(toastEl).toHaveClass(tooltipStyles.content);
      expect(toastEl?.textContent).toBe('Copied');
      expect(
        toastEl?.querySelector('[data-slot="toast-arrow"]')
      ).not.toBeInTheDocument();
    });

    it('keeps the anchor when an update changes the placement', async () => {
      const { manager, anchor } = renderWithAnchor();
      let id: string;
      act(() => {
        id = manager.add({ title: 'Copied', positionerProps: { anchor } });
      });
      await screen.findByText('Copied');
      let placement: unknown;
      act(() => {
        manager.update(id!, { positionerProps: { side: 'bottom' } });
        manager.update(id!, prev => {
          placement = prev.positionerProps;
          return {};
        });
      });
      expect(placement).toEqual({ anchor, side: 'bottom' });
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

    it('stacks a toast whose anchor is null', async () => {
      const { manager } = renderWithAnchor();
      act(() => {
        manager.add({ title: 'Saved', positionerProps: { anchor: null } });
      });
      const toastEl = (await screen.findByText('Saved')).closest(
        '[data-slot="toast"]'
      );
      expect(
        toastEl?.closest('[data-slot="toast-viewport"]')
      ).toBeInTheDocument();
      expect(
        toastEl?.closest('[data-slot="toast-positioner"]')
      ).not.toBeInTheDocument();
    });

    it('updates an anchored toast', async () => {
      const { manager, anchor } = renderWithAnchor();
      let id: string;
      act(() => {
        id = manager.add({ title: 'Copying', positionerProps: { anchor } });
      });
      await screen.findByText('Copying');
      act(() => {
        manager.update(id!, { title: 'Copied' });
      });
      const toastEl = await screen.findByText('Copied');
      expect(
        toastEl.closest('[data-slot="toast-positioner"]')
      ).toBeInTheDocument();
    });

    it('keeps a promise toast anchored when it resolves', async () => {
      const { manager, anchor } = renderWithAnchor();
      act(() => {
        manager.promise(Promise.resolve(), {
          loading: { title: 'Copying', positionerProps: { anchor } },
          success: { title: 'Copied' },
          error: { title: 'Failed' }
        });
      });
      const toastEl = await screen.findByText('Copied');
      expect(
        toastEl.closest('[data-slot="toast-positioner"]')
      ).toBeInTheDocument();
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

    it('routes anchored toasts from useToastManager in a mount effect', async () => {
      function CopyOnMount() {
        const ref = useRef<HTMLButtonElement>(null);
        const { add } = useToastManager();
        useEffect(() => {
          add({ title: 'Copied', positionerProps: { anchor: ref.current } });
        }, [add]);
        return (
          <button ref={ref} type='button'>
            Copy
          </button>
        );
      }
      render(
        <Toast.Provider toastManager={Toast.createToastManager()}>
          <CopyOnMount />
        </Toast.Provider>
      );
      const toastEl = await screen.findByText('Copied');
      expect(
        toastEl.closest('[data-slot="toast-positioner"]')
      ).toBeInTheDocument();
    });
  });

  describe('useToastManager()', () => {
    it('keeps add the same when the toast list changes', async () => {
      let runs = 0;
      function WelcomeOnMount() {
        const { add } = useToastManager();
        useEffect(() => {
          runs += 1;
          add({ title: 'Welcome' });
        }, [add]);
        return null;
      }
      render(
        <Toast.Provider toastManager={Toast.createToastManager()}>
          <WelcomeOnMount />
        </Toast.Provider>
      );
      expect(await screen.findByText('Welcome')).toBeInTheDocument();
      expect(runs).toBe(1);
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
