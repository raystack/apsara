import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Collapsible } from '../collapsible';
import styles from '../collapsible.module.css';

const TRIGGER_TEXT = 'Toggle content';
const PANEL_TEXT = 'Collapsible panel content';

const BasicCollapsible = (
  props: Partial<Parameters<typeof Collapsible>[0]>
) => (
  <Collapsible {...props}>
    <Collapsible.Trigger>{TRIGGER_TEXT}</Collapsible.Trigger>
    <Collapsible.Panel>{PANEL_TEXT}</Collapsible.Panel>
  </Collapsible>
);

describe('Collapsible', () => {
  describe('Basic Rendering', () => {
    it('renders trigger', () => {
      render(<BasicCollapsible />);

      expect(
        screen.getByRole('button', { name: TRIGGER_TEXT })
      ).toBeInTheDocument();
    });

    it('applies custom className to root', () => {
      render(<BasicCollapsible className='custom-root' data-testid='root' />);

      const root = screen.getByTestId('root');
      expect(root).toHaveClass('custom-root');
    });

    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(
        <Collapsible ref={ref}>
          <Collapsible.Trigger>{TRIGGER_TEXT}</Collapsible.Trigger>
          <Collapsible.Panel>{PANEL_TEXT}</Collapsible.Panel>
        </Collapsible>
      );
      expect(ref).toHaveBeenCalled();
    });
  });

  describe('Open/Close Behavior', () => {
    it('expands and collapses on trigger click', () => {
      render(<BasicCollapsible />);

      const trigger = screen.getByRole('button', { name: TRIGGER_TEXT });

      // Initially closed
      expect(trigger).toHaveAttribute('aria-expanded', 'false');

      // Click to open
      fireEvent.click(trigger);
      expect(trigger).toHaveAttribute('aria-expanded', 'true');

      // Click to close
      fireEvent.click(trigger);
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    it('starts open when defaultOpen is true', () => {
      render(<BasicCollapsible defaultOpen />);

      const trigger = screen.getByRole('button', { name: TRIGGER_TEXT });
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });

    it('supports controlled open state', () => {
      const { rerender } = render(<BasicCollapsible open={false} />);

      const trigger = screen.getByRole('button', { name: TRIGGER_TEXT });
      expect(trigger).toHaveAttribute('aria-expanded', 'false');

      rerender(<BasicCollapsible open={true} />);
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });

    it('calls onOpenChange when toggled', () => {
      const onOpenChange = vi.fn();
      render(<BasicCollapsible onOpenChange={onOpenChange} />);

      const trigger = screen.getByRole('button', { name: TRIGGER_TEXT });

      fireEvent.click(trigger);
      expect(onOpenChange).toHaveBeenCalledWith(true, expect.anything());

      fireEvent.click(trigger);
      expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything());
    });

    it('supports keyboard toggle with Enter', async () => {
      const user = userEvent.setup();
      render(<BasicCollapsible />);

      const trigger = screen.getByRole('button', { name: TRIGGER_TEXT });

      await user.keyboard('{Tab}{Enter}');
      expect(trigger).toHaveAttribute('aria-expanded', 'true');

      await user.keyboard('{Enter}');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    it('supports keyboard toggle with Space', async () => {
      const user = userEvent.setup();
      render(<BasicCollapsible />);

      const trigger = screen.getByRole('button', { name: TRIGGER_TEXT });

      await user.keyboard('{Tab} ');
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });
  });

  describe('Disabled State', () => {
    it('does not toggle when disabled', () => {
      render(<BasicCollapsible disabled />);

      const trigger = screen.getByRole('button', { name: TRIGGER_TEXT });
      expect(trigger).toHaveAttribute('aria-disabled', 'true');

      fireEvent.click(trigger);
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('Trigger', () => {
    it('applies custom className', () => {
      render(
        <Collapsible>
          <Collapsible.Trigger className='custom-trigger' data-testid='trigger'>
            {TRIGGER_TEXT}
          </Collapsible.Trigger>
          <Collapsible.Panel>{PANEL_TEXT}</Collapsible.Panel>
        </Collapsible>
      );

      const trigger = screen.getByTestId('trigger');
      expect(trigger).toHaveClass('custom-trigger');
      expect(trigger).toHaveClass(styles.trigger);
    });

    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(
        <Collapsible>
          <Collapsible.Trigger ref={ref}>{TRIGGER_TEXT}</Collapsible.Trigger>
          <Collapsible.Panel>{PANEL_TEXT}</Collapsible.Panel>
        </Collapsible>
      );
      expect(ref).toHaveBeenCalled();
    });

    it('handles click events', () => {
      const handleClick = vi.fn();
      render(
        <Collapsible>
          <Collapsible.Trigger onClick={handleClick}>
            {TRIGGER_TEXT}
          </Collapsible.Trigger>
          <Collapsible.Panel>{PANEL_TEXT}</Collapsible.Panel>
        </Collapsible>
      );

      fireEvent.click(screen.getByRole('button', { name: TRIGGER_TEXT }));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Panel', () => {
    it('applies custom className', () => {
      render(
        <Collapsible defaultOpen>
          <Collapsible.Trigger>{TRIGGER_TEXT}</Collapsible.Trigger>
          <Collapsible.Panel className='custom-panel' data-testid='panel'>
            {PANEL_TEXT}
          </Collapsible.Panel>
        </Collapsible>
      );

      const panel = screen.getByTestId('panel');
      expect(panel).toHaveClass('custom-panel');
      expect(panel).toHaveClass(styles.panel);
    });

    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(
        <Collapsible defaultOpen>
          <Collapsible.Trigger>{TRIGGER_TEXT}</Collapsible.Trigger>
          <Collapsible.Panel ref={ref}>{PANEL_TEXT}</Collapsible.Panel>
        </Collapsible>
      );
      expect(ref).toHaveBeenCalled();
    });
  });
});
