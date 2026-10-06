import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Reasoning } from '../reasoning';

describe('Reasoning', () => {
  const ReasoningExample = (props: {
    streaming?: boolean;
    duration?: number;
    defaultOpen?: boolean;
  }) => (
    <Reasoning {...props}>
      <Reasoning.Trigger />
      <Reasoning.Content>
        <Reasoning.Step label='Gathering ticket updates'>
          step detail
        </Reasoning.Step>
      </Reasoning.Content>
    </Reasoning>
  );

  it('labels the trigger with the duration once done', () => {
    render(<ReasoningExample duration={11} />);
    expect(
      screen.getByRole('button', { name: 'Worked for 11 seconds' })
    ).toBeInTheDocument();
  });

  it('uses the singular for one second', () => {
    render(<ReasoningExample duration={1} />);
    expect(
      screen.getByRole('button', { name: 'Worked for 1 second' })
    ).toBeInTheDocument();
  });

  it('shows the thinking label and opens while streaming', () => {
    render(<ReasoningExample streaming />);
    const trigger = screen.getByRole('button', { name: 'Thinking…' });
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('step detail')).toBeInTheDocument();
  });

  it('auto-collapses when streaming completes', () => {
    const { rerender } = render(<ReasoningExample streaming />);
    expect(screen.getByRole('button', { name: 'Thinking…' })).toHaveAttribute(
      'aria-expanded',
      'true'
    );

    rerender(<ReasoningExample streaming={false} duration={4} />);
    expect(
      screen.getByRole('button', { name: 'Worked for 4 seconds' })
    ).toHaveAttribute('aria-expanded', 'false');
  });

  it('leaves the panel alone after a manual toggle', () => {
    const { rerender } = render(<ReasoningExample streaming />);
    // The panel auto-opened; the user closes it deliberately.
    const trigger = screen.getByRole('button', { name: 'Thinking…' });
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    // Completing the stream must not re-open or re-close the panel.
    rerender(<ReasoningExample streaming={false} duration={2} />);
    expect(
      screen.getByRole('button', { name: 'Worked for 2 seconds' })
    ).toHaveAttribute('aria-expanded', 'false');
  });

  it('toggles via the trigger when idle', () => {
    render(<ReasoningExample duration={3} />);
    const trigger = screen.getByRole('button', {
      name: 'Worked for 3 seconds'
    });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('step detail')).toBeInTheDocument();
  });

  it('renders step labels', () => {
    render(<ReasoningExample defaultOpen />);
    expect(screen.getByText('Gathering ticket updates')).toBeInTheDocument();
  });
});
