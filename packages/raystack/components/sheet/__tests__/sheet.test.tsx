import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '~/components/button';
import { Sheet, SheetProps } from '../sheet';
import styles from '../sheet.module.css';

const TRIGGER_TEXT = 'Open Sheet';
const SHEET_TITLE = 'Test Sheet';
const SHEET_CONTENT = 'This is test sheet content';
const SHEET_DESCRIPTION = 'This is test sheet description';

const BasicSheet = ({
  canClose = false,
  ...props
}: SheetProps & { canClose?: boolean }) => (
  <Sheet {...props}>
    <Sheet.Trigger asChild>
      <Button>{TRIGGER_TEXT}</Button>
    </Sheet.Trigger>
    <Sheet.Content close={canClose}>
      <Sheet.Title>{SHEET_TITLE}</Sheet.Title>
      <Sheet.Description>{SHEET_DESCRIPTION}</Sheet.Description>
      {SHEET_CONTENT}
    </Sheet.Content>
  </Sheet>
);

async function renderAndOpenSheet(SheetElement: React.ReactElement) {
  fireEvent.click(render(SheetElement).getByText(TRIGGER_TEXT));
}

describe('Sheet', () => {
  describe('Basic Rendering', () => {
    it('renders trigger button', () => {
      render(<BasicSheet />);
      const trigger = screen.getByText(TRIGGER_TEXT);
      expect(trigger).toBeInTheDocument();
    });

    it('does not show sheet content initially', () => {
      render(<BasicSheet />);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(screen.queryByText(SHEET_TITLE)).not.toBeInTheDocument();
      expect(screen.queryByText(SHEET_DESCRIPTION)).not.toBeInTheDocument();
    });

    it('shows sheet when trigger is clicked', async () => {
      await renderAndOpenSheet(<BasicSheet />);

      await waitFor(() => {
        expect(
          screen.getByRole('dialog', { hidden: true })
        ).toBeInTheDocument();
        expect(screen.getByText(SHEET_TITLE)).toBeInTheDocument();
        expect(screen.getByText(SHEET_DESCRIPTION)).toBeInTheDocument();
      });
    });

    it('renders in portal', async () => {
      await renderAndOpenSheet(<BasicSheet />);

      await waitFor(() => {
        const sheet = screen.getByRole('dialog', { hidden: true });
        expect(sheet.closest('body')).toBe(document.body);
      });
    });
  });

  describe('Overlay', () => {
    it('renders overlay', async () => {
      await renderAndOpenSheet(<BasicSheet />);

      await waitFor(() => {
        const overlay = document.querySelector(`.${styles.overlay}`);
        expect(overlay).toBeInTheDocument();
        expect(overlay).toHaveAttribute('aria-hidden', 'true');
        expect(overlay).toHaveAttribute('role', 'presentation');
      });
    });
  });

  describe('Sheet Positioning', () => {
    it('applies default right side positioning', async () => {
      await renderAndOpenSheet(<BasicSheet />);

      await waitFor(() => {
        const content = screen.getByRole('dialog', { hidden: true });
        expect(content).toHaveClass(styles['sheetContent-right']);
      });
    });

    it('applies left side positioning', async () => {
      const user = userEvent.setup();
      render(
        <Sheet>
          <Sheet.Trigger asChild>
            <Button>{TRIGGER_TEXT}</Button>
          </Sheet.Trigger>
          <Sheet.Content side='left'>
            <Sheet.Title>{SHEET_TITLE}</Sheet.Title>
            {SHEET_CONTENT}
          </Sheet.Content>
        </Sheet>
      );

      await user.click(screen.getByText(TRIGGER_TEXT));

      await waitFor(() => {
        const content = screen.getByRole('dialog', { hidden: true });
        expect(content).toHaveClass(styles['sheetContent-left']);
      });
    });

    it('applies top side positioning', async () => {
      const user = userEvent.setup();
      render(
        <Sheet>
          <Sheet.Trigger asChild>
            <Button>{TRIGGER_TEXT}</Button>
          </Sheet.Trigger>
          <Sheet.Content side='top'>
            <Sheet.Title>{SHEET_TITLE}</Sheet.Title>
            {SHEET_CONTENT}
          </Sheet.Content>
        </Sheet>
      );

      await user.click(screen.getByText(TRIGGER_TEXT));

      await waitFor(() => {
        const content = screen.getByRole('dialog', { hidden: true });
        expect(content).toHaveClass(styles['sheetContent-top']);
      });
    });

    it('applies bottom side positioning', async () => {
      const user = userEvent.setup();
      render(
        <Sheet>
          <Sheet.Trigger asChild>
            <Button>{TRIGGER_TEXT}</Button>
          </Sheet.Trigger>
          <Sheet.Content side='bottom'>
            <Sheet.Title>{SHEET_TITLE}</Sheet.Title>
            {SHEET_CONTENT}
          </Sheet.Content>
        </Sheet>
      );

      await user.click(screen.getByText(TRIGGER_TEXT));

      await waitFor(() => {
        const content = screen.getByRole('dialog', { hidden: true });
        expect(content).toHaveClass(styles['sheetContent-bottom']);
      });
    });

    it('applies custom className', async () => {
      const user = userEvent.setup();
      render(
        <Sheet>
          <Sheet.Trigger asChild>
            <Button>{TRIGGER_TEXT}</Button>
          </Sheet.Trigger>
          <Sheet.Content className='custom-sheet'>
            <Sheet.Title>{SHEET_TITLE}</Sheet.Title>
            {SHEET_CONTENT}
          </Sheet.Content>
        </Sheet>
      );

      await user.click(screen.getByText(TRIGGER_TEXT));

      await waitFor(() => {
        const content = screen.getByRole('dialog', { hidden: true });
        expect(content).toHaveClass('custom-sheet');
        expect(content).toHaveClass(styles.sheetContent);
      });
    });
  });

  describe('Close Behavior', () => {
    it('renders close button when close prop is true', async () => {
      await renderAndOpenSheet(<BasicSheet canClose />);

      expect(screen.getByLabelText('Close')).toBeInTheDocument();
    });

    it('does not render close button when close prop is false', async () => {
      await renderAndOpenSheet(<BasicSheet canClose={false} />);

      await waitFor(() => {
        expect(screen.queryByLabelText('Close')).not.toBeInTheDocument();
      });
    });

    it('closes sheet when close button is clicked', async () => {
      const user = userEvent.setup();

      await renderAndOpenSheet(<BasicSheet canClose />);

      await user.click(screen.getByLabelText('Close'));

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(screen.queryByText(SHEET_TITLE)).not.toBeInTheDocument();
      expect(screen.queryByText(SHEET_DESCRIPTION)).not.toBeInTheDocument();
    });

    it('closes on escape key', async () => {
      const user = userEvent.setup();
      await renderAndOpenSheet(<BasicSheet />);

      await user.keyboard('{Escape}');

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(screen.queryByText(SHEET_TITLE)).not.toBeInTheDocument();
      expect(screen.queryByText(SHEET_DESCRIPTION)).not.toBeInTheDocument();
    });

    it('closes when overlay is clicked', async () => {
      const user = userEvent.setup();
      await renderAndOpenSheet(<BasicSheet />);

      const overlay = document.querySelector(`.${styles.overlay}`);
      await user.click(overlay!);

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(screen.queryByText(SHEET_TITLE)).not.toBeInTheDocument();
      expect(screen.queryByText(SHEET_DESCRIPTION)).not.toBeInTheDocument();
    });
  });

  describe('Controlled Mode', () => {
    it('works as controlled component', () => {
      const { rerender } = render(
        <Sheet open={false}>
          <Sheet.Content>{SHEET_CONTENT}</Sheet.Content>
        </Sheet>
      );

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

      rerender(
        <Sheet open={true}>
          <Sheet.Content>{SHEET_CONTENT}</Sheet.Content>
        </Sheet>
      );

      expect(screen.getByRole('dialog', { hidden: true })).toBeInTheDocument();
    });

    it('calls onOpenChange when state changes', async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      render(<BasicSheet open={false} onOpenChange={onOpenChange} />);

      const trigger = screen.getByText(TRIGGER_TEXT);
      await user.click(trigger);

      expect(onOpenChange).toHaveBeenCalledWith(true);
    });
  });

  describe('Accessibility', () => {
    // it('has correct ARIA roles', async () => {
    //   await renderAndOpenSheet(<BasicSheet />);

    //   await waitFor(() => {
    //     const dialog = screen.getByRole('dialog');
    //     expect(dialog).toBeInTheDocument();
    //     expect(dialog).toHaveAttribute('tabIndex', '-1');
    //   });
    // });

    // it('has default ARIA label', async () => {
    //   await renderAndOpenSheet(<BasicSheet />);

    //   await waitFor(() => {
    //     const dialog = screen.getByRole('dialog', { hidden: true });
    //     expect(dialog).toHaveAttribute('aria-label', 'Sheet with overlay');
    //   });
    // });

    it('uses custom ARIA label when provided', async () => {
      const user = userEvent.setup();
      render(
        <Sheet>
          <Sheet.Trigger asChild>
            <Button>{TRIGGER_TEXT}</Button>
          </Sheet.Trigger>
          <Sheet.Content ariaLabel='Custom sheet label'>
            {SHEET_CONTENT}
          </Sheet.Content>
        </Sheet>
      );

      await user.click(screen.getByText(TRIGGER_TEXT));

      await waitFor(() => {
        const dialog = screen.getByRole('dialog', { hidden: true });
        expect(dialog).toHaveAttribute('aria-label', 'Custom sheet label');
      });
    });

    it('handles ARIA description when provided', async () => {
      const user = userEvent.setup();
      render(
        <Sheet>
          <Sheet.Trigger asChild>
            <Button>{TRIGGER_TEXT}</Button>
          </Sheet.Trigger>
          <Sheet.Content ariaDescription='This sheet contains important information'>
            {SHEET_CONTENT}
          </Sheet.Content>
        </Sheet>
      );

      await user.click(screen.getByText(TRIGGER_TEXT));

      await waitFor(() => {
        const dialog = screen.getByRole('dialog', { hidden: true });
        expect(dialog).toHaveAttribute(
          'aria-describedby',
          'sheet with overlay'
        );
        expect(
          screen.getByText('This sheet contains important information')
        ).toBeInTheDocument();
      });
    });
  });
});
