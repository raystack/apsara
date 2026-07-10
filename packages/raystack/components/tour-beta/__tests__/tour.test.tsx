import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type ComponentProps, useRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Tour } from '../tour';
import type { TourActions, TourEvent, TourStep } from '../types';

const STEPS: TourStep[] = [
  {
    id: 'one',
    target: '#step-one',
    title: 'Step one',
    content: 'First content'
  },
  {
    id: 'two',
    target: '#step-two',
    title: 'Step two',
    content: 'Second content'
  },
  // Detached step: no target, renders centered.
  { id: 'three', title: 'Step three', content: 'Centered content' }
];

const Page = (props: Partial<ComponentProps<typeof Tour>>) => (
  <div>
    <button id='step-one' type='button'>
      One
    </button>
    <input id='step-two' />
    <Tour steps={STEPS} {...props} />
  </div>
);

describe('Tour', () => {
  it('renders nothing while closed', () => {
    render(<Page />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens at the first step and resolves selector targets', async () => {
    render(<Page defaultOpen />);
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());
    expect(screen.getByText('Step one')).toBeInTheDocument();
    expect(screen.getByText('First content')).toBeInTheDocument();
    expect(screen.getByText('1 of 3')).toBeInTheDocument();
  });

  it('renders the spotlight overlay while running', async () => {
    render(<Page defaultOpen />);
    await waitFor(() =>
      expect(
        document.querySelector('[data-status="running"]')
      ).toBeInTheDocument()
    );
  });

  it('hides the overlay when disableOverlay is set on the tour', async () => {
    render(<Page defaultOpen disableOverlay />);
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());
    expect(document.querySelector('[data-status]')).not.toBeInTheDocument();
  });

  it('hides the overlay per step via step.disableOverlay', async () => {
    const user = userEvent.setup();
    const steps: TourStep[] = [
      {
        id: 'one',
        target: '#step-one',
        title: 'Step one',
        disableOverlay: true
      },
      { id: 'two', target: '#step-two', title: 'Step two' }
    ];
    render(
      <div>
        <button id='step-one' type='button'>
          One
        </button>
        <input id='step-two' />
        <Tour steps={steps} defaultOpen />
      </div>
    );
    await waitFor(() =>
      expect(screen.getByText('Step one')).toBeInTheDocument()
    );
    expect(document.querySelector('[data-status]')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Next' }));
    await waitFor(() =>
      expect(screen.getByText('Step two')).toBeInTheDocument()
    );
    expect(document.querySelector('[data-status]')).toBeInTheDocument();
  });

  it('navigates with Next and Back', async () => {
    const user = userEvent.setup();
    render(<Page defaultOpen />);
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());
    await user.click(screen.getByRole('button', { name: 'Next' }));
    await waitFor(() =>
      expect(screen.getByText('Step two')).toBeInTheDocument()
    );
    await user.click(screen.getByRole('button', { name: 'Back' }));
    await waitFor(() =>
      expect(screen.getByText('Step one')).toBeInTheDocument()
    );
  });

  it('renders detached steps without a target', async () => {
    render(<Page defaultOpen defaultStepIndex={2} />);
    await waitFor(() =>
      expect(screen.getByText('Step three')).toBeInTheDocument()
    );
  });

  it('finishes from the last step and reports status', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const events: TourEvent[] = [];
    render(
      <Page
        defaultOpen
        defaultStepIndex={2}
        onOpenChange={onOpenChange}
        onEvent={event => events.push(event)}
      />
    );
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());
    await user.click(screen.getByRole('button', { name: 'Finish' }));
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    );
    expect(onOpenChange).toHaveBeenCalledWith(false, { status: 'finished' });
    expect(events[events.length - 1]).toMatchObject({
      type: 'tour:end',
      status: 'finished'
    });
  });

  it('closes from the close button with closed status', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<Page defaultOpen onOpenChange={onOpenChange} />);
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());
    await user.click(screen.getByRole('button', { name: 'Close tour' }));
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    );
    expect(onOpenChange).toHaveBeenCalledWith(false, { status: 'closed' });
  });

  it('emits lifecycle events in order', async () => {
    const user = userEvent.setup();
    const events: TourEvent[] = [];
    render(<Page defaultOpen onEvent={event => events.push(event)} />);
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());
    await user.click(screen.getByRole('button', { name: 'Next' }));
    await waitFor(() =>
      expect(screen.getByText('Step two')).toBeInTheDocument()
    );
    const types = events.map(event => event.type);
    expect(types[0]).toBe('tour:start');
    expect(types).toContain('step:active');
    expect(
      events.filter(event => event.type === 'step:active').map(e => e.index)
    ).toEqual([0, 1]);
  });

  it('waits for late-mounting targets', async () => {
    const LateMount = () => {
      const [show, setShow] = useState(false);
      return (
        <div>
          <button type='button' onClick={() => setShow(true)}>
            mount
          </button>
          {show && <div id='late'>Late content</div>}
          <Tour
            steps={[{ id: 'late', target: '#late', title: 'Late step' }]}
            defaultOpen
          />
        </div>
      );
    };
    render(<LateMount />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('mount'));
    await waitFor(() =>
      expect(screen.getByText('Late step')).toBeInTheDocument()
    );
  });

  it('skips steps whose target never appears', async () => {
    const events: TourEvent[] = [];
    render(
      <div>
        <div id='real' />
        <Tour
          steps={[
            { id: 'ghost', target: '#missing', title: 'Ghost step' },
            { id: 'real', target: '#real', title: 'Real step' }
          ]}
          defaultOpen
          targetTimeout={50}
          onEvent={event => events.push(event)}
        />
      </div>
    );
    await waitFor(() =>
      expect(screen.getByText('Real step')).toBeInTheDocument()
    );
    expect(events.some(event => event.type === 'error:target-not-found')).toBe(
      true
    );
  });

  it('exposes imperative actions through actionsRef', async () => {
    const Harness = () => {
      const actionsRef = useRef<TourActions>(null);
      return (
        <div>
          <button id='step-one' type='button'>
            One
          </button>
          <input id='step-two' />
          <button type='button' onClick={() => actionsRef.current?.start(1)}>
            launch
          </button>
          <Tour steps={STEPS} actionsRef={actionsRef} />
        </div>
      );
    };
    render(<Harness />);
    fireEvent.click(screen.getByText('launch'));
    await waitFor(() =>
      expect(screen.getByText('Step two')).toBeInTheDocument()
    );
  });

  it('ignores navigation actions while closed', () => {
    const onStepChange = vi.fn();
    const Harness = () => {
      const actionsRef = useRef<TourActions>(null);
      return (
        <div>
          <button id='step-one' type='button'>
            One
          </button>
          <input id='step-two' />
          <button type='button' onClick={() => actionsRef.current?.next()}>
            poke
          </button>
          <Tour
            steps={STEPS}
            actionsRef={actionsRef}
            onStepChange={onStepChange}
          />
        </div>
      );
    };
    render(<Harness />);
    fireEvent.click(screen.getByText('poke'));
    expect(onStepChange).not.toHaveBeenCalled();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('supports controlled open and stepIndex', async () => {
    const Controlled = () => {
      const [index, setIndex] = useState(0);
      return (
        <div>
          <button id='step-one' type='button'>
            One
          </button>
          <input id='step-two' />
          <button type='button' onClick={() => setIndex(1)}>
            jump
          </button>
          <Tour steps={STEPS} open stepIndex={index} onStepChange={setIndex} />
        </div>
      );
    };
    render(<Controlled />);
    await waitFor(() =>
      expect(screen.getByText('Step one')).toBeInTheDocument()
    );
    fireEvent.click(screen.getByText('jump'));
    await waitFor(() =>
      expect(screen.getByText('Step two')).toBeInTheDocument()
    );
  });

  it('supports custom popover content via a render function', async () => {
    render(
      <div>
        <button id='step-one' type='button'>
          One
        </button>
        <Tour steps={[STEPS[0]]} defaultOpen>
          <Tour.Popover>
            {({ step, index, totalSteps }) => (
              <div>
                custom:{String(step.id)}:{index + 1}/{totalSteps}
              </div>
            )}
          </Tour.Popover>
        </Tour>
      </div>
    );
    await waitFor(() =>
      expect(screen.getByText('custom:one:1/1')).toBeInTheDocument()
    );
  });

  it('renders composable parts and skips with skipped status', async () => {
    const onOpenChange = vi.fn();
    render(
      <div>
        <button id='step-one' type='button'>
          One
        </button>
        <Tour steps={[STEPS[0]]} defaultOpen onOpenChange={onOpenChange}>
          <Tour.Popover>
            <Tour.Title />
            <Tour.Description />
            <Tour.Skip />
            <Tour.Next />
          </Tour.Popover>
        </Tour>
      </div>
    );
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: 'Skip' }));
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    );
    expect(onOpenChange).toHaveBeenCalledWith(false, { status: 'skipped' });
  });
});
