import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';
import styles from '../../dialog/dialog.module.css';
import { AlertDialog } from '../alert-dialog';

const TRIGGER_TEXT = 'Open Alert';
const ALERT_TITLE = 'Test Alert';
const ALERT_CONTENT = 'This is test alert content';
const ALERT_DESCRIPTION = 'This is test alert description';
const ALERT_CLOSE = 'Cancel';

const BasicAlertDialog = ({
  open,
  onOpenChange,
  ...props
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}) => (
  <AlertDialog open={open} onOpenChange={onOpenChange} {...props}>
    <AlertDialog.Trigger>{TRIGGER_TEXT}</AlertDialog.Trigger>
    <AlertDialog.Content>
      <AlertDialog.Header>
        <AlertDialog.Title>{ALERT_TITLE}</AlertDialog.Title>
      </AlertDialog.Header>
      <AlertDialog.Body>
        <AlertDialog.Description>{ALERT_DESCRIPTION}</AlertDialog.Description>
        {ALERT_CONTENT}
      </AlertDialog.Body>
      <AlertDialog.Footer>
        <AlertDialog.Close>{ALERT_CLOSE}</AlertDialog.Close>
        <button>Confirm</button>
      </AlertDialog.Footer>
    </AlertDialog.Content>
  </AlertDialog>
);

function renderAndOpenAlertDialog(Dialog: any) {
  fireEvent.click(render(Dialog).getByText(TRIGGER_TEXT));
}

describe('AlertDialog', () => {
  describe('Basic Rendering', () => {
    it('renders trigger button', () => {
      render(<BasicAlertDialog />);
      const trigger = screen.getByText(TRIGGER_TEXT);
      expect(trigger).toBeInTheDocument();
    });

    it('does not show alert dialog content initially', () => {
      render(<BasicAlertDialog />);
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
      expect(screen.queryByText(ALERT_TITLE)).not.toBeInTheDocument();
      expect(screen.queryByText(ALERT_DESCRIPTION)).not.toBeInTheDocument();
    });

    it('shows alert dialog when trigger is clicked', async () => {
      renderAndOpenAlertDialog(<BasicAlertDialog />);

      await waitFor(() => {
        expect(screen.getByRole('alertdialog')).toBeInTheDocument();
        expect(screen.getByText(ALERT_TITLE)).toBeInTheDocument();
        expect(screen.getByText(ALERT_DESCRIPTION)).toBeInTheDocument();
      });
    });

    it('renders in portal', async () => {
      renderAndOpenAlertDialog(<BasicAlertDialog />);

      await waitFor(() => {
        const dialog = screen.getByRole('alertdialog');
        expect(dialog.closest('body')).toBe(document.body);
      });
    });
  });

  describe('Overlay', () => {
    it('renders overlay', async () => {
      renderAndOpenAlertDialog(<BasicAlertDialog />);

      await waitFor(() => {
        const overlay = document.querySelector(`.${styles.dialogOverlay}`);
        expect(overlay).toBeInTheDocument();
        expect(overlay).toHaveAttribute('aria-hidden', 'true');
        expect(overlay).toHaveAttribute('role', 'presentation');
      });
    });
  });

  describe('Close Behavior', () => {
    it('closes when close button is clicked', async () => {
      renderAndOpenAlertDialog(<BasicAlertDialog />);

      await waitFor(() => {
        expect(screen.getByRole('alertdialog')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button', { name: 'Close dialog' }));

      await waitFor(() => {
        expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
      });
    });

    it('closes when AlertDialog.Close is clicked', async () => {
      renderAndOpenAlertDialog(<BasicAlertDialog />);

      await waitFor(() => {
        expect(screen.getByRole('alertdialog')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText(ALERT_CLOSE));

      await waitFor(() => {
        expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
      });
    });

    it('does not close on outside click', async () => {
      renderAndOpenAlertDialog(<BasicAlertDialog />);

      await waitFor(() => {
        expect(screen.getByRole('alertdialog')).toBeInTheDocument();
      });

      const overlay = document.querySelector(`.${styles.dialogOverlay}`);
      expect(overlay).toBeInTheDocument();
      fireEvent.click(overlay!);

      await waitFor(() => {
        expect(screen.getByRole('alertdialog')).toBeInTheDocument();
      });
    });
  });

  describe('Custom Components', () => {
    it('supports custom header content', async () => {
      render(
        <AlertDialog>
          <AlertDialog.Trigger>Open</AlertDialog.Trigger>
          <AlertDialog.Content>
            <AlertDialog.Header className='custom-header'>
              <div>Custom Header Content</div>
              <div>Additional Header Info</div>
            </AlertDialog.Header>
          </AlertDialog.Content>
        </AlertDialog>
      );

      fireEvent.click(screen.getByRole('button', { name: 'Open' }));

      await waitFor(() => {
        expect(screen.getByText('Custom Header Content')).toBeInTheDocument();
        expect(screen.getByText('Additional Header Info')).toBeInTheDocument();

        const header = document.querySelector('.custom-header');
        expect(header).toHaveClass(styles.header);
      });
    });

    it('supports custom body content', async () => {
      render(
        <AlertDialog>
          <AlertDialog.Trigger>Open</AlertDialog.Trigger>
          <AlertDialog.Content>
            <AlertDialog.Body className='custom-body'>
              <form>
                <input placeholder='Name' />
                <textarea placeholder='Description' />
              </form>
            </AlertDialog.Body>
          </AlertDialog.Content>
        </AlertDialog>
      );

      fireEvent.click(screen.getByRole('button', { name: 'Open' }));

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Description')).toBeInTheDocument();

        const body = document.querySelector('.custom-body');
        expect(body).toHaveClass(styles.body);
      });
    });

    it('supports custom footer content', async () => {
      render(
        <AlertDialog>
          <AlertDialog.Trigger>Open</AlertDialog.Trigger>
          <AlertDialog.Content>
            <AlertDialog.Footer className='custom-footer'>
              <button type='button'>Action 1</button>
              <button type='button'>Action 2</button>
              <button type='submit'>Primary Action</button>
            </AlertDialog.Footer>
          </AlertDialog.Content>
        </AlertDialog>
      );

      fireEvent.click(screen.getByRole('button', { name: 'Open' }));

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: 'Action 1' })
        ).toBeInTheDocument();
        expect(
          screen.getByRole('button', { name: 'Action 2' })
        ).toBeInTheDocument();
        expect(
          screen.getByRole('button', { name: 'Primary Action' })
        ).toBeInTheDocument();

        const footer = document.querySelector('.custom-footer');
        expect(footer).toHaveClass(styles.footer);
      });
    });

    it('works without header, body, or footer', async () => {
      render(
        <AlertDialog>
          <AlertDialog.Trigger>Open Minimal</AlertDialog.Trigger>
          <AlertDialog.Content>
            <div>Minimal alert dialog content</div>
            <AlertDialog.Close>Close</AlertDialog.Close>
          </AlertDialog.Content>
        </AlertDialog>
      );

      fireEvent.click(screen.getByRole('button', { name: 'Open Minimal' }));

      await waitFor(() => {
        expect(
          screen.getByText('Minimal alert dialog content')
        ).toBeInTheDocument();
        expect(
          screen.getByRole('button', { name: 'Close' })
        ).toBeInTheDocument();
      });
    });
  });
});
