import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectSlots, getSlot } from '~/test-utils/data-slots';
import { Tooltip } from '../tooltip';

const OpenTooltip = ({
  showArrow = false,
  children = 'Tooltip text' as React.ReactNode
}) => (
  <Tooltip open>
    <Tooltip.Trigger render={<button type='button'>Hover me</button>} />
    <Tooltip.Content showArrow={showArrow}>{children}</Tooltip.Content>
  </Tooltip>
);

describe('Tooltip data-slot contract', () => {
  it('exposes slots for every rendered part', () => {
    const { container } = render(<OpenTooltip showArrow />);
    expect(getSlot(container, 'tooltip-trigger')).not.toBeNull();
    // Tooltip content portals to the body.
    expectSlots(document.body, [
      'tooltip-positioner',
      'tooltip-content',
      'tooltip-text',
      'tooltip-arrow'
    ]);
  });

  it('omits the arrow slot by default', () => {
    render(<OpenTooltip />);
    expect(getSlot(document.body, 'tooltip-arrow')).toBeNull();
  });

  it('omits the text slot when children is not a string', () => {
    render(
      <OpenTooltip>
        <span>Custom content</span>
      </OpenTooltip>
    );
    expect(getSlot(document.body, 'tooltip-text')).toBeNull();
  });
});
