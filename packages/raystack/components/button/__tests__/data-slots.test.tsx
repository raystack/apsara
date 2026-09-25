import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectSlots, getSlot } from '~/test-utils/data-slots';
import { Button } from '../button';

describe('Button data-slot contract', () => {
  it('exposes slots for every rendered part', () => {
    const { container } = render(
      <Button leadingIcon={<span>l</span>} trailingIcon={<span>t</span>}>
        Save
      </Button>
    );
    expectSlots(container, [
      'button',
      'button-leading-icon',
      'button-trailing-icon'
    ]);
  });

  it('puts the button slot on the button element itself', () => {
    const { container } = render(<Button>Save</Button>);
    expect(getSlot(container, 'button')?.tagName).toBe('BUTTON');
  });

  it('exposes loader slots while loading', () => {
    const { container } = render(
      <Button loading loaderText='Saving'>
        Save
      </Button>
    );
    expectSlots(container, ['button', 'button-loader', 'button-loader-text']);
    expect(getSlot(container, 'button-leading-icon')).toBeNull();
    expect(getSlot(container, 'button-trailing-icon')).toBeNull();
  });

  it('omits optional slots when their parts are absent', () => {
    const { container } = render(<Button>Save</Button>);
    expect(getSlot(container, 'button-leading-icon')).toBeNull();
    expect(getSlot(container, 'button-trailing-icon')).toBeNull();
    expect(getSlot(container, 'button-loader')).toBeNull();
    expect(getSlot(container, 'button-loader-text')).toBeNull();
  });

  it('lets callers override the root slot via props', () => {
    const { container } = render(<Button data-slot='custom'>Save</Button>);
    expect(getSlot(container, 'button')).toBeNull();
    expect(getSlot(container, 'custom')).not.toBeNull();
  });
});
