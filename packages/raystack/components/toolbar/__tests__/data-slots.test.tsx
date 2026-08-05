import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import { expectSlots } from '~/test-utils/data-slots';
import { Toolbar } from '../toolbar';

describe('Toolbar data-slot contract', () => {
  it('exposes slots for every rendered part', () => {
    const { container } = render(
      <Toolbar>
        <Toolbar.Group>
          <Toolbar.Button>Bold</Toolbar.Button>
        </Toolbar.Group>
        <Toolbar.Separator />
      </Toolbar>
    );
    expectSlots(container, [
      'toolbar',
      'toolbar-group',
      'toolbar-button',
      'toolbar-separator'
    ]);
  });
});
