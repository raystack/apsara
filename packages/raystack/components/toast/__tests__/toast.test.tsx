import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ToastContainer, toast } from '../toast';

describe('Toast', () => {
  beforeEach(() => {
    render(<ToastContainer />);
  });

  describe('ToastContainer', () => {
    it('renders ToastContainer component', () => {
      expect(screen.getByLabelText('Notifications alt+T')).toBeInTheDocument();
    });
  });

  describe('Toast Function', () => {
    it('shows basic toast message', async () => {
      toast('Hello World');
      expect(await screen.findByText('Hello World')).toBeInTheDocument();
    });

    it('shows JSX content in toast', async () => {
      const jsxContent = <div data-testid='jsx-content'>JSX Content</div>;
      toast(jsxContent);
      expect(await screen.findByTestId('jsx-content')).toBeInTheDocument();
    });

    const toastTypes = [
      'success',
      'error',
      'warning',
      'info',
      'loading'
    ] as const;
    toastTypes.forEach(type => {
      it(`supports ${type} toast`, async () => {
        toast[type]('Success message');
        expect(await screen.findByText('Success message')).toBeInTheDocument();
      });
    });

    it('supports custom toast with options', async () => {
      const customOptions = {
        duration: 5000,
        description: 'Custom description'
      };

      toast('Custom toast', customOptions);
      expect(await screen.findByText('Custom toast')).toBeInTheDocument();
    });

    it('supports promise-based toast', async () => {
      const promise = new Promise(resolve => {
        setTimeout(() => resolve('Promise resolved'), 100);
      });

      toast.promise(promise, {
        loading: 'Loading...',
        success: 'Success!',
        error: 'Error!'
      });

      expect(await screen.findByText('Loading...')).toBeInTheDocument();

      await waitFor(
        () => {
          expect(screen.getByText('Success!')).toBeInTheDocument();
        },
        { timeout: 200 }
      );
    });

    it('supports dismiss functionality', async () => {
      const toastId = toast('Dismissible toast');
      expect(await screen.findByText('Dismissible toast')).toBeInTheDocument();

      toast.dismiss(toastId);

      await waitFor(() => {
        expect(screen.queryByText('Dismissible toast')).not.toBeInTheDocument();
      });
    });

    it('supports dismissAll functionality', async () => {
      toast('First toast');
      toast('Second toast');

      expect(await screen.findByText('First toast')).toBeInTheDocument();
      expect(await screen.findByText('Second toast')).toBeInTheDocument();

      // Dismiss all toasts by calling dismiss without ID
      toast.dismiss();

      await waitFor(() => {
        expect(screen.queryByText('First toast')).not.toBeInTheDocument();
        expect(screen.queryByText('Second toast')).not.toBeInTheDocument();
      });
    });

    it('handles multiple toasts simultaneously', async () => {
      toast('First toast');
      toast('Second toast');
      toast('Third toast');

      expect(await screen.findByText('First toast')).toBeInTheDocument();
      expect(await screen.findByText('Second toast')).toBeInTheDocument();
      expect(await screen.findByText('Third toast')).toBeInTheDocument();
    });

    it('supports custom action buttons', async () => {
      toast('Toast with action', {
        action: {
          label: 'Undo',
          onClick: () => console.log('Undo clicked')
        }
      });

      expect(await screen.findByText('Toast with action')).toBeInTheDocument();
      expect(await screen.findByText('Undo')).toBeInTheDocument();
    });

    it('supports custom duration', async () => {
      const shortDuration = 100;
      toast('Short duration toast', { duration: shortDuration });

      expect(
        await screen.findByText('Short duration toast')
      ).toBeInTheDocument();

      await waitFor(
        () => {
          expect(
            screen.queryByText('Short duration toast')
          ).not.toBeInTheDocument();
        },
        { timeout: 500 }
      );
    });

    it('supports custom className', async () => {
      const customClass = 'custom-toast-class';
      toast('Custom class toast', { className: customClass });

      expect(await screen.findByText('Custom class toast')).toBeInTheDocument();
    });

    it('supports custom style', async () => {
      const customStyle = { backgroundColor: 'red' };
      toast('Custom style toast', { style: customStyle });

      expect(await screen.findByText('Custom style toast')).toBeInTheDocument();
    });

    it('supports onDismiss callback', async () => {
      const onDismiss = vi.fn();
      toast('Callback toast', { onDismiss });

      expect(await screen.findByText('Callback toast')).toBeInTheDocument();

      // Dismiss the toast
      toast.dismiss();

      await waitFor(() => {
        expect(onDismiss).toHaveBeenCalled();
      });
    });

    it('supports onAutoClose callback', async () => {
      const onAutoClose = vi.fn();
      toast('Auto close toast', {
        duration: 100,
        onAutoClose
      });

      expect(await screen.findByText('Auto close toast')).toBeInTheDocument();

      await waitFor(
        () => {
          expect(onAutoClose).toHaveBeenCalled();
        },
        { timeout: 200 }
      );
    });
  });
});
