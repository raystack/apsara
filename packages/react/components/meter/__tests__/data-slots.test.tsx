import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectSlots, getSlot } from '~/test-utils/data-slots';
import { Meter } from '../meter';

describe('Meter data-slot contract', () => {
  it('exposes slots for every rendered part (linear)', () => {
    const { container } = render(
      <Meter value={40}>
        <Meter.Label>Storage</Meter.Label>
        <Meter.Value />
        <Meter.Track />
      </Meter>
    );
    expectSlots(container, [
      'meter',
      'meter-label',
      'meter-value',
      'meter-track',
      'meter-indicator'
    ]);
    expect(getSlot(container, 'meter-track-circle')).toBeNull();
  });

  it('renders the default track with slots when no children are given', () => {
    const { container } = render(<Meter value={40} />);
    expectSlots(container, ['meter', 'meter-track', 'meter-indicator']);
  });

  it('exposes circular track slots for the circular variant', () => {
    const { container } = render(<Meter variant='circular' value={40} />);
    expectSlots(container, [
      'meter',
      'meter-track',
      'meter-track-circle',
      'meter-indicator'
    ]);
    expect(getSlot(container, 'meter-track')?.tagName.toLowerCase()).toBe(
      'svg'
    );
  });
});
