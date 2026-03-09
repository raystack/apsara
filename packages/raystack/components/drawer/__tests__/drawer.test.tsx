import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '~/components/button';
import { Drawer } from '../drawer';
import styles from '../drawer.module.css';

const TRIGGER_TEXT = 'Open Drawer';
const DRAWER_TITLE = 'Test Drawer';
const DRAWER_CONTENT = 'This is test drawer content';
const DRAWER_DESCRIPTION = 'This is test drawer description';

const BasicDrawer = ({
  showCloseButton = true,
  side = 'right' as const,
  ...props
}: {
  showCloseButton?: boolean;
  side?: 'top' | 'right' | 'bottom' | 'left';
} & Record<string, unknown>) => (
  <Drawer side={side} {...props}>
    <Drawer.Trigger>
      <Button>{TRIGGER_TEXT}</Button>
    </Drawer.Trigger>
    <Drawer.Content side={side} showCloseButton={showCloseButton}>
      <Drawer.Header>
        <Drawer.Title>{DRAWER_TITLE}</Drawer.Title>
        <Drawer.Description>{DRAWER_DESCRIPTION}</Drawer.Description>
      </Drawer.Header>
      <Drawer.Body>{DRAWER_CONTENT}</Drawer.Body>
    </Drawer.Content>
  </Drawer>
);

async function renderAndOpenDrawer(DrawerElement: React.ReactElement) {
  fireEvent.click(render(DrawerElement).getByText(TRIGGER_TEXT));
}

