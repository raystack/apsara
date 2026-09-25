import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectSlots, getSlot } from '~/test-utils/data-slots';
import { Progress } from '../progress';

describe('Progress data-slot contract', () => {
  it('exposes slots for every rendered part (linear)', () => {
    const { container } = render(
      <Progress value={40}>
        <Progress.Label>Loading</Progress.Label>
        <Progress.Value />
        <Progress.Track />
      </Progress>
    );
    expectSlots(container, [
      'progress',
      'progress-label',
      'progress-value',
      'progress-track',
      'progress-indicator'
    ]);
    expect(getSlot(container, 'progress-track-circle')).toBeNull();
  });

  it('renders the default track with slots when no children are given', () => {
    const { container } = render(<Progress value={40} />);
    expectSlots(container, [
      'progress',
      'progress-track',
      'progress-indicator'
    ]);
  });

  it('exposes circular track slots for the circular variant', () => {
    const { container } = render(<Progress variant='circular' value={40} />);
    expectSlots(container, [
      'progress',
      'progress-track',
      'progress-track-circle',
      'progress-indicator'
    ]);
    expect(getSlot(container, 'progress-track')?.tagName.toLowerCase()).toBe(
      'svg'
    );
  });
});
