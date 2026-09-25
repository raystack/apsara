import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import { expectSlots } from '~/test-utils/data-slots';
import { Navbar } from '../navbar';

describe('Navbar data-slot contract', () => {
  it('exposes slots for every rendered part', () => {
    const { container } = render(
      <Navbar>
        <Navbar.Start>Start</Navbar.Start>
        <Navbar.Center>Center</Navbar.Center>
        <Navbar.End>End</Navbar.End>
      </Navbar>
    );
    expectSlots(container, [
      'navbar',
      'navbar-container',
      'navbar-start',
      'navbar-center',
      'navbar-end'
    ]);
  });
});