describe('Drawer', () => {
  describe('Basic Rendering', () => {
    it('renders trigger button', () => {
      render(<BasicDrawer />);
      const trigger = screen.getByText(TRIGGER_TEXT);
      expect(trigger).toBeInTheDocument();
    });

    it('does not show drawer content initially', () => {
      render(<BasicDrawer />);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(screen.queryByText(DRAWER_TITLE)).not.toBeInTheDocument();
      expect(screen.queryByText(DRAWER_DESCRIPTION)).not.toBeInTheDocument();
    });

    it('shows drawer when trigger is clicked', async () => {
      await renderAndOpenDrawer(<BasicDrawer />);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText(DRAWER_TITLE)).toBeInTheDocument();
        expect(screen.getByText(DRAWER_DESCRIPTION)).toBeInTheDocument();
      });
    });

    it('renders in portal', async () => {
      await renderAndOpenDrawer(<BasicDrawer />);

      await waitFor(() => {
        const drawer = screen.getByRole('dialog');
        expect(drawer.closest('body')).toBe(document.body);
      });
    });
  });

  describe('Overlay', () => {
    it('renders backdrop', async () => {
      await renderAndOpenDrawer(<BasicDrawer />);

      await waitFor(() => {
        const backdrop = document.querySelector(`.${styles.backdrop}`);
        expect(backdrop).toBeInTheDocument();
      });
    });
  });

  describe('Drawer Positioning', () => {
    it('applies default right side positioning', async () => {
      await renderAndOpenDrawer(<BasicDrawer />);

      await waitFor(() => {
        const popup = screen.getByRole('dialog');
        expect(popup).toHaveClass(styles['drawerPopup-right']);
      });
    });

    it('applies left side positioning', async () => {
      const user = userEvent.setup();
      render(<BasicDrawer side='left' />);

      await user.click(screen.getByText(TRIGGER_TEXT));

      await waitFor(() => {
        const popup = screen.getByRole('dialog');
        expect(popup).toHaveClass(styles['drawerPopup-left']);
      });
    });

    it('applies top side positioning', async () => {
      const user = userEvent.setup();
      render(<BasicDrawer side='top' />);

      await user.click(screen.getByText(TRIGGER_TEXT));

      await waitFor(() => {
        const popup = screen.getByRole('dialog');
        expect(popup).toHaveClass(styles['drawerPopup-top']);
      });
    });

    it('applies bottom side positioning', async () => {
      const user = userEvent.setup();
      render(<BasicDrawer side='bottom' />);

      await user.click(screen.getByText(TRIGGER_TEXT));

      await waitFor(() => {
        const popup = screen.getByRole('dialog');
        expect(popup).toHaveClass(styles['drawerPopup-bottom']);
      });
    });

    it('applies custom className', async () => {
      const user = userEvent.setup();
      render(
        <Drawer side='right'>
          <Drawer.Trigger>
            <Button>{TRIGGER_TEXT}</Button>
          </Drawer.Trigger>
          <Drawer.Content className='custom-drawer'>
            <Drawer.Header>
              <Drawer.Title>{DRAWER_TITLE}</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>{DRAWER_CONTENT}</Drawer.Body>
          </Drawer.Content>
        </Drawer>
      );

      await user.click(screen.getByText(TRIGGER_TEXT));

      await waitFor(() => {
        const popup = screen.getByRole('dialog');
        expect(popup).toHaveClass('custom-drawer');
        expect(popup).toHaveClass(styles.drawerPopup);
      });
    });
  });

  describe('Close Behavior', () => {
    it('renders close button when showCloseButton prop is true', async () => {
      await renderAndOpenDrawer(<BasicDrawer showCloseButton />);

      expect(screen.getByLabelText('Close Drawer')).toBeInTheDocument();
    });

    it('does not render close button when showCloseButton prop is false', async () => {
      await renderAndOpenDrawer(<BasicDrawer showCloseButton={false} />);

      await waitFor(() => {
        expect(screen.queryByLabelText('Close Drawer')).not.toBeInTheDocument();
      });
    });

    it('closes drawer when close button is clicked', async () => {
      const user = userEvent.setup();

      await renderAndOpenDrawer(<BasicDrawer showCloseButton />);

      await user.click(screen.getByLabelText('Close Drawer'));

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(screen.queryByText(DRAWER_TITLE)).not.toBeInTheDocument();
      expect(screen.queryByText(DRAWER_DESCRIPTION)).not.toBeInTheDocument();
    });

    it('closes on escape key', async () => {
      const user = userEvent.setup();
      await renderAndOpenDrawer(<BasicDrawer />);

      await user.keyboard('{Escape}');

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(screen.queryByText(DRAWER_TITLE)).not.toBeInTheDocument();
      expect(screen.queryByText(DRAWER_DESCRIPTION)).not.toBeInTheDocument();
    });

    it('closes when backdrop is clicked', async () => {
      const user = userEvent.setup();
      await renderAndOpenDrawer(<BasicDrawer />);

      const backdrop = document.querySelector(`.${styles.backdrop}`);
      await user.click(backdrop!);

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(screen.queryByText(DRAWER_TITLE)).not.toBeInTheDocument();
      expect(screen.queryByText(DRAWER_DESCRIPTION)).not.toBeInTheDocument();
    });
  });

  describe('Controlled Mode', () => {
    it('works as controlled component', () => {
      const { rerender } = render(
        <Drawer open={false} side='right'>
          <Drawer.Content>{DRAWER_CONTENT}</Drawer.Content>
        </Drawer>
      );

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

      rerender(
        <Drawer open={true} side='right'>
          <Drawer.Content>
            <Drawer.Body>{DRAWER_CONTENT}</Drawer.Body>
          </Drawer.Content>
        </Drawer>
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('calls onOpenChange when state changes', async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      render(<BasicDrawer open={false} onOpenChange={onOpenChange} />);

      const trigger = screen.getByText(TRIGGER_TEXT);
      await user.click(trigger);

      expect(onOpenChange).toHaveBeenCalled();
      const callArgs = onOpenChange.mock.calls[0];
      expect(callArgs[0]).toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', async () => {
      await renderAndOpenDrawer(<BasicDrawer />);

      await waitFor(() => {
        const dialog = screen.getByRole('dialog');
        expect(dialog).toBeInTheDocument();
        expect(dialog).toHaveAttribute('aria-label', 'Drawer');
      });
    });
  });
});
