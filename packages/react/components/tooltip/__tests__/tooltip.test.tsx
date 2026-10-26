import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Tooltip } from '../tooltip';

const TRIGGER_TEXT = 'Hover me';
const MESSAGE_TEXT = 'Tooltip text';

const BasicTooltip = ({
  message = MESSAGE_TEXT,
  children = TRIGGER_TEXT,
  ...props
}: {
  message?: string;
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  delay?: number;
}) => {
  return (
    <Tooltip delay={0} {...props}>
      <Tooltip.Trigger render={<button>{children}</button>} />
      <Tooltip.Content>{message}</Tooltip.Content>
    </Tooltip>
  );
};

describe('Tooltip', () => {
  describe('Basic Rendering', () => {
    it('renders trigger content', () => {
      render(<BasicTooltip />);
      expect(screen.getByText(TRIGGER_TEXT)).toBeInTheDocument();
    });

    it('does not show tooltip initially', () => {
      render(<BasicTooltip />);
      expect(screen.queryByText(MESSAGE_TEXT)).not.toBeInTheDocument();
    });

    it('respects open prop', () => {
      render(<BasicTooltip open={true} />);
      expect(screen.queryByText(MESSAGE_TEXT)).toBeInTheDocument();
    });

    it('shows tooltip on hover', async () => {
      const user = userEvent.setup();
      render(<BasicTooltip />);

      const trigger = screen.getByText(TRIGGER_TEXT);
      await user.hover(trigger);

      await waitFor(() => {
        expect(screen.getByText(MESSAGE_TEXT)).toBeInTheDocument();
      });
    });

    it('hides tooltip on mouse leave', async () => {
      const user = userEvent.setup();
      render(
        <>
          <BasicTooltip />
          <BasicTooltip message='Tooltip2'>Trigger2</BasicTooltip>
        </>
      );

      const trigger = screen.getByText(TRIGGER_TEXT);
      const trigger2 = screen.getByText('Trigger2');
      await user.hover(trigger);
      await user.hover(trigger2);

      expect(screen.queryByText(MESSAGE_TEXT)).not.toBeInTheDocument();
    });

    it('shows tooltip on focus', async () => {
      render(<BasicTooltip />);

      const trigger = screen.getByText(TRIGGER_TEXT);
      await trigger.focus();

      expect(screen.getByText(MESSAGE_TEXT)).toBeInTheDocument();
    });

    it('hides tooltip on blur', async () => {
      render(<BasicTooltip />);

      const trigger = screen.getByText(TRIGGER_TEXT);
      await trigger.focus();

      await waitFor(() => {
        expect(screen.getByText(MESSAGE_TEXT)).toBeInTheDocument();
      });

      await trigger.blur();

      await waitFor(() => {
        expect(screen.queryByText(MESSAGE_TEXT)).not.toBeInTheDocument();
      });
    });

    it('calls onOpenChange when state changes', async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      render(<BasicTooltip onOpenChange={onOpenChange} />);
      const trigger = screen.getByText(TRIGGER_TEXT);

      await user.hover(trigger);

      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalled();
      });
    });
  });

  describe('Provider', () => {
    it('works with explicit provider', () => {
      render(
        <Tooltip.Provider>
          <Tooltip>
            <Tooltip.Trigger render={<button>Trigger 1</button>} />
            <Tooltip.Content>Tooltip 1</Tooltip.Content>
          </Tooltip>
          <Tooltip>
            <Tooltip.Trigger render={<button>Trigger 2</button>} />
            <Tooltip.Content>Tooltip 2</Tooltip.Content>
          </Tooltip>
        </Tooltip.Provider>
      );

      expect(screen.getByText('Trigger 1')).toBeInTheDocument();
      expect(screen.getByText('Trigger 2')).toBeInTheDocument();
    });

    it('works without explicit provider', () => {
      render(<BasicTooltip />);

      expect(screen.getByText(TRIGGER_TEXT)).toBeInTheDocument();
    });
  });

  describe('Content', () => {
    it('hides arrow when showArrow is false', () => {
      render(
        <Tooltip open={true}>
          <Tooltip.Trigger render={<button>Trigger</button>} />
          <Tooltip.Content showArrow={false}>Tooltip</Tooltip.Content>
        </Tooltip>
      );

      const tooltip = screen.getByText('Tooltip');
      const arrow = tooltip.parentElement?.querySelector('[class*="arrow"]');
      expect(arrow).not.toBeInTheDocument();
    });

    it('shows arrow when showArrow is true', () => {
      render(
        <Tooltip open={true}>
          <Tooltip.Trigger render={<button>Trigger</button>} />
          <Tooltip.Content showArrow={true}>Tooltip</Tooltip.Content>
        </Tooltip>
      );

      const tooltip = screen.getByText('Tooltip');
      const arrow = tooltip.parentElement?.querySelector('[class*="arrow"]');
      expect(arrow).toBeInTheDocument();
    });
  });

  describe('Viewport', () => {
    it('shows the payload of the open detached trigger', () => {
      const handle = Tooltip.createHandle<string>();
      render(
        <>
          <Tooltip.Trigger handle={handle} id='a' payload='Bold'>
            B
          </Tooltip.Trigger>
          <Tooltip.Trigger handle={handle} id='b' payload='Italic'>
            I
          </Tooltip.Trigger>
          <Tooltip handle={handle} open triggerId='b'>
            {({ payload }) => (
              <Tooltip.Content>
                <Tooltip.Viewport>{payload}</Tooltip.Viewport>
              </Tooltip.Content>
            )}
          </Tooltip>
        </>
      );
      expect(screen.getByText('Italic')).toBeInTheDocument();
      expect(screen.queryByText('Bold')).not.toBeInTheDocument();
    });
  });

  describe('closeOnClick', () => {
    const ClickTooltip = ({ closeOnClick }: { closeOnClick?: boolean }) => (
      <Tooltip>
        <Tooltip.Trigger
          delay={0}
          closeOnClick={closeOnClick}
          render={<button>{TRIGGER_TEXT}</button>}
        />
        <Tooltip.Content>{MESSAGE_TEXT}</Tooltip.Content>
      </Tooltip>
    );

    it('closes the tooltip on trigger click by default', async () => {
      const user = userEvent.setup();
      render(<ClickTooltip />);
      await user.hover(screen.getByText(TRIGGER_TEXT));
      await waitFor(() => {
        expect(screen.getByText(MESSAGE_TEXT)).toBeInTheDocument();
      });
      await user.click(screen.getByText(TRIGGER_TEXT));
      await waitFor(() => {
        expect(screen.queryByText(MESSAGE_TEXT)).not.toBeInTheDocument();
      });
    });

    it('keeps the tooltip open on trigger click when false', async () => {
      const user = userEvent.setup();
      render(<ClickTooltip closeOnClick={false} />);
      await user.hover(screen.getByText(TRIGGER_TEXT));
      await waitFor(() => {
        expect(screen.getByText(MESSAGE_TEXT)).toBeInTheDocument();
      });
      await user.click(screen.getByText(TRIGGER_TEXT));
      await new Promise(resolve => setTimeout(resolve, 50));
      expect(screen.getByText(MESSAGE_TEXT)).toBeInTheDocument();
    });
  });
});
