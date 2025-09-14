import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '../../../test-utils';
import { Tooltip } from '../tooltip';
import styles from '../tooltip.module.css';

describe('Tooltip', () => {
  describe('Basic Rendering', () => {
    it('renders trigger content', () => {
      render(
        <Tooltip message='Tooltip text'>
          <button>Hover me</button>
        </Tooltip>
      );
      expect(
        screen.getByRole('button', { name: 'Hover me' })
      ).toBeInTheDocument();
    });

    it('does not show tooltip initially', () => {
      render(
        <Tooltip message='Tooltip text'>
          <button>Hover me</button>
        </Tooltip>
      );
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });

    it('shows tooltip on hover', async () => {
      render(
        <Tooltip message='Tooltip text' delayDuration={0}>
          <button>Hover me</button>
        </Tooltip>
      );

      const trigger = screen.getByRole('button');
      fireEvent.mouseEnter(trigger);

      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
        expect(screen.getByText('Tooltip text')).toBeInTheDocument();
      });
    });

    it('hides tooltip on mouse leave', async () => {
      render(
        <Tooltip message='Tooltip text' delayDuration={0}>
          <button>Hover me</button>
        </Tooltip>
      );

      const trigger = screen.getByRole('button');
      fireEvent.mouseEnter(trigger);

      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });

      fireEvent.mouseLeave(trigger);

      await waitFor(() => {
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
      });
    });
  });

  describe('Disabled State', () => {
    it('does not show tooltip when disabled', async () => {
      render(
        <Tooltip message='Tooltip text' disabled delayDuration={0}>
          <button>Hover me</button>
        </Tooltip>
      );

      const trigger = screen.getByRole('button');
      fireEvent.mouseEnter(trigger);

      await waitFor(() => {
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
      });
    });

    it('renders only children when disabled', () => {
      const { container } = render(
        <Tooltip message='Tooltip text' disabled>
          <button>Click me</button>
        </Tooltip>
      );

      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(
        container.querySelector(`.${styles.trigger}`)
      ).not.toBeInTheDocument();
    });
  });

  describe('Message Content', () => {
    it('renders string message', async () => {
      render(
        <Tooltip message='Simple tooltip' delayDuration={0}>
          <button>Hover</button>
        </Tooltip>
      );

      fireEvent.mouseEnter(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByText('Simple tooltip')).toBeInTheDocument();
      });
    });

    it('renders JSX message', async () => {
      render(
        <Tooltip message={<strong>Bold tooltip</strong>} delayDuration={0}>
          <button>Hover</button>
        </Tooltip>
      );

      fireEvent.mouseEnter(screen.getByRole('button'));

      await waitFor(() => {
        const tooltip = screen.getByText('Bold tooltip');
        expect(tooltip).toBeInTheDocument();
        expect(tooltip.tagName).toBe('STRONG');
      });
    });

    it('renders complex JSX content', async () => {
      render(
        <Tooltip
          message={
            <div>
              <h4>Title</h4>
              <p>Description</p>
            </div>
          }
          delayDuration={0}
        >
          <button>Hover</button>
        </Tooltip>
      );

      fireEvent.mouseEnter(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByText('Title')).toBeInTheDocument();
        expect(screen.getByText('Description')).toBeInTheDocument();
      });
    });
  });

  describe('Positioning', () => {
    const sides = [
      'top',
      'right',
      'bottom',
      'left',
      'top-left',
      'top-right',
      'bottom-left',
      'bottom-right'
    ] as const;

    it.each(sides)('renders tooltip on %s side', async side => {
      render(
        <Tooltip message='Tooltip' side={side} delayDuration={0}>
          <button>Hover</button>
        </Tooltip>
      );

      fireEvent.mouseEnter(screen.getByRole('button'));

      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip');
        expect(tooltip).toHaveClass(styles[`side-${side}`]);
      });
    });

    it('defaults to top side', async () => {
      render(
        <Tooltip message='Tooltip' delayDuration={0}>
          <button>Hover</button>
        </Tooltip>
      );

      fireEvent.mouseEnter(screen.getByRole('button'));

      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip');
        expect(tooltip).toHaveClass(styles['side-top']);
      });
    });
  });

  describe('Arrow', () => {
    it('shows arrow by default', async () => {
      render(
        <Tooltip message='Tooltip' delayDuration={0}>
          <button>Hover</button>
        </Tooltip>
      );

      fireEvent.mouseEnter(screen.getByRole('button'));

      await waitFor(() => {
        const arrow = document.querySelector(`.${styles.arrow}`);
        expect(arrow).toBeInTheDocument();
      });
    });

    it('hides arrow when showArrow is false', async () => {
      render(
        <Tooltip message='Tooltip' showArrow={false} delayDuration={0}>
          <button>Hover</button>
        </Tooltip>
      );

      fireEvent.mouseEnter(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
        const arrow = document.querySelector(`.${styles.arrow}`);
        expect(arrow).not.toBeInTheDocument();
      });
    });
  });

  describe('Custom ClassNames', () => {
    it('applies custom trigger className', () => {
      const { container } = render(
        <Tooltip message='Tooltip' classNames={{ trigger: 'custom-trigger' }}>
          <button>Hover</button>
        </Tooltip>
      );

      const trigger = container.querySelector(`.${styles.trigger}`);
      expect(trigger).toHaveClass('custom-trigger');
    });

    it('applies custom content className', async () => {
      render(
        <Tooltip
          message='Tooltip'
          classNames={{ content: 'custom-content' }}
          delayDuration={0}
        >
          <button>Hover</button>
        </Tooltip>
      );

      fireEvent.mouseEnter(screen.getByRole('button'));

      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip');
        expect(tooltip).toHaveClass('custom-content');
      });
    });

    it('applies custom arrow className', async () => {
      render(
        <Tooltip
          message='Tooltip'
          classNames={{ arrow: 'custom-arrow' }}
          delayDuration={0}
        >
          <button>Hover</button>
        </Tooltip>
      );

      fireEvent.mouseEnter(screen.getByRole('button'));

      await waitFor(() => {
        const arrow = document.querySelector(`.${styles.arrow}`);
        expect(arrow).toHaveClass('custom-arrow');
      });
    });
  });

  describe('Custom Styles', () => {
    it('applies trigger styles', () => {
      const { container } = render(
        <Tooltip message='Tooltip' triggerStyle={{ padding: '10px' }}>
          <button>Hover</button>
        </Tooltip>
      );

      const trigger = container.querySelector(
        `.${styles.trigger}`
      ) as HTMLElement;
      expect(trigger).toHaveStyle({ padding: '10px' });
    });

    it('applies content styles', async () => {
      render(
        <Tooltip
          message='Tooltip'
          contentStyle={{ backgroundColor: 'red' }}
          delayDuration={0}
        >
          <button>Hover</button>
        </Tooltip>
      );

      fireEvent.mouseEnter(screen.getByRole('button'));

      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip');
        expect(tooltip).toHaveStyle({ backgroundColor: 'red' });
      });
    });
  });

  describe('Accessibility', () => {
    it('sets aria-describedby on trigger', () => {
      render(
        <Tooltip message='Helpful tooltip'>
          <button>Button</button>
        </Tooltip>
      );

      const button = screen.getByRole('button');
      expect(button.parentElement).toHaveAttribute('aria-describedby');
    });

    it('uses custom id when provided', async () => {
      render(
        <Tooltip message='Tooltip' id='custom-tooltip' delayDuration={0}>
          <button>Hover</button>
        </Tooltip>
      );

      fireEvent.mouseEnter(screen.getByRole('button'));

      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip');
        expect(tooltip).toHaveAttribute('id', 'custom-tooltip');
      });
    });

    it('sets aria-label on tooltip content', async () => {
      render(
        <Tooltip
          message='Tooltip text'
          aria-label='Custom label'
          delayDuration={0}
        >
          <button>Hover</button>
        </Tooltip>
      );

      fireEvent.mouseEnter(screen.getByRole('button'));

      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip');
        expect(tooltip).toHaveAttribute('aria-label', 'Custom label');
      });
    });

    it('uses message as aria-label for string messages', async () => {
      render(
        <Tooltip message='Simple message' delayDuration={0}>
          <button>Hover</button>
        </Tooltip>
      );

      fireEvent.mouseEnter(screen.getByRole('button'));

      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip');
        expect(tooltip).toHaveAttribute('aria-label', 'Simple message');
      });
    });
  });

  describe('Controlled Mode', () => {
    it('respects open prop', () => {
      render(
        <Tooltip message='Tooltip' open={true}>
          <button>Button</button>
        </Tooltip>
      );

      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });

    it('calls onOpenChange when state changes', async () => {
      const onOpenChange = vi.fn();
      render(
        <Tooltip
          message='Tooltip'
          onOpenChange={onOpenChange}
          delayDuration={0}
        >
          <button>Hover</button>
        </Tooltip>
      );

      fireEvent.mouseEnter(screen.getByRole('button'));

      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(true);
      });
    });
  });

  describe('Provider', () => {
    it('works with explicit provider', async () => {
      render(
        <Tooltip.Provider>
          <Tooltip message='Tooltip 1' delayDuration={0}>
            <button>Button 1</button>
          </Tooltip>
          <Tooltip message='Tooltip 2' delayDuration={0}>
            <button>Button 2</button>
          </Tooltip>
        </Tooltip.Provider>
      );

      fireEvent.mouseEnter(screen.getByRole('button', { name: 'Button 1' }));

      await waitFor(() => {
        expect(screen.getByText('Tooltip 1')).toBeInTheDocument();
      });
    });

    it('works without explicit provider', async () => {
      render(
        <Tooltip message='Tooltip text' delayDuration={0}>
          <button>Hover</button>
        </Tooltip>
      );

      fireEvent.mouseEnter(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByText('Tooltip text')).toBeInTheDocument();
      });
    });
  });

  describe('Delay Duration', () => {
    it('respects custom delay duration', async () => {
      render(
        <Tooltip message='Tooltip' delayDuration={500}>
          <button>Hover</button>
        </Tooltip>
      );

      fireEvent.mouseEnter(screen.getByRole('button'));

      // Should not appear immediately
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

      // Should appear after delay
      await waitFor(
        () => {
          expect(screen.getByRole('tooltip')).toBeInTheDocument();
        },
        { timeout: 600 }
      );
    });
  });
});
