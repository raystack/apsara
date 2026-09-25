import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectSlots, getAllSlots, getSlot } from '~/test-utils/data-slots';
import { Slider } from '../slider';

describe('Slider data-slot contract', () => {
  it('exposes slots for every rendered part', () => {
    const { container } = render(<Slider defaultValue={50} label='Volume' />);
    expectSlots(container, [
      'slider',
      'slider-control',
      'slider-track',
      'slider-indicator',
      'slider-thumb',
      'slider-thumb-grip',
      'slider-thumb-grip-line',
      'slider-label'
    ]);
  });

  it('reuses the grip slot for the small thumb, without grip lines', () => {
    const { container } = render(
      <Slider defaultValue={50} thumbSize='small' />
    );
    expect(getSlot(container, 'slider-thumb-grip')).not.toBeNull();
    expect(getSlot(container, 'slider-thumb-grip-line')).toBeNull();
  });

  it('renders one thumb slot per thumb in range mode', () => {
    const { container } = render(
      <Slider variant='range' defaultValue={[20, 80]} />
    );
    expect(getAllSlots(container, 'slider-thumb')).toHaveLength(2);
  });

  it('omits the label slot when no label is passed', () => {
    const { container } = render(<Slider defaultValue={50} />);
    expect(getSlot(container, 'slider-label')).toBeNull();
  });
});
