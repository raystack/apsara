import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Toast, toastManager } from '../toast';

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
