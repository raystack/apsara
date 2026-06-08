import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Callout } from '../callout';
import styles from '../callout.module.css';

describe('Callout', () => {
  describe('Basic Rendering', () => {
    it('renders with children', () => {
      render(<Callout>This is a test message</Callout>);

      expect(screen.getByText('This is a test message')).toBeInTheDocument();
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('renders with custom icon', () => {
      render(
        <Callout icon={<span data-testid='custom-icon'>🔔</span>}>
          Message with custom icon
        </Callout>
      );

      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
      expect(screen.getByText('Message with custom icon')).toBeInTheDocument();
    });

    it('renders without icon when icon is null', () => {
      const { container } = render(
        <Callout icon={null}>Message without icon</Callout>
      );

      expect(
        container.querySelector(`.${styles.icon}`)
      ).not.toBeInTheDocument();
      expect(screen.getByText('Message without icon')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<Callout className='custom-callout'>Test message</Callout>);

      const callout = screen.getByRole('status');
      expect(callout).toHaveClass(styles.callout);
      expect(callout).toHaveClass('custom-callout');
    });

    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(<Callout ref={ref}>Test message</Callout>);
      expect(ref).toHaveBeenCalled();
    });
  });

  describe('Types and Variants', () => {
    const types = [
      'grey',
      'success',
      'alert',
      'gradient',
      'accent',
      'attention',
      'normal'
    ] as const;

    it.each(types)('renders %s type correctly', type => {
      render(<Callout type={type}>Test message</Callout>);

      const callout = screen.getByRole(type === 'alert' ? 'alert' : 'status');
      expect(callout).toHaveClass(styles[`callout-${type}`]);
    });

    it('defaults to grey type', () => {
      render(<Callout>Test message</Callout>);

      const callout = screen.getByRole('status');
      expect(callout).toHaveClass(styles['callout-grey']);
    });

    it('renders outline variant', () => {
      render(<Callout outline>Test message</Callout>);

      const callout = screen.getByRole('status');
      expect(callout).toHaveClass(styles['callout-outline']);
    });

    it('renders high contrast variant', () => {
      render(<Callout highContrast>Test message</Callout>);

      const callout = screen.getByRole('status');
      expect(callout).toHaveClass(styles['callout-high-contrast']);
    });
  });

  describe('Actions and Interactions', () => {
    it('renders action element', () => {
      render(
        <Callout action={<button data-testid='action-button'>Action</button>}>
          Message with action
        </Callout>
      );

      expect(screen.getByTestId('action-button')).toBeInTheDocument();
      expect(screen.getByText('Action')).toBeInTheDocument();
    });

    it('renders dismissible button when dismissible is true', () => {
      render(<Callout dismissible>Dismissible message</Callout>);

      const dismissButton = screen.getByRole('button', {
        name: 'Dismiss message'
      });
      expect(dismissButton).toBeInTheDocument();
    });

    it('calls onDismiss when dismiss button is clicked', () => {
      const onDismiss = vi.fn();
      render(
        <Callout dismissible onDismiss={onDismiss}>
          Dismissible message
        </Callout>
      );

      const dismissButton = screen.getByRole('button', {
        name: 'Dismiss message'
      });
      fireEvent.click(dismissButton);

      expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it('stays mounted after dismiss when onDismiss is provided (controlled)', () => {
      const onDismiss = vi.fn();
      render(
        <Callout dismissible onDismiss={onDismiss}>
          Controlled message
        </Callout>
      );

      fireEvent.click(screen.getByRole('button', { name: 'Dismiss message' }));

      // Consumer owns removal — the callout must not hide itself.
      expect(screen.getByText('Controlled message')).toBeInTheDocument();
    });

    it('hides itself after dismiss when onDismiss is omitted (uncontrolled)', () => {
      render(<Callout dismissible>Uncontrolled message</Callout>);

      fireEvent.click(screen.getByRole('button', { name: 'Dismiss message' }));

      expect(
        screen.queryByText('Uncontrolled message')
      ).not.toBeInTheDocument();
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    it('renders both action and dismissible button', () => {
      const onDismiss = vi.fn();
      render(
        <Callout
          action={<button data-testid='action-button'>Action</button>}
          dismissible
          onDismiss={onDismiss}
        >
          Message with both
        </Callout>
      );

      expect(screen.getByTestId('action-button')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Dismiss message' })
      ).toBeInTheDocument();
    });
  });

  describe('Styling and Layout', () => {
    it('applies custom width as number', () => {
      render(<Callout width={300}>Custom width message</Callout>);

      const callout = screen.getByRole('status');
      expect(callout).toHaveStyle({ width: '300px' });
    });

    it('applies custom width as string', () => {
      render(<Callout width='50%'>Custom width message</Callout>);

      const callout = screen.getByRole('status');
      expect(callout).toHaveStyle({ width: '50%' });
    });

    it('applies width={0} instead of dropping it', () => {
      render(<Callout width={0}>Zero width message</Callout>);

      const callout = screen.getByRole('status');
      expect(callout).toHaveStyle({ width: '0px' });
    });

    it('falls back to style.width when no width prop is given', () => {
      render(
        <Callout style={{ width: '200px' }}>Styled width message</Callout>
      );

      const callout = screen.getByRole('status');
      expect(callout).toHaveStyle({ width: '200px' });
    });
  });

  describe('Accessibility', () => {
    it('uses correct role for alert type', () => {
      render(<Callout type='alert'>Alert message</Callout>);

      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('uses status role for success type', () => {
      render(<Callout type='success'>Success message</Callout>);

      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('uses status role for other types', () => {
      render(<Callout type='grey'>Default message</Callout>);

      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('dismiss button has proper accessibility attributes', () => {
      render(<Callout dismissible>Dismissible message</Callout>);

      const dismissButton = screen.getByRole('button', {
        name: 'Dismiss message'
      });
      expect(dismissButton).toHaveAttribute('type', 'button');
      expect(dismissButton).toHaveAttribute('aria-label', 'Dismiss message');

      // The icon is decorative: IconButton wraps it in an aria-hidden element,
      // so the button is announced only by its aria-label.
      const svg = dismissButton.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg?.closest('[aria-hidden="true"]')).toBeInTheDocument();
    });
  });
});
