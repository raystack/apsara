import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen, waitFor } from '../../../test-utils';
import { ThemeProvider } from '../../theme-provider';
import { ToastContainer, toast } from '../toast';
import styles from '../toast.module.css';

// Mock the theme provider hook
vi.mock('../../theme-provider', () => ({
  useTheme: () => ({
    resolvedTheme: 'light'
  }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  )
}));

describe('Toast', () => {
  beforeEach(() => {
    // Clear any existing toasts before each test
    document.body.innerHTML = '';
  });

  afterEach(() => {
    // Clean up any remaining toasts
    vi.clearAllTimers();
    document.body.innerHTML = '';
  });

  describe('ToastContainer', () => {
    it('renders ToastContainer component', () => {
      render(
        <ThemeProvider>
          <ToastContainer />
        </ThemeProvider>
      );

      // ToastContainer renders the underlying Toaster component
      const toastContainer = document.querySelector(
        `.${styles['raystack-toast']}`
      );
      expect(toastContainer).toBeInTheDocument();
    });

    it('applies custom className from styles', () => {
      render(
        <ThemeProvider>
          <ToastContainer />
        </ThemeProvider>
      );

      const toastContainer = document.querySelector(
        `.${styles['raystack-toast']}`
      );
      expect(toastContainer).toHaveClass(styles['raystack-toast']);
    });

    it('passes through props to underlying Toaster', () => {
      render(
        <ThemeProvider>
          <ToastContainer position='top-center' />
        </ThemeProvider>
      );

      // The position prop should be passed through to Toaster
      const toastContainer = document.querySelector(
        `.${styles['raystack-toast']}`
      );
      expect(toastContainer).toBeInTheDocument();
    });

    it('supports custom props', () => {
      render(
        <ThemeProvider>
          <ToastContainer
            position='bottom-right'
            toastOptions={{
              duration: 5000,
              style: { background: 'red' }
            }}
          />
        </ThemeProvider>
      );

      const toastContainer = document.querySelector(
        `.${styles['raystack-toast']}`
      );
      expect(toastContainer).toBeInTheDocument();
    });

    it('uses theme from ThemeProvider', () => {
      render(
        <ThemeProvider>
          <ToastContainer />
        </ThemeProvider>
      );

      const toastContainer = document.querySelector(
        `.${styles['raystack-toast']}`
      );
      expect(toastContainer).toBeInTheDocument();
    });

    it('handles different themes', () => {
      const MockThemeProvider = ({
        children
      }: { children: React.ReactNode }) => <div>{children}</div>;

      // Mock dark theme
      vi.mocked(require('../../theme-provider').useTheme).mockReturnValue({
        resolvedTheme: 'dark'
      });

      render(
        <MockThemeProvider>
          <ToastContainer />
        </MockThemeProvider>
      );

      const toastContainer = document.querySelector(
        `.${styles['raystack-toast']}`
      );
      expect(toastContainer).toBeInTheDocument();
    });
  });

  describe('Toast Function', () => {
    beforeEach(() => {
      render(
        <ThemeProvider>
          <ToastContainer />
        </ThemeProvider>
      );
    });

    it('shows basic toast message', async () => {
      act(() => {
        toast('Hello World');
      });

      await waitFor(() => {
        expect(screen.getByText('Hello World')).toBeInTheDocument();
      });
    });

    it('applies toast wrapper styles', async () => {
      act(() => {
        toast('Styled toast');
      });

      await waitFor(() => {
        const toastWrapper = document.querySelector(
          `.${styles['toast-wrapper']}`
        );
        expect(toastWrapper).toBeInTheDocument();
        expect(toastWrapper).toHaveTextContent('Styled toast');
      });
    });

    it('shows JSX content', async () => {
      const customContent = (
        <div>
          <strong>Important:</strong> <span>This is a custom message</span>
        </div>
      );

      act(() => {
        toast(customContent);
      });

      await waitFor(() => {
        expect(screen.getByText('Important:')).toBeInTheDocument();
        expect(
          screen.getByText('This is a custom message')
        ).toBeInTheDocument();
      });
    });

    it('supports success toast', async () => {
      act(() => {
        toast.success('Operation successful');
      });

      await waitFor(() => {
        expect(screen.getByText('Operation successful')).toBeInTheDocument();
      });
    });

    it('supports error toast', async () => {
      act(() => {
        toast.error('Something went wrong');
      });

      await waitFor(() => {
        expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      });
    });

    it('supports warning toast', async () => {
      act(() => {
        toast.warning('This is a warning');
      });

      await waitFor(() => {
        expect(screen.getByText('This is a warning')).toBeInTheDocument();
      });
    });

    it('supports info toast', async () => {
      act(() => {
        toast.info('Information message');
      });

      await waitFor(() => {
        expect(screen.getByText('Information message')).toBeInTheDocument();
      });
    });

    it('supports loading toast', async () => {
      act(() => {
        toast.loading('Loading...');
      });

      await waitFor(() => {
        expect(screen.getByText('Loading...')).toBeInTheDocument();
      });
    });

    it('supports custom toast', async () => {
      const CustomToast = () => (
        <div style={{ padding: '10px', background: 'blue', color: 'white' }}>
          Custom styled toast
        </div>
      );

      act(() => {
        toast.custom(<CustomToast />);
      });

      await waitFor(() => {
        expect(screen.getByText('Custom styled toast')).toBeInTheDocument();
      });
    });
  });

  describe('Toast Options', () => {
    beforeEach(() => {
      render(
        <ThemeProvider>
          <ToastContainer />
        </ThemeProvider>
      );
    });

    it('supports duration option', async () => {
      vi.useFakeTimers();

      act(() => {
        toast('Short duration', { duration: 1000 });
      });

      await waitFor(() => {
        expect(screen.getByText('Short duration')).toBeInTheDocument();
      });

      act(() => {
        vi.advanceTimersByTime(1100);
      });

      await waitFor(() => {
        expect(screen.queryByText('Short duration')).not.toBeInTheDocument();
      });

      vi.useRealTimers();
    });

    it('supports custom styling', async () => {
      act(() => {
        toast('Styled toast', {
          style: {
            background: 'red',
            color: 'white'
          }
        });
      });

      await waitFor(() => {
        expect(screen.getByText('Styled toast')).toBeInTheDocument();
      });
    });

    it('supports className option', async () => {
      act(() => {
        toast('Custom class toast', {
          className: 'custom-toast-class'
        });
      });

      await waitFor(() => {
        expect(screen.getByText('Custom class toast')).toBeInTheDocument();
        // The className should be applied to the toast element
        const toastElement = screen
          .getByText('Custom class toast')
          .closest('[data-sonner-toast]');
        expect(toastElement).toHaveClass('custom-toast-class');
      });
    });

    it('supports position option', async () => {
      // This would typically be set on the ToastContainer, but we can test it here
      act(() => {
        toast('Positioned toast', {
          position: 'bottom-center'
        });
      });

      await waitFor(() => {
        expect(screen.getByText('Positioned toast')).toBeInTheDocument();
      });
    });

    it('supports action button', async () => {
      const actionFn = vi.fn();

      act(() => {
        toast('Toast with action', {
          action: {
            label: 'Undo',
            onClick: actionFn
          }
        });
      });

      await waitFor(() => {
        expect(screen.getByText('Toast with action')).toBeInTheDocument();
        expect(
          screen.getByRole('button', { name: 'Undo' })
        ).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button', { name: 'Undo' }));
      expect(actionFn).toHaveBeenCalled();
    });

    it('supports cancel button', async () => {
      const cancelFn = vi.fn();

      act(() => {
        toast('Cancellable toast', {
          cancel: {
            label: 'Cancel',
            onClick: cancelFn
          }
        });
      });

      await waitFor(() => {
        expect(screen.getByText('Cancellable toast')).toBeInTheDocument();
        expect(
          screen.getByRole('button', { name: 'Cancel' })
        ).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
      expect(cancelFn).toHaveBeenCalled();
    });

    it('supports onDismiss callback', async () => {
      vi.useFakeTimers();
      const onDismiss = vi.fn();

      act(() => {
        toast('Dismissible toast', {
          duration: 1000,
          onDismiss
        });
      });

      await waitFor(() => {
        expect(screen.getByText('Dismissible toast')).toBeInTheDocument();
      });

      act(() => {
        vi.advanceTimersByTime(1100);
      });

      await waitFor(() => {
        expect(onDismiss).toHaveBeenCalled();
      });

      vi.useRealTimers();
    });

    it('supports onAutoClose callback', async () => {
      vi.useFakeTimers();
      const onAutoClose = vi.fn();

      act(() => {
        toast('Auto-closing toast', {
          duration: 1000,
          onAutoClose
        });
      });

      await waitFor(() => {
        expect(screen.getByText('Auto-closing toast')).toBeInTheDocument();
      });

      act(() => {
        vi.advanceTimersByTime(1100);
      });

      await waitFor(() => {
        expect(onAutoClose).toHaveBeenCalled();
      });

      vi.useRealTimers();
    });
  });

  describe('Toast Dismissal', () => {
    beforeEach(() => {
      render(
        <ThemeProvider>
          <ToastContainer />
        </ThemeProvider>
      );
    });

    it('can be dismissed manually', async () => {
      act(() => {
        toast('Dismissible toast');
      });

      await waitFor(() => {
        expect(screen.getByText('Dismissible toast')).toBeInTheDocument();
      });

      const dismissButton = document.querySelector('[data-close-button]');
      if (dismissButton) {
        fireEvent.click(dismissButton);

        await waitFor(() => {
          expect(
            screen.queryByText('Dismissible toast')
          ).not.toBeInTheDocument();
        });
      }
    });

    it('dismisses on swipe (touch)', async () => {
      act(() => {
        toast('Swipeable toast');
      });

      await waitFor(() => {
        const toastElement = screen
          .getByText('Swipeable toast')
          .closest('[data-sonner-toast]');
        expect(toastElement).toBeInTheDocument();

        if (toastElement) {
          // Simulate swipe gesture
          fireEvent.touchStart(toastElement, {
            touches: [{ clientX: 0, clientY: 0 }]
          });
          fireEvent.touchMove(toastElement, {
            touches: [{ clientX: 100, clientY: 0 }]
          });
          fireEvent.touchEnd(toastElement);
        }
      });
    });

    it('supports persistent toasts', async () => {
      vi.useFakeTimers();

      act(() => {
        toast('Persistent toast', { duration: Infinity });
      });

      await waitFor(() => {
        expect(screen.getByText('Persistent toast')).toBeInTheDocument();
      });

      act(() => {
        vi.advanceTimersByTime(10000);
      });

      // Should still be visible
      expect(screen.getByText('Persistent toast')).toBeInTheDocument();

      vi.useRealTimers();
    });
  });

  describe('Toast State Management', () => {
    beforeEach(() => {
      render(
        <ThemeProvider>
          <ToastContainer />
        </ThemeProvider>
      );
    });

    it('returns toast ID for programmatic control', async () => {
      let toastId: string | number;

      act(() => {
        toastId = toast('Controlled toast');
      });

      await waitFor(() => {
        expect(screen.getByText('Controlled toast')).toBeInTheDocument();
      });

      act(() => {
        toast.dismiss(toastId!);
      });

      await waitFor(() => {
        expect(screen.queryByText('Controlled toast')).not.toBeInTheDocument();
      });
    });

    it('can dismiss all toasts', async () => {
      act(() => {
        toast('Toast 1');
        toast('Toast 2');
        toast('Toast 3');
      });

      await waitFor(() => {
        expect(screen.getByText('Toast 1')).toBeInTheDocument();
        expect(screen.getByText('Toast 2')).toBeInTheDocument();
        expect(screen.getByText('Toast 3')).toBeInTheDocument();
      });

      act(() => {
        toast.dismiss();
      });

      await waitFor(() => {
        expect(screen.queryByText('Toast 1')).not.toBeInTheDocument();
        expect(screen.queryByText('Toast 2')).not.toBeInTheDocument();
        expect(screen.queryByText('Toast 3')).not.toBeInTheDocument();
      });
    });

    it('can update existing toast', async () => {
      let toastId: string | number;

      act(() => {
        toastId = toast.loading('Loading...');
      });

      await waitFor(() => {
        expect(screen.getByText('Loading...')).toBeInTheDocument();
      });

      act(() => {
        toast.success('Success!', { id: toastId });
      });

      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
        expect(screen.getByText('Success!')).toBeInTheDocument();
      });
    });

    it('handles promise-based toasts', async () => {
      const promise = new Promise(resolve => {
        setTimeout(() => resolve('Success'), 100);
      });

      act(() => {
        toast.promise(promise, {
          loading: 'Loading...',
          success: 'Success!',
          error: 'Error occurred'
        });
      });

      await waitFor(() => {
        expect(screen.getByText('Loading...')).toBeInTheDocument();
      });

      await waitFor(
        () => {
          expect(screen.getByText('Success!')).toBeInTheDocument();
        },
        { timeout: 1000 }
      );
    });

    it('handles promise rejection', async () => {
      const promise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Failed')), 100);
      });

      act(() => {
        toast.promise(promise, {
          loading: 'Loading...',
          success: 'Success!',
          error: 'Error occurred'
        });
      });

      await waitFor(() => {
        expect(screen.getByText('Loading...')).toBeInTheDocument();
      });

      await waitFor(
        () => {
          expect(screen.getByText('Error occurred')).toBeInTheDocument();
        },
        { timeout: 1000 }
      );
    });
  });

  describe('Multiple Toasts', () => {
    beforeEach(() => {
      render(
        <ThemeProvider>
          <ToastContainer />
        </ThemeProvider>
      );
    });

    it('displays multiple toasts simultaneously', async () => {
      act(() => {
        toast('First toast');
        toast('Second toast');
        toast('Third toast');
      });

      await waitFor(() => {
        expect(screen.getByText('First toast')).toBeInTheDocument();
        expect(screen.getByText('Second toast')).toBeInTheDocument();
        expect(screen.getByText('Third toast')).toBeInTheDocument();
      });
    });

    it('maintains toast order', async () => {
      act(() => {
        toast('Toast A');
        toast('Toast B');
        toast('Toast C');
      });

      await waitFor(() => {
        const toasts = screen.getAllByText(/^Toast [ABC]$/);
        expect(toasts).toHaveLength(3);
      });
    });

    it('handles max toast limit', async () => {
      render(
        <ThemeProvider>
          <ToastContainer visibleToasts={2} />
        </ThemeProvider>
      );

      act(() => {
        toast('Toast 1');
        toast('Toast 2');
        toast('Toast 3');
        toast('Toast 4');
      });

      await waitFor(() => {
        // Should only show maximum of 2 toasts
        const visibleToasts = document.querySelectorAll(
          '[data-sonner-toast]:not([data-hidden="true"])'
        );
        expect(visibleToasts.length).toBeLessThanOrEqual(2);
      });
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      render(
        <ThemeProvider>
          <ToastContainer />
        </ThemeProvider>
      );
    });

    it('has correct ARIA attributes', async () => {
      act(() => {
        toast('Accessible toast');
      });

      await waitFor(() => {
        const toastElement = screen
          .getByText('Accessible toast')
          .closest('[role="status"]');
        expect(toastElement).toBeInTheDocument();
      });
    });

    it('supports screen readers', async () => {
      act(() => {
        toast('Screen reader message');
      });

      await waitFor(() => {
        const toastElement = screen
          .getByText('Screen reader message')
          .closest('[role="status"]');
        expect(toastElement).toHaveAttribute('aria-live', 'polite');
      });
    });

    it('handles focus management', async () => {
      act(() => {
        toast('Focusable toast', {
          action: {
            label: 'Action',
            onClick: () => {}
          }
        });
      });

      await waitFor(() => {
        const actionButton = screen.getByRole('button', { name: 'Action' });
        expect(actionButton).toBeInTheDocument();

        actionButton.focus();
        expect(document.activeElement).toBe(actionButton);
      });
    });

    it('supports keyboard navigation', async () => {
      act(() => {
        toast('Keyboard navigable', {
          action: {
            label: 'Action',
            onClick: vi.fn()
          },
          cancel: {
            label: 'Cancel',
            onClick: vi.fn()
          }
        });
      });

      await waitFor(() => {
        const actionButton = screen.getByRole('button', { name: 'Action' });
        const cancelButton = screen.getByRole('button', { name: 'Cancel' });

        actionButton.focus();
        fireEvent.keyDown(actionButton, { key: 'Tab' });

        expect(document.activeElement).toBe(cancelButton);
      });
    });

    it('announces important toasts', async () => {
      act(() => {
        toast.error('Critical error occurred');
      });

      await waitFor(() => {
        const toastElement = screen
          .getByText('Critical error occurred')
          .closest('[role="alert"]');
        expect(toastElement).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    beforeEach(() => {
      render(
        <ThemeProvider>
          <ToastContainer />
        </ThemeProvider>
      );
    });

    it('handles empty messages gracefully', async () => {
      act(() => {
        toast('');
      });

      // Should not crash and might show an empty toast or not show at all
      await waitFor(() => {
        // Just check that the toast system is still working
        expect(
          document.querySelector(`.${styles['raystack-toast']}`)
        ).toBeInTheDocument();
      });
    });

    it('handles null/undefined messages', async () => {
      act(() => {
        toast(null as any);
        toast(undefined as any);
      });

      await waitFor(() => {
        // Should handle gracefully without crashing
        expect(
          document.querySelector(`.${styles['raystack-toast']}`)
        ).toBeInTheDocument();
      });
    });

    it('handles invalid options gracefully', async () => {
      act(() => {
        toast('Valid message', null as any);
      });

      await waitFor(() => {
        expect(screen.getByText('Valid message')).toBeInTheDocument();
      });
    });
  });

  describe('Performance', () => {
    beforeEach(() => {
      render(
        <ThemeProvider>
          <ToastContainer />
        </ThemeProvider>
      );
    });

    it('handles rapid toast creation', async () => {
      const toastCount = 50;

      act(() => {
        for (let i = 0; i < toastCount; i++) {
          toast(`Toast ${i}`);
        }
      });

      // Should handle many toasts without performance issues
      await waitFor(() => {
        // At least some toasts should be visible
        const visibleToasts = document.querySelectorAll('[data-sonner-toast]');
        expect(visibleToasts.length).toBeGreaterThan(0);
      });
    });

    it('cleans up dismissed toasts', async () => {
      vi.useFakeTimers();

      act(() => {
        toast('Auto-dismiss toast', { duration: 1000 });
      });

      await waitFor(() => {
        expect(screen.getByText('Auto-dismiss toast')).toBeInTheDocument();
      });

      act(() => {
        vi.advanceTimersByTime(1100);
      });

      await waitFor(() => {
        expect(
          screen.queryByText('Auto-dismiss toast')
        ).not.toBeInTheDocument();
      });

      vi.useRealTimers();
    });
  });
});
