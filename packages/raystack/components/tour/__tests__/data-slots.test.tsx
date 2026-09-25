import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ComponentProps } from 'react';
import { describe, expect, it } from 'vitest';
import { expectSlots, getSlot } from '~/test-utils/data-slots';
import { Tour } from '../tour';
import type { TourStep } from '../types';

const STEPS: TourStep[] = [
  {
    id: 'one',
    target: '#step-one',
    title: 'Step one',
    content: 'First content'
  },
  {
    id: 'two',
    title: 'Step two',
    content: 'Detached content'
  }
];

const Page = (props: Partial<ComponentProps<typeof Tour>>) => (
  <div>
    <button id='step-one' type='button'>
      One
    </button>
    <Tour steps={STEPS} {...props} />
  </div>
);

describe('Tour data-slot contract', () => {
  it('exposes slots for the overlay and content', async () => {
    render(<Page defaultOpen />);
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());

    // Overlay and popover content both portal to the body.
    expectSlots(document.body, [
      'tour-overlay',
      'tour-spotlight',
      'tour-spotlight-cover',
      'tour-overlay-hit',
      'tour-positioner',
      'tour-content',
      'tour-step-content',
      'tour-title',
      'tour-description',
      'tour-progress',
      'tour-next',
      'tour-close'
    ]);
  });

  it('omits the prev slot on the first step', async () => {
    render(<Page defaultOpen />);
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());
    expect(getSlot(document.body, 'tour-prev')).toBeNull();
  });

  it('exposes the prev slot after advancing past the first step', async () => {
    const user = userEvent.setup();
    render(<Page defaultOpen />);
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());
    await user.click(screen.getByRole('button', { name: 'Next' }));
    await waitFor(() =>
      expect(getSlot(document.body, 'tour-prev')).not.toBeNull()
    );
  });

  it('omits the arrow slot when showArrow is false (default)', async () => {
    render(<Page defaultOpen />);
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());
    expect(getSlot(document.body, 'tour-arrow')).toBeNull();
  });

  it('exposes the arrow slot when showArrow is enabled', async () => {
    render(
      <Page defaultOpen>
        <Tour.Overlay />
        <Tour.Content showArrow />
      </Page>
    );
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());
    expect(getSlot(document.body, 'tour-arrow')).not.toBeNull();
  });
});
