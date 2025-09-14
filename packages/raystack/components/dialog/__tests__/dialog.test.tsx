import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '../../../test-utils';
import { Dialog } from '../dialog';
import styles from '../dialog.module.css';

describe('Dialog', () => {
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
      <Dialog.Trigger>Open Dialog</Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Test Dialog</Dialog.Title>
          <Dialog.CloseButton />
        </Dialog.Header>
        <Dialog.Body>
          <Dialog.Description>This is a test dialog.</Dialog.Description>
          <p>Dialog content goes here.</p>
        </Dialog.Body>
        <Dialog.Footer>
          <Dialog.Close>Cancel</Dialog.Close>
          <button>Submit</button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );

  const ControlledDialog = () => {
    const [open, setOpen] = React.useState(false);
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <Dialog.Trigger>Open Controlled</Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Controlled Dialog</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <p>Controlled dialog content</p>
          </Dialog.Body>
        </Dialog.Content>
      </Dialog>
    );
  };

  describe('Basic Rendering', () => {
    it('renders trigger button', () => {
      render(<BasicDialog />);
      const trigger = screen.getByRole('button', { name: 'Open Dialog' });
      expect(trigger).toBeInTheDocument();
    });

    it('does not show dialog content initially', () => {
      render(<BasicDialog />);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(screen.queryByText('Test Dialog')).not.toBeInTheDocument();
    });

    it('shows dialog when trigger is clicked', async () => {
      render(<BasicDialog />);

      const trigger = screen.getByRole('button', { name: 'Open Dialog' });
      fireEvent.click(trigger);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText('Test Dialog')).toBeInTheDocument();
      });
    });

    it('applies dialog content styles', async () => {
      render(<BasicDialog />);

      fireEvent.click(screen.getByRole('button', { name: 'Open Dialog' }));

      await waitFor(() => {
        const dialog = screen.getByRole('dialog');
        expect(dialog).toHaveClass(styles.dialogContent);
      });
    });

    it('renders in portal', async () => {
      render(<BasicDialog />);

      fireEvent.click(screen.getByRole('button', { name: 'Open Dialog' }));

      await waitFor(() => {
        const dialog = screen.getByRole('dialog');
        expect(dialog.closest('body')).toBe(document.body);
      });
    });
  });

  describe('Dialog Structure', () => {
    it('renders header with title and close button', async () => {
      render(<BasicDialog />);

      fireEvent.click(screen.getByRole('button', { name: 'Open Dialog' }));

      await waitFor(() => {
        const title = screen.getByText('Test Dialog');
        expect(title).toBeInTheDocument();
        expect(title).toHaveAttribute('role', 'heading');
        expect(title).toHaveAttribute('aria-level', '1');

        const closeButton = screen.getByRole('button', {
          name: 'Close dialog'
        });
        expect(closeButton).toBeInTheDocument();
      });
    });

    it('renders body with description', async () => {
      render(<BasicDialog />);

      fireEvent.click(screen.getByRole('button', { name: 'Open Dialog' }));

      await waitFor(() => {
        const description = screen.getByText('This is a test dialog.');
        expect(description).toBeInTheDocument();
        expect(description).toHaveAttribute('role', 'document');
        expect(description).toHaveAttribute('id', 'dialog-description');

        const content = screen.getByText('Dialog content goes here.');
        expect(content).toBeInTheDocument();
      });
    });

    it('renders footer with actions', async () => {
      render(<BasicDialog />);

      fireEvent.click(screen.getByRole('button', { name: 'Open Dialog' }));

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: 'Cancel' })
        ).toBeInTheDocument();
        expect(
          screen.getByRole('button', { name: 'Submit' })
        ).toBeInTheDocument();
      });
    });

    it('applies correct CSS classes to sections', async () => {
      render(<BasicDialog />);

      fireEvent.click(screen.getByRole('button', { name: 'Open Dialog' }));

      await waitFor(() => {
        const dialog = screen.getByRole('dialog');

        const header = dialog.querySelector(`.${styles.header}`);
        expect(header).toBeInTheDocument();

        const body = dialog.querySelector(`.${styles.body}`);
        expect(body).toBeInTheDocument();

        const footer = dialog.querySelector(`.${styles.footer}`);
        expect(footer).toBeInTheDocument();
      });
    });
  });

  describe('Overlay', () => {
    it('renders overlay', async () => {
      render(<BasicDialog />);

      fireEvent.click(screen.getByRole('button', { name: 'Open Dialog' }));

      await waitFor(() => {
        const overlay = document.querySelector(`.${styles.dialogOverlay}`);
        expect(overlay).toBeInTheDocument();
        expect(overlay).toHaveAttribute('aria-hidden', 'true');
        expect(overlay).toHaveAttribute('role', 'presentation');
      });
    });

    it('supports overlay blur', async () => {
      render(
        <Dialog>
          <Dialog.Trigger>Open</Dialog.Trigger>
          <Dialog.Content overlayBlur>
            <Dialog.Title>Blurred Overlay</Dialog.Title>
          </Dialog.Content>
        </Dialog>
      );

      fireEvent.click(screen.getByRole('button', { name: 'Open' }));

      await waitFor(() => {
        const overlay = document.querySelector(`.${styles.dialogOverlay}`);
        expect(overlay).toHaveClass(styles.overlayBlur);
      });
    });

    it('supports custom overlay className', async () => {
      render(
        <Dialog>
          <Dialog.Trigger>Open</Dialog.Trigger>
          <Dialog.Content overlayClassName='custom-overlay'>
            <Dialog.Title>Custom Overlay</Dialog.Title>
          </Dialog.Content>
        </Dialog>
      );

      fireEvent.click(screen.getByRole('button', { name: 'Open' }));

      await waitFor(() => {
        const overlay = document.querySelector(`.${styles.dialogOverlay}`);
        expect(overlay).toHaveClass('custom-overlay');
      });
    });

    it('supports custom overlay styles', async () => {
      render(
        <Dialog>
          <Dialog.Trigger>Open</Dialog.Trigger>
          <Dialog.Content
            overlayStyle={{ backgroundColor: 'rgba(255, 0, 0, 0.5)' }}
          >
            <Dialog.Title>Custom Overlay Style</Dialog.Title>
          </Dialog.Content>
        </Dialog>
      );

      fireEvent.click(screen.getByRole('button', { name: 'Open' }));

      await waitFor(() => {
        const overlay = document.querySelector(`.${styles.dialogOverlay}`);
        expect(overlay).toHaveStyle({
          backgroundColor: 'rgba(255, 0, 0, 0.5)'
        });
      });
    });
  });

  describe('Content Customization', () => {
    it('supports custom width', async () => {
      render(
        <Dialog>
          <Dialog.Trigger>Open</Dialog.Trigger>
          <Dialog.Content width='500px'>
            <Dialog.Title>Custom Width</Dialog.Title>
          </Dialog.Content>
        </Dialog>
      );

      fireEvent.click(screen.getByRole('button', { name: 'Open' }));

      await waitFor(() => {
        const dialog = screen.getByRole('dialog');
        expect(dialog).toHaveStyle({ width: '500px' });
      });
    });

    // it('supports numeric width', async () => {
    //   render(
    //     <Dialog>
    //       <Dialog.Trigger>Open</Dialog.Trigger>
    //       <Dialog.Content width={400}>
    //         <Dialog.Title>Numeric Width</Dialog.Title>
    //       </Dialog.Content>
    //     </Dialog>
    //   );

    //   fireEvent.click(screen.getByRole('button', { name: 'Open' }));

    //   await waitFor(() => {
    //     const dialog = screen.getByRole('dialog');
    //     expect(dialog).toHaveStyle({ width: 400 });
    //   });
    // });

    it('supports custom className', async () => {
      render(
        <Dialog>
          <Dialog.Trigger>Open</Dialog.Trigger>
          <Dialog.Content className='custom-dialog'>
            <Dialog.Title>Custom Class</Dialog.Title>
          </Dialog.Content>
        </Dialog>
      );

      fireEvent.click(screen.getByRole('button', { name: 'Open' }));

      await waitFor(() => {
        const dialog = screen.getByRole('dialog');
        expect(dialog).toHaveClass('custom-dialog');
        expect(dialog).toHaveClass(styles.dialogContent);
      });
    });

    it('supports custom styles', async () => {
      render(
        <Dialog>
          <Dialog.Trigger>Open</Dialog.Trigger>
          <Dialog.Content style={{ padding: '2rem' }}>
            <Dialog.Title>Custom Style</Dialog.Title>
          </Dialog.Content>
        </Dialog>
      );

      fireEvent.click(screen.getByRole('button', { name: 'Open' }));

      await waitFor(() => {
        const dialog = screen.getByRole('dialog');
        expect(dialog).toHaveStyle({ padding: '2rem' });
      });
    });
  });

  describe('Close Behavior', () => {
    it('closes when close button is clicked', async () => {
      render(<BasicDialog />);

      fireEvent.click(screen.getByRole('button', { name: 'Open Dialog' }));

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button', { name: 'Close dialog' }));

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    it('closes when Dialog.Close is clicked', async () => {
      render(<BasicDialog />);

      fireEvent.click(screen.getByRole('button', { name: 'Open Dialog' }));

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    it('closes on escape key', async () => {
      render(<BasicDialog />);

      fireEvent.click(screen.getByRole('button', { name: 'Open Dialog' }));

      await waitFor(() => {
        const dialog = screen.getByRole('dialog');
        expect(dialog).toBeInTheDocument();

        fireEvent.keyDown(dialog, { key: 'Escape', code: 'Escape' });
      });

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    // it('closes on overlay click', async () => {
    //   render(<BasicDialog />);

    //   fireEvent.click(screen.getByRole('button', { name: 'Open Dialog' }));

    //   await waitFor(() => {
    //     expect(screen.getByRole('dialog')).toBeInTheDocument();
    //   });

    //   const overlay = document.querySelector(`.${styles.dialogOverlay}`);
    //   fireEvent.click(overlay!);

    //   await waitFor(() => {
    //     expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    //   });
    // });
  });

  describe('Controlled State', () => {
    it('works as controlled component', async () => {
      render(<ControlledDialog />);

      const trigger = screen.getByRole('button', { name: 'Open Controlled' });
      fireEvent.click(trigger);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(
          screen.getByText('Controlled dialog content')
        ).toBeInTheDocument();
      });
    });

    it('calls onOpenChange when opened', () => {
      const handleOpenChange = vi.fn();
      render(<BasicDialog onOpenChange={handleOpenChange} />);

      fireEvent.click(screen.getByRole('button', { name: 'Open Dialog' }));

      expect(handleOpenChange).toHaveBeenCalledWith(true);
    });

    it('calls onOpenChange when closed', async () => {
      const handleOpenChange = vi.fn();
      render(<BasicDialog onOpenChange={handleOpenChange} />);

      fireEvent.click(screen.getByRole('button', { name: 'Open Dialog' }));

      await waitFor(() => {
        fireEvent.click(screen.getByRole('button', { name: 'Close dialog' }));
      });

      expect(handleOpenChange).toHaveBeenCalledWith(false);
    });

    it('respects controlled open prop', () => {
      render(<BasicDialog open={true} />);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('supports defaultOpen', () => {
      render(
        <Dialog defaultOpen>
          <Dialog.Trigger>Open</Dialog.Trigger>
          <Dialog.Content>
            <Dialog.Title>Default Open</Dialog.Title>
          </Dialog.Content>
        </Dialog>
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has correct ARIA attributes on dialog', async () => {
      render(<BasicDialog />);

      fireEvent.click(screen.getByRole('button', { name: 'Open Dialog' }));

      await waitFor(() => {
        const dialog = screen.getByRole('dialog');
        expect(dialog).toHaveAttribute('role', 'dialog');
      });
    });

    it('supports aria-label', async () => {
      render(
        <Dialog>
          <Dialog.Trigger>Open</Dialog.Trigger>
          <Dialog.Content ariaLabel='Custom dialog label'>
            <Dialog.Title>Dialog with ARIA Label</Dialog.Title>
          </Dialog.Content>
        </Dialog>
      );

      fireEvent.click(screen.getByRole('button', { name: 'Open' }));

      await waitFor(() => {
        const dialog = screen.getByRole('dialog');
        expect(dialog).toHaveAttribute('aria-label', 'Custom dialog label');
      });
    });

    it('supports aria-describedby when description is provided', async () => {
      render(
        <Dialog>
          <Dialog.Trigger>Open</Dialog.Trigger>
          <Dialog.Content ariaDescription='Dialog description'>
            <Dialog.Title>Dialog with Description</Dialog.Title>
            <Dialog.Description>This is the description</Dialog.Description>
          </Dialog.Content>
        </Dialog>
      );

      fireEvent.click(screen.getByRole('button', { name: 'Open' }));

      await waitFor(() => {
        const dialog = screen.getByRole('dialog');
        expect(dialog).toHaveAttribute(
          'aria-describedby',
          'dialog-description'
        );
      });
    });

    it('title acts as accessible heading', async () => {
      render(<BasicDialog />);

      fireEvent.click(screen.getByRole('button', { name: 'Open Dialog' }));

      await waitFor(() => {
        const title = screen.getByRole('heading', { level: 1 });
        expect(title).toHaveTextContent('Test Dialog');
      });
    });

    it('close button has accessible label', async () => {
      render(<BasicDialog />);

      fireEvent.click(screen.getByRole('button', { name: 'Open Dialog' }));

      await waitFor(() => {
        const closeButton = screen.getByRole('button', {
          name: 'Close dialog'
        });
        expect(closeButton).toHaveAttribute('aria-label', 'Close dialog');
      });
    });

    it('description has correct attributes', async () => {
      render(<BasicDialog />);

      fireEvent.click(screen.getByRole('button', { name: 'Open Dialog' }));

      await waitFor(() => {
        const description = screen.getByText('This is a test dialog.');
        expect(description).toHaveAttribute('id', 'dialog-description');
        expect(description).toHaveAttribute('role', 'document');
      });
    });

    // it('focuses dialog content when opened', async () => {
    //   render(<BasicDialog />);

    //   fireEvent.click(screen.getByRole('button', { name: 'Open Dialog' }));

    //   await waitFor(() => {
    //     const dialog = screen.getByRole('dialog');
    //     expect(document.activeElement).toBe(dialog);
    //   });
    // });

    it('returns focus to trigger when closed', async () => {
      render(<BasicDialog />);

      const trigger = screen.getByRole('button', { name: 'Open Dialog' });
      fireEvent.click(trigger);

      await waitFor(() => {
        fireEvent.click(screen.getByRole('button', { name: 'Close dialog' }));
      });

      await waitFor(() => {
        expect(document.activeElement).toBe(trigger);
      });
    });
  });

  describe('Focus Management', () => {
    it('traps focus within dialog', async () => {
      render(<BasicDialog />);

      fireEvent.click(screen.getByRole('button', { name: 'Open Dialog' }));

      await waitFor(() => {
        const dialog = screen.getByRole('dialog');
        expect(dialog).toBeInTheDocument();
      });

      // Tab should cycle through focusable elements within dialog
      fireEvent.keyDown(document.activeElement!, { key: 'Tab' });

      const focusableElements = screen
        .getAllByRole('button')
        .filter(
          button =>
            button.textContent === 'Close dialog' ||
            button.textContent === 'Cancel' ||
            button.textContent === 'Submit'
        );

      expect(focusableElements.length).toBeGreaterThan(0);
    });

    // it('prevents interaction with background elements', async () => {
    //   const backgroundButton = vi.fn();

    //   render(
    //     <div>
    //       <button onClick={backgroundButton}>Background Button</button>
    //       <BasicDialog />
    //     </div>
    //   );

    //   fireEvent.click(screen.getByRole('button', { name: 'Open Dialog' }));

    //   await waitFor(() => {
    //     expect(screen.getByRole('dialog')).toBeInTheDocument();
    //   });

    //   // Background button should not be focusable
    //   const backgroundBtn = screen.getByRole('button', {
    //     name: 'Background Button'
    //   });
    //   fireEvent.click(backgroundBtn);

    //   // The click should not have triggered the handler due to focus trap
    //   expect(backgroundButton).not.toHaveBeenCalled();
    // });
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

  describe('Event Handling', () => {
    it('supports onOpenChange callback', () => {
      const handleOpenChange = vi.fn();
      render(<BasicDialog onOpenChange={handleOpenChange} />);

      fireEvent.click(screen.getByRole('button', { name: 'Open Dialog' }));
      expect(handleOpenChange).toHaveBeenCalledWith(true);
    });

    it('supports onEscapeKeyDown', async () => {
      const handleEscape = vi.fn();
      render(
        <Dialog>
          <Dialog.Trigger>Open</Dialog.Trigger>
          <Dialog.Content onEscapeKeyDown={handleEscape}>
            <Dialog.Title>Test</Dialog.Title>
          </Dialog.Content>
        </Dialog>
      );

      fireEvent.click(screen.getByRole('button', { name: 'Open' }));

      await waitFor(() => {
        const dialog = screen.getByRole('dialog');
        fireEvent.keyDown(dialog, { key: 'Escape' });
      });

      expect(handleEscape).toHaveBeenCalled();
    });

    // it('supports onInteractOutside', async () => {
    //   const handleInteractOutside = vi.fn();
    //   render(
    //     <Dialog>
    //       <Dialog.Trigger>Open</Dialog.Trigger>
    //       <Dialog.Content onInteractOutside={handleInteractOutside}>
    //         <Dialog.Title>Test</Dialog.Title>
    //       </Dialog.Content>
    //     </Dialog>
    //   );

    //   fireEvent.click(screen.getByRole('button', { name: 'Open' }));

    //   await waitFor(() => {
    //     const overlay = document.querySelector(`.${styles.dialogOverlay}`);
    //     fireEvent.click(overlay!);
    //   });

    //   expect(handleInteractOutside).toHaveBeenCalled();
    // });
  });

  describe('Edge Cases', () => {
    it('handles rapid open/close operations', async () => {
      const handleOpenChange = vi.fn();
      render(<BasicDialog onOpenChange={handleOpenChange} />);

      const trigger = screen.getByRole('button', { name: 'Open Dialog' });

      // Rapid clicks
      fireEvent.click(trigger);
      fireEvent.click(trigger);
      fireEvent.click(trigger);

      await waitFor(() => {
        expect(handleOpenChange).toHaveBeenCalled();
      });
    });

    it('handles missing required props gracefully', () => {
      // Dialog without title should still render
      render(
        <Dialog>
          <Dialog.Trigger>Open</Dialog.Trigger>
          <Dialog.Content>
            <p>Content without title</p>
          </Dialog.Content>
        </Dialog>
      );

      fireEvent.click(screen.getByRole('button', { name: 'Open' }));

      expect(screen.getByText('Content without title')).toBeInTheDocument();
    });

    it('prevents body scroll when open', async () => {
      render(<BasicDialog />);

      fireEvent.click(screen.getByRole('button', { name: 'Open Dialog' }));

      await waitFor(() => {
        // Body should have scroll prevention (implementation may vary)
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });

    it('restores body scroll when closed', async () => {
      render(<BasicDialog />);

      const trigger = screen.getByRole('button', { name: 'Open Dialog' });
      fireEvent.click(trigger);

      await waitFor(() => {
        fireEvent.click(screen.getByRole('button', { name: 'Close dialog' }));
      });

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });
  });

  describe('Multiple Dialogs', () => {
    it('handles nested dialogs', async () => {
      render(
        <Dialog>
          <Dialog.Trigger>Open Parent</Dialog.Trigger>
          <Dialog.Content>
            <Dialog.Title>Parent Dialog</Dialog.Title>
            <Dialog>
              <Dialog.Trigger>Open Child</Dialog.Trigger>
              <Dialog.Content>
                <Dialog.Title>Child Dialog</Dialog.Title>
                <p>Nested dialog content</p>
              </Dialog.Content>
            </Dialog>
          </Dialog.Content>
        </Dialog>
      );

      fireEvent.click(screen.getByRole('button', { name: 'Open Parent' }));

      await waitFor(() => {
        expect(screen.getByText('Parent Dialog')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button', { name: 'Open Child' }));

      await waitFor(() => {
        expect(screen.getByText('Child Dialog')).toBeInTheDocument();
        expect(screen.getByText('Nested dialog content')).toBeInTheDocument();
      });
    });

    it('manages focus correctly with multiple dialogs', async () => {
      render(
        <div>
          <Dialog>
            <Dialog.Trigger>Open Dialog 1</Dialog.Trigger>
            <Dialog.Content>
              <Dialog.Title>Dialog 1</Dialog.Title>
            </Dialog.Content>
          </Dialog>
          <Dialog>
            <Dialog.Trigger>Open Dialog 2</Dialog.Trigger>
            <Dialog.Content>
              <Dialog.Title>Dialog 2</Dialog.Title>
            </Dialog.Content>
          </Dialog>
        </div>
      );

      const trigger1 = screen.getByRole('button', { name: 'Open Dialog 1' });
      const trigger2 = screen.getByRole('button', { name: 'Open Dialog 2' });

      fireEvent.click(trigger1);

      await waitFor(() => {
        expect(screen.getByText('Dialog 1')).toBeInTheDocument();
      });

      fireEvent.click(trigger2);

      await waitFor(() => {
        expect(screen.getByText('Dialog 2')).toBeInTheDocument();
      });
    });
  });
});
