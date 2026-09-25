import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import { expectSlots } from '~/test-utils/data-slots';
import { FloatingActions } from '../index';

describe('FloatingActions data-slot contract', () => {
  it('exposes slots for every rendered part', () => {
    const { container } = render(
      <FloatingActions>
        <FloatingActions.Group>
          <span>content</span>
        </FloatingActions.Group>
        <FloatingActions.Separator />
      </FloatingActions>
    );
    expectSlots(container, [
      'floating-actions',
      'floating-actions-group',
      'floating-actions-separator'
    ]);
  });
});
