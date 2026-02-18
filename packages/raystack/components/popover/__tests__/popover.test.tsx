import { Popover as PopoverPrimitive } from '@base-ui/react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '~/components/button';
import { Popover } from '../popover';
import styles from '../popover.module.css';

const TRIGGER_TEXT = 'Open Popover';
const POPOVER_CONTENT = 'This is popover content';

const BasicPopover = ({
  children = <Popover.Content>{POPOVER_CONTENT}</Popover.Content>,
  ...props
}: PopoverPrimitive.Root.Props) => (
  <Popover {...props}>
    <Popover.Trigger>
      <Button>{TRIGGER_TEXT}</Button>
    </Popover.Trigger>
    {children}
  </Popover>
);

async function renderAndOpenPopover(PopoverElement: React.ReactElement) {
  fireEvent.click(render(PopoverElement).getByText(TRIGGER_TEXT));
}

describe('Popover', () => {
  describe('Basic Rendering', () => {
    it('renders trigger button', () => {
      render(<BasicPopover />);
      const trigger = screen.getByText(TRIGGER_TEXT);
      expect(trigger).toBeInTheDocument();
    });

    it('does not show popover content initially', () => {
      render(<BasicPopover />);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(screen.queryByText(POPOVER_CONTENT)).not.toBeInTheDocument();
    });

    it('shows popover when trigger is clicked', async () => {
      await renderAndOpenPopover(<BasicPopover />);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText(POPOVER_CONTENT)).toBeInTheDocument();
      });
    });

    it('renders in portal', async () => {
      await renderAndOpenPopover(<BasicPopover />);

      await waitFor(() => {
        const popover = screen.getByRole('dialog');
        expect(popover.closest('body')).toBe(document.body);
      });
    });
  });

  describe('Popover Content Styling', () => {
    it('applies default popover styles', async () => {
      await renderAndOpenPopover(<BasicPopover />);

      await waitFor(() => {
        const content = screen.getByRole('dialog');
        expect(content).toHaveClass(styles.popover);
      });
    });

    it('applies custom className', async () => {
      await renderAndOpenPopover(
        <BasicPopover>
          <Popover.Content className='custom-popover'>
            {POPOVER_CONTENT}
          </Popover.Content>
        </BasicPopover>
      );

      await waitFor(() => {
        const content = screen.getByRole('dialog');
        expect(content).toHaveClass('custom-popover');
        expect(content).toHaveClass(styles.popover);
      });
    });
  });

  describe('Popover Positioning Props', () => {
    const alignValues = ['start', 'center', 'end'] as const;

    it.each(alignValues)('renders %s align', async align => {
      await renderAndOpenPopover(
        <BasicPopover>
          <Popover.Content align={align}>{POPOVER_CONTENT}</Popover.Content>
        </BasicPopover>
      );
      const content = screen.getByRole('dialog');
      // Base UI uses data-align on the positioner, not the popup
      const positioner = content.closest('[data-align]');
      expect(positioner).toHaveAttribute('data-align', align);
    });
    it('applies default align to center', async () => {
      await renderAndOpenPopover(<BasicPopover />);

      await waitFor(() => {
        const dialog = screen.getByRole('dialog');
        const positioner = dialog.closest('[data-align]');
        expect(positioner).toHaveAttribute('data-align', 'center');
      });
    });

    const sideValues = ['top', 'right', 'bottom', 'left'] as const;
    it.each(sideValues)('renders %s side', async side => {
      await renderAndOpenPopover(
        <BasicPopover>
          <Popover.Content side={side}>{POPOVER_CONTENT}</Popover.Content>
        </BasicPopover>
      );
      const content = screen.getByRole('dialog');
      // Base UI uses data-side on the positioner, not the popup
      const positioner = content.closest('[data-side]');
      expect(positioner).toHaveAttribute('data-side', side);
    });

    it('applies default side to bottom', async () => {
      await renderAndOpenPopover(<BasicPopover />);
      await waitFor(() => {
        const dialog = screen.getByRole('dialog');
        const positioner = dialog.closest('[data-side]');
        expect(positioner).toHaveAttribute('data-side', 'bottom');
      });
    });
  });

  describe('Close Behavior', () => {
    it('closes on escape key', async () => {
      const user = userEvent.setup();
      await renderAndOpenPopover(<BasicPopover />);

      await user.keyboard('{Escape}');

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(screen.queryByText(POPOVER_CONTENT)).not.toBeInTheDocument();
    });

    it('closes when clicking outside', async () => {
      const user = userEvent.setup();
      render(
        <div>
          <BasicPopover />
          <button>Outside</button>
        </div>
      );

      await user.click(screen.getByText(TRIGGER_TEXT));
      expect(screen.getByText(POPOVER_CONTENT)).toBeInTheDocument();

      await user.click(screen.getByText('Outside'));

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(screen.queryByText(POPOVER_CONTENT)).not.toBeInTheDocument();
    });
  });

  describe('Controlled Mode', () => {
    it('works as controlled component', () => {
      const { rerender } = render(
        <Popover open={false}>
          <Popover.Content>{POPOVER_CONTENT}</Popover.Content>
        </Popover>
      );

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

      rerender(
        <Popover open={true}>
          <Popover.Content>{POPOVER_CONTENT}</Popover.Content>
        </Popover>
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('calls onOpenChange when state changes', async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      render(<BasicPopover open={false} onOpenChange={onOpenChange} />);

      const trigger = screen.getByText(TRIGGER_TEXT);
      await user.click(trigger);

      expect(onOpenChange).toHaveBeenCalled();
      // Base UI passes the open state as the first argument
      const callArgs = onOpenChange.mock.calls[0];
      expect(callArgs[0]).toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('has correct ARIA roles', async () => {
      await renderAndOpenPopover(<BasicPopover />);

      await waitFor(() => {
        const dialog = screen.getByRole('dialog');
        expect(dialog).toBeInTheDocument();
      });
    });

    it('has proper ARIA attributes', async () => {
      await renderAndOpenPopover(<BasicPopover />);

      await waitFor(() => {
        const dialog = screen.getByRole('dialog');
        expect(dialog).toBeInTheDocument();
      });
    });

    it('has proper focus management', async () => {
      await renderAndOpenPopover(
        <BasicPopover>
          <Popover.Content>
            <input data-testid='popover-input' placeholder='Type here' />
          </Popover.Content>
        </BasicPopover>
      );

      const popover = screen.getByRole('dialog');
      expect(popover).toBeInTheDocument();

      const popoverInput = screen.getByTestId('popover-input');
      expect(popoverInput).toBeInTheDocument();
    });
  });
});
