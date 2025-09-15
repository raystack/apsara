import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Popover } from '../popover';
import styles from '../popover.module.css';

describe('Popover', () => {
  describe('Basic Rendering', () => {
    it('renders trigger element', () => {
      render(
        <Popover>
          <Popover.Trigger>Open Popover</Popover.Trigger>
          <Popover.Content>Content</Popover.Content>
        </Popover>
      );
      expect(screen.getByText('Open Popover')).toBeInTheDocument();
    });

    it('does not show content initially', () => {
      render(
        <Popover>
          <Popover.Trigger>Open</Popover.Trigger>
          <Popover.Content>Popover Content</Popover.Content>
        </Popover>
      );
      expect(screen.queryByText('Popover Content')).not.toBeInTheDocument();
    });

    it('shows content when trigger is clicked', async () => {
      render(
        <Popover>
          <Popover.Trigger>Open</Popover.Trigger>
          <Popover.Content>Popover Content</Popover.Content>
        </Popover>
      );

      fireEvent.click(screen.getByText('Open'));

      await waitFor(() => {
        expect(screen.getByText('Popover Content')).toBeInTheDocument();
      });
    });

    // it('hides content when clicking outside', async () => {
    //   render(
    //     <div>
    //       <Popover>
    //         <Popover.Trigger>Open</Popover.Trigger>
    //         <Popover.Content>Content</Popover.Content>
    //       </Popover>
    //       <button>Outside</button>
    //     </div>
    //   );

    //   fireEvent.click(screen.getByText('Open'));
    //   await waitFor(() => {
    //     expect(screen.getByText('Content')).toBeInTheDocument();
    //   });

    //   fireEvent.click(screen.getByText('Outside'));
    //   await waitFor(() => {
    //     expect(screen.queryByText('Content')).not.toBeInTheDocument();
    //   });
    // });
  });

  describe('Popover.Content', () => {
    it('applies popover class', async () => {
      render(
        <Popover defaultOpen>
          <Popover.Trigger>Open</Popover.Trigger>
          <Popover.Content>Content</Popover.Content>
        </Popover>
      );

      await waitFor(() => {
        const content = screen.getByRole('dialog');
        expect(content).toHaveClass(styles.popover);
      });
    });

    it('applies custom className', async () => {
      render(
        <Popover defaultOpen>
          <Popover.Trigger>Open</Popover.Trigger>
          <Popover.Content className='custom-popover'>Content</Popover.Content>
        </Popover>
      );

      await waitFor(() => {
        const content = screen.getByRole('dialog');
        expect(content).toHaveClass('custom-popover');
      });
    });

    it('has dialog role', async () => {
      render(
        <Popover defaultOpen>
          <Popover.Trigger>Open</Popover.Trigger>
          <Popover.Content>Content</Popover.Content>
        </Popover>
      );

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });

    it('has aria-modal attribute', async () => {
      render(
        <Popover defaultOpen>
          <Popover.Trigger>Open</Popover.Trigger>
          <Popover.Content>Content</Popover.Content>
        </Popover>
      );

      await waitFor(() => {
        const dialog = screen.getByRole('dialog');
        expect(dialog).toHaveAttribute('aria-modal', 'true');
      });
    });

    it('has default aria-label', async () => {
      render(
        <Popover defaultOpen>
          <Popover.Trigger>Open</Popover.Trigger>
          <Popover.Content>Content</Popover.Content>
        </Popover>
      );

      await waitFor(() => {
        const dialog = screen.getByRole('dialog');
        expect(dialog).toHaveAttribute('aria-label', 'Popover content');
      });
    });
  });
});
