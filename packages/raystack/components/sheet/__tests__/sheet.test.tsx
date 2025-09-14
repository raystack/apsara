import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '../../../test-utils';
import { Sheet } from '../sheet';
import styles from '../sheet.module.css';

describe('Sheet', () => {
  describe('Basic Rendering', () => {
    it('renders sheet trigger', () => {
      render(
        <Sheet>
          <Sheet.Trigger>Open Sheet</Sheet.Trigger>
          <Sheet.Content>
            <Sheet.Title>Sheet Title</Sheet.Title>
            <Sheet.Description>Sheet Description</Sheet.Description>
            Content goes here
          </Sheet.Content>
        </Sheet>
      );

      expect(screen.getByText('Open Sheet')).toBeInTheDocument();
    });

    it('opens sheet when trigger is clicked', () => {
      render(
        <Sheet>
          <Sheet.Trigger>Open Sheet</Sheet.Trigger>
          <Sheet.Content>
            <Sheet.Title>Sheet Title</Sheet.Title>
            Sheet content
          </Sheet.Content>
        </Sheet>
      );

      const trigger = screen.getByText('Open Sheet');
      fireEvent.click(trigger);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Sheet content')).toBeInTheDocument();
    });

    it('renders sheet title and description', () => {
      render(
        <Sheet open>
          <Sheet.Content>
            <Sheet.Title>Test Sheet</Sheet.Title>
            <Sheet.Description>This is a test sheet</Sheet.Description>
            Sheet content
          </Sheet.Content>
        </Sheet>
      );

      expect(screen.getByText('Test Sheet')).toBeInTheDocument();
      expect(screen.getByText('This is a test sheet')).toBeInTheDocument();
    });
  });

  describe('Sheet Content', () => {
    it('applies default right side positioning', () => {
      const { container } = render(
        <Sheet open>
          <Sheet.Content>Test content</Sheet.Content>
        </Sheet>
      );

      const content = container.querySelector(`.${styles.sheetContent}`);
      expect(content).toHaveClass(styles['sheetContent-right']);
    });

    it('applies left side positioning', () => {
      const { container } = render(
        <Sheet open>
          <Sheet.Content side='left'>Test content</Sheet.Content>
        </Sheet>
      );

      const content = container.querySelector(`.${styles.sheetContent}`);
      expect(content).toHaveClass(styles['sheetContent-left']);
    });

    it('applies top side positioning', () => {
      const { container } = render(
        <Sheet open>
          <Sheet.Content side='top'>Test content</Sheet.Content>
        </Sheet>
      );

      const content = container.querySelector(`.${styles.sheetContent}`);
      expect(content).toHaveClass(styles['sheetContent-top']);
    });

    it('applies bottom side positioning', () => {
      const { container } = render(
        <Sheet open>
          <Sheet.Content side='bottom'>Test content</Sheet.Content>
        </Sheet>
      );

      const content = container.querySelector(`.${styles.sheetContent}`);
      expect(content).toHaveClass(styles['sheetContent-bottom']);
    });

    it('applies custom className', () => {
      const { container } = render(
        <Sheet open>
          <Sheet.Content className='custom-sheet'>Test content</Sheet.Content>
        </Sheet>
      );

      const content = container.querySelector('.custom-sheet');
      expect(content).toBeInTheDocument();
      expect(content).toHaveClass(styles.sheetContent);
    });
  });

  describe('Close Button', () => {
    it('renders close button when close prop is true', () => {
      render(
        <Sheet open>
          <Sheet.Content close>
            <Sheet.Title>Sheet Title</Sheet.Title>
            Test content
          </Sheet.Content>
        </Sheet>
      );

      expect(screen.getByLabelText('Close sheet')).toBeInTheDocument();
    });

    it('does not render close button when close prop is false', () => {
      render(
        <Sheet open>
          <Sheet.Content close={false}>
            <Sheet.Title>Sheet Title</Sheet.Title>
            Test content
          </Sheet.Content>
        </Sheet>
      );

      expect(screen.queryByLabelText('Close sheet')).not.toBeInTheDocument();
    });

    it('closes sheet when close button is clicked', () => {
      const onOpenChange = vi.fn();
      render(
        <Sheet open onOpenChange={onOpenChange}>
          <Sheet.Content close>
            <Sheet.Title>Sheet Title</Sheet.Title>
            Test content
          </Sheet.Content>
        </Sheet>
      );

      const closeButton = screen.getByLabelText('Close sheet');
      fireEvent.click(closeButton);

      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  describe('Overlay', () => {
    it('renders overlay when sheet is open', () => {
      const { container } = render(
        <Sheet open>
          <Sheet.Content>Test content</Sheet.Content>
        </Sheet>
      );

      const overlay = container.querySelector(`.${styles.overlay}`);
      expect(overlay).toBeInTheDocument();
      expect(overlay).toHaveAttribute('aria-hidden', 'true');
      expect(overlay).toHaveAttribute('role', 'presentation');
    });

    it('closes sheet when overlay is clicked', () => {
      const onOpenChange = vi.fn();
      const { container } = render(
        <Sheet open onOpenChange={onOpenChange}>
          <Sheet.Content>Test content</Sheet.Content>
        </Sheet>
      );

      const overlay = container.querySelector(`.${styles.overlay}`);
      fireEvent.click(overlay);

      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  describe('Controlled Mode', () => {
    it('works as controlled component', () => {
      const { rerender } = render(
        <Sheet open={false}>
          <Sheet.Content>Test content</Sheet.Content>
        </Sheet>
      );

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

      rerender(
        <Sheet open={true}>
          <Sheet.Content>Test content</Sheet.Content>
        </Sheet>
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('calls onOpenChange when state changes', () => {
      const onOpenChange = vi.fn();
      render(
        <Sheet open={false} onOpenChange={onOpenChange}>
          <Sheet.Trigger>Open Sheet</Sheet.Trigger>
          <Sheet.Content>Test content</Sheet.Content>
        </Sheet>
      );

      const trigger = screen.getByText('Open Sheet');
      fireEvent.click(trigger);

      expect(onOpenChange).toHaveBeenCalledWith(true);
    });
  });

  describe('Accessibility', () => {
    it('has correct ARIA roles', () => {
      render(
        <Sheet open>
          <Sheet.Content>
            <Sheet.Title>Accessible Sheet</Sheet.Title>
            Test content
          </Sheet.Content>
        </Sheet>
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeInTheDocument();
      expect(dialog).toHaveAttribute('tabIndex', '-1');
    });

    it('has default ARIA label', () => {
      render(
        <Sheet open>
          <Sheet.Content>Test content</Sheet.Content>
        </Sheet>
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-label', 'Sheet with overlay');
    });

    it('uses custom ARIA label when provided', () => {
      render(
        <Sheet open>
          <Sheet.Content ariaLabel='Custom sheet label'>
            Test content
          </Sheet.Content>
        </Sheet>
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-label', 'Custom sheet label');
    });

    it('handles ARIA description when provided', () => {
      render(
        <Sheet open>
          <Sheet.Content ariaDescription='This sheet contains important information'>
            Test content
          </Sheet.Content>
        </Sheet>
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-describedby', 'sheet with overlay');
      expect(
        screen.getByText('This sheet contains important information')
      ).toBeInTheDocument();
    });

    it('close button has accessible name', () => {
      render(
        <Sheet open>
          <Sheet.Content close>Test content</Sheet.Content>
        </Sheet>
      );

      const closeButton = screen.getByLabelText('Close sheet');
      expect(closeButton).toBeInTheDocument();
    });
  });

  describe('Keyboard Navigation', () => {
    it('closes sheet when Escape is pressed', () => {
      const onOpenChange = vi.fn();
      render(
        <Sheet open onOpenChange={onOpenChange}>
          <Sheet.Content>
            <Sheet.Title>Sheet Title</Sheet.Title>
            Test content
          </Sheet.Content>
        </Sheet>
      );

      const dialog = screen.getByRole('dialog');
      fireEvent.keyDown(dialog, { key: 'Escape' });

      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  describe('Custom Close Component', () => {
    it('renders custom close component', () => {
      render(
        <Sheet open>
          <Sheet.Content>
            <Sheet.Title>Sheet Title</Sheet.Title>
            Test content
            <Sheet.Close>Custom Close</Sheet.Close>
          </Sheet.Content>
        </Sheet>
      );

      expect(screen.getByText('Custom Close')).toBeInTheDocument();
    });

    it('closes sheet when custom close is clicked', () => {
      const onOpenChange = vi.fn();
      render(
        <Sheet open onOpenChange={onOpenChange}>
          <Sheet.Content>
            <Sheet.Title>Sheet Title</Sheet.Title>
            Test content
            <Sheet.Close>Custom Close</Sheet.Close>
          </Sheet.Content>
        </Sheet>
      );

      const customClose = screen.getByText('Custom Close');
      fireEvent.click(customClose);

      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });
});
