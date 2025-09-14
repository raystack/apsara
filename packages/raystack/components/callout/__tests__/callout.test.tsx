import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '../../../test-utils';
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

    it('combines variants', () => {
      render(
        <Callout type='success' outline highContrast>
          Test message
        </Callout>
      );

      const callout = screen.getByRole('status');
      expect(callout).toHaveClass(styles['callout-success']);
      expect(callout).toHaveClass(styles['callout-outline']);
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

    it('applies custom style', () => {
      render(
        <Callout style={{ backgroundColor: 'red', padding: '20px' }}>
          Custom style message
        </Callout>
      );

      const callout = screen.getByRole('status');
      expect(callout).toHaveStyle({
        backgroundColor: 'red',
        padding: '20px'
      });
    });

    it('combines width and custom style', () => {
      render(
        <Callout
          width={400}
          style={{ backgroundColor: 'blue', margin: '10px' }}
        >
          Combined styles
        </Callout>
      );

      const callout = screen.getByRole('status');
      expect(callout).toHaveStyle({
        width: '400px',
        backgroundColor: 'blue',
        margin: '10px'
      });
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

    it('has correct aria-live attribute for alert', () => {
      render(<Callout type='alert'>Alert message</Callout>);

      const callout = screen.getByRole('alert');
      expect(callout).toHaveAttribute('aria-live', 'assertive');
    });

    it('has correct aria-live attribute for non-alert types', () => {
      render(<Callout type='success'>Success message</Callout>);

      const callout = screen.getByRole('status');
      expect(callout).toHaveAttribute('aria-live', 'polite');
    });

    it('icon has aria-hidden attribute', () => {
      render(
        <Callout icon={<span data-testid='test-icon'>Icon</span>}>
          Message
        </Callout>
      );

      const iconContainer = screen
        .getByTestId('test-icon')
        .closest(`.${styles.icon}`);
      expect(iconContainer).toHaveAttribute('aria-hidden', 'true');
    });

    it('dismiss button has proper accessibility attributes', () => {
      render(<Callout dismissible>Dismissible message</Callout>);

      const dismissButton = screen.getByRole('button', {
        name: 'Dismiss message'
      });
      expect(dismissButton).toHaveAttribute('type', 'button');
      expect(dismissButton).toHaveAttribute('aria-label', 'Dismiss message');

      const svg = dismissButton.querySelector('svg');
      expect(svg).toHaveAttribute('aria-hidden', 'true');
      expect(svg).toHaveAttribute('role', 'presentation');
    });
  });

  describe('Structure', () => {
    it('has correct DOM structure', () => {
      const { container } = render(
        <Callout
          action={<button>Action</button>}
          dismissible
          onDismiss={vi.fn()}
        >
          Test message
        </Callout>
      );

      const callout = container.querySelector(`.${styles.callout}`);
      const containerDiv = callout?.querySelector(`.${styles.container}`);
      const messageContainer = containerDiv?.querySelector(
        `.${styles.messageContainer}`
      );
      const actionsContainer = containerDiv?.querySelector(
        `.${styles.actionsContainer}`
      );

      expect(callout).toBeInTheDocument();
      expect(containerDiv).toBeInTheDocument();
      expect(messageContainer).toBeInTheDocument();
      expect(actionsContainer).toBeInTheDocument();

      const icon = messageContainer?.querySelector(`.${styles.icon}`);
      const message = messageContainer?.querySelector(`.${styles.message}`);
      const action = actionsContainer?.querySelector(`.${styles.action}`);
      const dismiss = actionsContainer?.querySelector(`.${styles.dismiss}`);

      expect(icon).toBeInTheDocument();
      expect(message).toBeInTheDocument();
      expect(action).toBeInTheDocument();
      expect(dismiss).toBeInTheDocument();
    });
  });

  describe('Display Name', () => {
    it('has correct display name', () => {
      expect(Callout.displayName).toBe('Callout');
    });
  });

  describe('Props Forwarding', () => {
    it('forwards additional props to the root element', () => {
      render(
        <Callout data-testid='test-callout' id='custom-id'>
          Test message
        </Callout>
      );

      const callout = screen.getByTestId('test-callout');
      expect(callout).toHaveAttribute('id', 'custom-id');
      expect(callout).toHaveAttribute('data-testid', 'test-callout');
    });
  });

  describe('Edge Cases', () => {
    it('handles undefined onDismiss gracefully', () => {
      render(<Callout dismissible>Dismissible without handler</Callout>);

      const dismissButton = screen.getByRole('button', {
        name: 'Dismiss message'
      });
      expect(() => fireEvent.click(dismissButton)).not.toThrow();
    });

    it('renders empty children', () => {
      render(<Callout>{``}</Callout>);

      const callout = screen.getByRole('status');
      expect(callout).toBeInTheDocument();
    });

    it('renders with JSX children', () => {
      render(
        <Callout>
          <strong>Bold text</strong> and <em>italic text</em>
        </Callout>
      );

      expect(screen.getByText('Bold text')).toBeInTheDocument();
      expect(screen.getByText('italic text')).toBeInTheDocument();
    });
  });
});
