import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';
import { Dialog } from '../dialog';
import styles from '../dialog.module.css';

const TRIGGER_TEXT = 'Open Dialog';
const DIALOG_TITLE = 'Test Dialog';
const DIALOG_CONTENT = 'This is test dialog content';
const DIALOG_DESCRIPTION = 'This is test dialog description';
const DIALOG_CLOSE = 'Cancel';

const BasicDialog = ({
  open,
  onOpenChange,
  ...props
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}) => (
  <Dialog open={open} onOpenChange={onOpenChange} {...props}>
    <Dialog.Trigger>{TRIGGER_TEXT}</Dialog.Trigger>
    <Dialog.Content>
      <Dialog.Header>
        <Dialog.Title>{DIALOG_TITLE}</Dialog.Title>
        <Dialog.CloseButton />
      </Dialog.Header>
      <Dialog.Body>
        <Dialog.Description>{DIALOG_DESCRIPTION}</Dialog.Description>
        {DIALOG_CONTENT}
      </Dialog.Body>
      <Dialog.Footer>
        <Dialog.Close>{DIALOG_CLOSE}</Dialog.Close>
        <button>Submit</button>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog>
);

function renderAndOpenDialog(Dialog: any) {
  fireEvent.click(render(Dialog).getByText(TRIGGER_TEXT));
}

describe('Dialog', () => {
  describe('Basic Rendering', () => {
    it('renders trigger button', () => {
      render(<BasicDialog />);
      const trigger = screen.getByText(TRIGGER_TEXT);
      expect(trigger).toBeInTheDocument();
    });

    it('does not show dialog content initially', () => {
      render(<BasicDialog />);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(screen.queryByText(DIALOG_TITLE)).not.toBeInTheDocument();
      expect(screen.queryByText(DIALOG_DESCRIPTION)).not.toBeInTheDocument();
    });

    it('shows dialog when trigger is clicked', async () => {
      renderAndOpenDialog(<BasicDialog />);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText(DIALOG_TITLE)).toBeInTheDocument();
        expect(screen.getByText(DIALOG_DESCRIPTION)).toBeInTheDocument();
      });
    });

    it('renders in portal', async () => {
      renderAndOpenDialog(<BasicDialog />);

      await waitFor(() => {
        const dialog = screen.getByRole('dialog');
        expect(dialog.closest('body')).toBe(document.body);
      });
    });
  });

  describe('Overlay', () => {
    it('renders overlay', async () => {
      renderAndOpenDialog(<BasicDialog />);

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
      renderAndOpenDialog(<BasicDialog />);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button', { name: 'Close dialog' }));

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    it('closes when Dialog.Close is clicked', async () => {
      renderAndOpenDialog(<BasicDialog />);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText(DIALOG_CLOSE));

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    it('closes on escape key', async () => {
      renderAndOpenDialog(<BasicDialog />);

      await waitFor(() => {
        const dialog = screen.getByRole('dialog');
        expect(dialog).toBeInTheDocument();

        fireEvent.keyDown(dialog, { key: 'Escape', code: 'Escape' });
      });

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });
  });

  describe('Custom Components', () => {
    it('supports custom header content', async () => {
      render(
        <Dialog>
          <Dialog.Trigger>Open</Dialog.Trigger>
          <Dialog.Content>
            <Dialog.Header className='custom-header'>
              <div>Custom Header Content</div>
              <div>Additional Header Info</div>
            </Dialog.Header>
          </Dialog.Content>
        </Dialog>
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
        <Dialog>
          <Dialog.Trigger>Open</Dialog.Trigger>
          <Dialog.Content>
            <Dialog.Body className='custom-body'>
              <form>
                <input placeholder='Name' />
                <textarea placeholder='Description' />
              </form>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog>
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
        <Dialog>
          <Dialog.Trigger>Open</Dialog.Trigger>
          <Dialog.Content>
            <Dialog.Footer className='custom-footer'>
              <button type='button'>Action 1</button>
              <button type='button'>Action 2</button>
              <button type='submit'>Primary Action</button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog>
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
        <Dialog>
          <Dialog.Trigger>Open Minimal</Dialog.Trigger>
          <Dialog.Content>
            <div>Minimal dialog content</div>
            <button>Close</button>
          </Dialog.Content>
        </Dialog>
      );

      fireEvent.click(screen.getByRole('button', { name: 'Open Minimal' }));

      await waitFor(() => {
        expect(screen.getByText('Minimal dialog content')).toBeInTheDocument();
        expect(
          screen.getByRole('button', { name: 'Close' })
        ).toBeInTheDocument();
      });
    });
  });
});
