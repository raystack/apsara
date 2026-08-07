import { render, screen } from '@testing-library/react';
import { memo } from 'react';
import { describe, expect, it, vi } from 'vitest';
import {
  type IconComponent,
  type IconProps,
  IconProvider
} from '../create-icon';
import { ChevronDownIcon, CircleXIcon, CoPilotIcon, XIcon } from '../generated';

// This file imports nothing outside `icons/`. The `./icons` rollup build sets
// `rootDir` to this directory, so an import of a component would make the
// TypeScript program warn (TS6059). The `<Theme icons=…>` integration is tested
// in `components/theme-provider/__tests__/theme.test.tsx` instead.

/** A stand-in for a consumer's own icon component. */
const StubIcon = (props: IconProps) => (
  <svg {...props} data-testid='stub'>
    <title>stub</title>
  </svg>
);

describe('icon registry', () => {
  describe('with no provider', () => {
    it('renders the lucide default', () => {
      render(<XIcon />);

      const icon = document.querySelector('[data-icon="XIcon"]');
      expect(icon).toBeInTheDocument();
      expect(icon?.tagName.toLowerCase()).toBe('svg');
      expect(icon).not.toHaveAttribute('data-testid', 'stub');
    });

    it('applies the base props', () => {
      render(<XIcon />);

      const icon = document.querySelector('[data-icon="XIcon"]');
      expect(icon).toHaveAttribute('width', '16');
      expect(icon).toHaveAttribute('height', '16');
      // 1.5 units of lucide's 24-unit viewBox renders as the 1px stroke the
      // design draws at 16px.
      expect(icon).toHaveAttribute('stroke-width', '1.5');
    });

    it('renders an in-house SVG default', () => {
      render(<CoPilotIcon />);

      // SVGR turns the asset into a real component, so the wrapper resolves to
      // it exactly as it resolves a lucide icon.
      const icon = document.querySelector('[data-icon="CoPilotIcon"]');
      expect(icon).toBeInTheDocument();
      expect(icon?.tagName.toLowerCase()).toBe('svg');
    });

    it('sets displayName to the icon name', () => {
      expect(XIcon.displayName).toBe('XIcon');
      expect(CircleXIcon.displayName).toBe('CircleXIcon');
    });
  });

  describe('overrides', () => {
    it('renders the override in place of the default', () => {
      render(
        <IconProvider icons={{ XIcon: StubIcon }}>
          <XIcon />
        </IconProvider>
      );

      expect(screen.getByTestId('stub')).toBeInTheDocument();
      expect(screen.getByTestId('stub')).toHaveAttribute('data-icon', 'XIcon');
    });

    it('leaves the icons it does not name at their defaults', () => {
      render(
        <IconProvider icons={{ XIcon: StubIcon }}>
          <XIcon />
          <ChevronDownIcon />
        </IconProvider>
      );

      expect(screen.getByTestId('stub')).toHaveAttribute('data-icon', 'XIcon');
      const chevron = document.querySelector('[data-icon="ChevronDownIcon"]');
      expect(chevron).toBeInTheDocument();
      expect(chevron).not.toHaveAttribute('data-testid', 'stub');
    });

    it('keeps one key for one shape — CircleXIcon serves two roles', () => {
      // The toast error icon and the search clear icon share this key, so an
      // override changes both. This is the accepted cost of naming keys after
      // shapes rather than roles.
      render(
        <IconProvider icons={{ CircleXIcon: StubIcon }}>
          <CircleXIcon />
          <CircleXIcon />
        </IconProvider>
      );

      expect(screen.getAllByTestId('stub')).toHaveLength(2);
    });
  });

  describe('prop priority', () => {
    it('lets the provider props beat the base values', () => {
      render(
        <IconProvider props={{ strokeWidth: 1, width: 24, height: 24 }}>
          <XIcon />
        </IconProvider>
      );

      const icon = document.querySelector('[data-icon="XIcon"]');
      expect(icon).toHaveAttribute('stroke-width', '1');
      expect(icon).toHaveAttribute('width', '24');
    });

    it('lets the props at the call site beat the provider props', () => {
      render(
        <IconProvider props={{ strokeWidth: 1, width: 24 }}>
          <XIcon strokeWidth={3} width={32} />
        </IconProvider>
      );

      const icon = document.querySelector('[data-icon="XIcon"]');
      expect(icon).toHaveAttribute('stroke-width', '3');
      expect(icon).toHaveAttribute('width', '32');
    });

    it('lets the props at the call site beat the base values', () => {
      render(<XIcon width={20} height={20} />);

      const icon = document.querySelector('[data-icon="XIcon"]');
      expect(icon).toHaveAttribute('width', '20');
      expect(icon).toHaveAttribute('height', '20');
    });

    it('passes the props through to an override', () => {
      render(
        <IconProvider icons={{ XIcon: StubIcon }} props={{ strokeWidth: 1 }}>
          <XIcon className='call-site' />
        </IconProvider>
      );

      const icon = screen.getByTestId('stub');
      expect(icon).toHaveAttribute('stroke-width', '1');
      expect(icon).toHaveClass('call-site');
    });
  });

  describe('nested providers', () => {
    it('layers per icon name and keeps the outer overrides', () => {
      const Inner = (props: IconProps) => (
        <svg {...props} data-testid='inner'>
          <title>inner</title>
        </svg>
      );

      render(
        <IconProvider icons={{ XIcon: StubIcon }}>
          <IconProvider icons={{ ChevronDownIcon: Inner }}>
            <XIcon />
            <ChevronDownIcon />
          </IconProvider>
        </IconProvider>
      );

      // The inner provider names only ChevronDownIcon, so XIcon keeps the
      // outer provider's override rather than falling back to its default.
      expect(screen.getByTestId('inner')).toHaveAttribute(
        'data-icon',
        'ChevronDownIcon'
      );
      expect(screen.getByTestId('stub')).toHaveAttribute('data-icon', 'XIcon');
    });

    it('lets the inner provider replace an icon the outer one named', () => {
      const Inner = (props: IconProps) => (
        <svg {...props} data-testid='inner' />
      );

      render(
        <IconProvider icons={{ XIcon: StubIcon }}>
          <IconProvider icons={{ XIcon: Inner }}>
            <XIcon />
          </IconProvider>
        </IconProvider>
      );

      expect(screen.getByTestId('inner')).toBeInTheDocument();
      expect(screen.queryByTestId('stub')).not.toBeInTheDocument();
    });

    it('keeps the outer overrides when the inner provider sets only props', () => {
      render(
        <IconProvider icons={{ XIcon: StubIcon }}>
          <IconProvider props={{ strokeWidth: 1 }}>
            <XIcon />
          </IconProvider>
        </IconProvider>
      );

      const icon = screen.getByTestId('stub');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('stroke-width', '1');
    });

    it('layers the props too', () => {
      render(
        <IconProvider props={{ strokeWidth: 1, width: 24 }}>
          <IconProvider props={{ width: 32 }}>
            <XIcon />
          </IconProvider>
        </IconProvider>
      );

      const icon = document.querySelector('[data-icon="XIcon"]');
      expect(icon).toHaveAttribute('width', '32');
      expect(icon).toHaveAttribute('stroke-width', '1');
    });
  });

  describe('context identity', () => {
    it('keeps the context value stable across an inline object literal', () => {
      const renders = vi.fn();
      const Counted = (props: IconProps) => {
        renders();
        return <svg {...props} data-testid='counted' />;
      };

      // `memo` blocks a re-render that comes down through props. A context
      // change bypasses `memo`, so this subtree re-renders if and only if the
      // context value changed identity.
      const Subtree = memo(function Subtree() {
        return <XIcon />;
      });

      const App = ({ theme }: { theme: string }) => (
        // New object literals on every render. `useStable` holds the previous
        // values because their contents compare equal.
        <IconProvider icons={{ XIcon: Counted }} props={{ strokeWidth: 2 }}>
          <span>{theme}</span>
          <Subtree />
        </IconProvider>
      );

      const { rerender } = render(<App theme='light' />);
      const afterMount = renders.mock.calls.length;

      rerender(<App theme='dark' />);

      expect(renders.mock.calls.length).toBe(afterMount);
      expect(screen.getByTestId('counted')).toBeInTheDocument();
    });

    it('re-renders when the map really changes', () => {
      const renders = vi.fn();
      const First = (props: IconProps) => {
        renders();
        return <svg {...props} data-testid='first' />;
      };
      const Second = (props: IconProps) => {
        renders();
        return <svg {...props} data-testid='second' />;
      };

      const Subtree = memo(function Subtree() {
        return <XIcon />;
      });

      const App = ({ icon }: { icon: IconComponent }) => (
        <IconProvider icons={{ XIcon: icon }}>
          <Subtree />
        </IconProvider>
      );

      const { rerender } = render(<App icon={First} />);
      const afterMount = renders.mock.calls.length;

      rerender(<App icon={Second} />);

      expect(renders.mock.calls.length).toBeGreaterThan(afterMount);
      expect(screen.getByTestId('second')).toBeInTheDocument();
    });
  });
});
