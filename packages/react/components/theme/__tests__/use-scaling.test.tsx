import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Theme } from '../theme';
import { useScaling } from '../use-scaling';

const reads: number[] = [];

function Probe() {
  const scaling = useScaling();
  reads.push(scaling);
  return <span data-testid='scaling'>{scaling}</span>;
}

describe('useScaling', () => {
  it('returns the theme scaling on the first render', () => {
    reads.length = 0;
    render(
      <Theme defaultValue={{ scaling: '1.1' }}>
        <Probe />
      </Theme>
    );
    expect(reads[0]).toBe(1.1);
    expect(screen.getByTestId('scaling').textContent).toBe('1.1');
  });

  it('reads the nearest nested theme', () => {
    render(
      <Theme defaultValue={{ scaling: '1.1' }}>
        <Theme value={{ scaling: '0.9' }}>
          <Probe />
        </Theme>
      </Theme>
    );
    expect(screen.getByTestId('scaling').textContent).toBe('0.9');
  });

  it('returns 1 outside a theme', () => {
    render(<Probe />);
    expect(screen.getByTestId('scaling').textContent).toBe('1');
  });

  it('follows a controlled value change', () => {
    const { rerender } = render(
      <Theme value={{ scaling: '1' }}>
        <Probe />
      </Theme>
    );
    expect(screen.getByTestId('scaling').textContent).toBe('1');
    rerender(
      <Theme value={{ scaling: '1.05' }}>
        <Probe />
      </Theme>
    );
    expect(screen.getByTestId('scaling').textContent).toBe('1.05');
  });
});
