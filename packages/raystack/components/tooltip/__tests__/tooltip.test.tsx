import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Tooltip } from '../tooltip';
import { TooltipProps } from '../tooltip-root';

const TRIGGER_TEXT = 'Hover me';
const MESSAGE_TEXT = 'Tooltip text';

const BasicTooltip = ({
  message = MESSAGE_TEXT,
  children = TRIGGER_TEXT,
  ...props
}: Partial<TooltipProps>) => {
  return (
    <Tooltip message={message} delayDuration={0} {...props}>
      <button>{children}</button>
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
      expect(screen.queryAllByText(MESSAGE_TEXT)[0]).toBeInTheDocument();
    });

    it('shows tooltip on hover', async () => {
      const user = userEvent.setup();
      render(<BasicTooltip />);

      const trigger = screen.getByText(TRIGGER_TEXT);
      await user.hover(trigger);

      expect(screen.getAllByText(MESSAGE_TEXT)[0]).toBeInTheDocument();
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

      expect(screen.getAllByText(MESSAGE_TEXT)[0]).toBeInTheDocument();
    });

    it('hides tooltip on blur', async () => {
      render(<BasicTooltip />);

      const trigger = screen.getByText(TRIGGER_TEXT);
      await trigger.focus();
      await trigger.blur();

      expect(screen.queryByText(MESSAGE_TEXT)).not.toBeInTheDocument();
    });

    it('calls onOpenChange when state changes', async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      render(<BasicTooltip onOpenChange={onOpenChange} />);
      const trigger = screen.getByText(TRIGGER_TEXT);

      await user.hover(trigger);
      expect(onOpenChange).toHaveBeenCalled();
    });
  });

  describe('Provider', () => {
    it('works with explicit provider', () => {
      render(
        <Tooltip.Provider>
          <BasicTooltip message='Tooltip 1'>Trigger 1</BasicTooltip>
          <BasicTooltip message='Tooltip 2'>Trigger 2</BasicTooltip>
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
});
