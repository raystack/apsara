import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Navbar } from '../navbar';
import { NavbarRootProps } from '../navbar-root';
import styles from '../navbar.module.css';

const START_TEXT = 'Explore';
const END_BUTTON_TEXT = 'Action';
const TEST_ID = 'test-navbar';

const BasicNavbar = ({
  sticky = false,
  children,
  ...props
}: NavbarRootProps) => (
  <Navbar sticky={sticky} data-testid={TEST_ID} {...props}>
    {children}
  </Navbar>
);

describe('Navbar', () => {
  describe('Basic Rendering', () => {
    it('renders navbar with children', () => {
      render(
        <BasicNavbar>
          <Navbar.Start>
            <span>{START_TEXT}</span>
          </Navbar.Start>
          <Navbar.End>
            <button>{END_BUTTON_TEXT}</button>
          </Navbar.End>
        </BasicNavbar>
      );

      expect(screen.getByText(START_TEXT)).toBeInTheDocument();
      expect(screen.getByText(END_BUTTON_TEXT)).toBeInTheDocument();
    });

    it('renders as nav element', () => {
      const { container } = render(<BasicNavbar />);

      const nav = container.querySelector('nav');
      expect(nav).toBeInTheDocument();
    });

    it('applies root styles', () => {
      const { container } = render(<BasicNavbar />);

      const navbar = container.querySelector(`.${styles.root}`);
      expect(navbar).toBeInTheDocument();
    });

    it('has proper ARIA attributes', () => {
      render(<BasicNavbar />);

      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
      expect(nav).toHaveAttribute('aria-label', 'Main navigation');
    });

    it('supports custom aria-label', () => {
      render(<BasicNavbar aria-label='Primary site navigation' />);

      const nav = screen.getByRole('navigation');
      expect(nav).toHaveAttribute('aria-label', 'Primary site navigation');
    });

    it('supports aria-labelledby', () => {
      render(
        <>
          <h2 id='nav-heading'>Site Navigation</h2>
          <BasicNavbar aria-labelledby='nav-heading' />
        </>
      );

      const nav = screen.getByRole('navigation');
      expect(nav).toHaveAttribute('aria-labelledby', 'nav-heading');
      expect(nav).not.toHaveAttribute('aria-label');
    });

    it('prioritizes aria-labelledby over default aria-label', () => {
      render(
        <>
          <h2 id='nav-heading'>Site Navigation</h2>
          <BasicNavbar
            aria-labelledby='nav-heading'
            aria-label='Custom label'
          />
        </>
      );

      const nav = screen.getByRole('navigation');
      expect(nav).toHaveAttribute('aria-labelledby', 'nav-heading');
      expect(nav).toHaveAttribute('aria-label', 'Custom label');
    });
  });

  describe('Sticky Functionality', () => {
    it('applies sticky attribute when sticky is true', () => {
      const { container } = render(<BasicNavbar sticky />);

      const navbar = container.querySelector('[data-sticky="true"]');
      expect(navbar).toBeInTheDocument();
    });

    it('does not apply sticky attribute when sticky is false', () => {
      const { container } = render(<BasicNavbar sticky={false} />);

      const navbar = container.querySelector('[data-sticky="true"]');
      expect(navbar).not.toBeInTheDocument();
    });

    it('defaults to non-sticky', () => {
      const { container } = render(<BasicNavbar />);

      const navbar = container.querySelector('[data-sticky="true"]');
      expect(navbar).not.toBeInTheDocument();
    });
  });

  describe('Navbar.Start', () => {
    it('renders start section content', () => {
      render(
        <BasicNavbar>
          <Navbar.Start>
            <span>{START_TEXT}</span>
          </Navbar.Start>
        </BasicNavbar>
      );

      expect(screen.getByText(START_TEXT)).toBeInTheDocument();
    });

    it('supports aria-label for start section', () => {
      render(
        <BasicNavbar>
          <Navbar.Start aria-label='Brand and navigation links'>
            <span>{START_TEXT}</span>
          </Navbar.Start>
        </BasicNavbar>
      );

      const start = screen.getByRole('group', {
        name: 'Brand and navigation links'
      });
      expect(start).toBeInTheDocument();
    });

    it('does not add role when aria-label is not provided', () => {
      const { container } = render(
        <BasicNavbar>
          <Navbar.Start data-testid='start' />
        </BasicNavbar>
      );

      const start = container.querySelector('[data-testid="start"]');
      expect(start).not.toHaveAttribute('role');
    });

    it('applies start styles', () => {
      const { container } = render(
        <BasicNavbar>
          <Navbar.Start data-testid='start-section' />
        </BasicNavbar>
      );

      const start = container.querySelector(`.${styles.start}`);
      expect(start).toBeInTheDocument();
    });

    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(
        <BasicNavbar>
          <Navbar.Start ref={ref} />
        </BasicNavbar>
      );
      expect(ref).toHaveBeenCalled();
    });

    it('applies custom className', () => {
      const { container } = render(
        <BasicNavbar>
          <Navbar.Start className='custom-start-class' />
        </BasicNavbar>
      );

      const start = container.querySelector('.custom-start-class');
      expect(start).toBeInTheDocument();
    });

    it('applies custom styles', () => {
      render(
        <BasicNavbar>
          <Navbar.Start
            style={{ backgroundColor: 'red', padding: '10px' }}
            data-testid='start'
          />
        </BasicNavbar>
      );

      const start = screen.getByTestId('start');
      expect(start).toBeInTheDocument();
    });
  });

  describe('Navbar.End', () => {
    it('renders end section content', () => {
      render(
        <BasicNavbar>
          <Navbar.End>
            <button>{END_BUTTON_TEXT}</button>
          </Navbar.End>
        </BasicNavbar>
      );

      expect(screen.getByText(END_BUTTON_TEXT)).toBeInTheDocument();
    });

    it('supports aria-label for end section', () => {
      render(
        <BasicNavbar>
          <Navbar.End aria-label='User actions and settings'>
            <button>{END_BUTTON_TEXT}</button>
          </Navbar.End>
        </BasicNavbar>
      );

      const end = screen.getByRole('group', {
        name: 'User actions and settings'
      });
      expect(end).toBeInTheDocument();
    });

    it('does not add role when aria-label is not provided', () => {
      const { container } = render(
        <BasicNavbar>
          <Navbar.End data-testid='end' />
        </BasicNavbar>
      );

      const end = container.querySelector('[data-testid="end"]');
      expect(end).not.toHaveAttribute('role');
    });

    it('applies end styles', () => {
      const { container } = render(
        <BasicNavbar>
          <Navbar.End data-testid='end-section' />
        </BasicNavbar>
      );

      const end = container.querySelector(`.${styles.end}`);
      expect(end).toBeInTheDocument();
    });

    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(
        <BasicNavbar>
          <Navbar.End ref={ref} />
        </BasicNavbar>
      );
      expect(ref).toHaveBeenCalled();
    });

    it('applies custom className', () => {
      const { container } = render(
        <BasicNavbar>
          <Navbar.End className='custom-end-class' />
        </BasicNavbar>
      );

      const end = container.querySelector('.custom-end-class');
      expect(end).toBeInTheDocument();
    });

    it('applies custom styles', () => {
      render(
        <BasicNavbar>
          <Navbar.End
            style={{ backgroundColor: 'blue', padding: '10px' }}
            data-testid='end'
          />
        </BasicNavbar>
      );

      const end = screen.getByTestId('end');
      expect(end).toBeInTheDocument();
    });
  });

  describe('Compound Component Structure', () => {
    it('renders complete navbar with Start and End', () => {
      render(
        <BasicNavbar>
          <Navbar.Start>
            <span>{START_TEXT}</span>
          </Navbar.Start>
          <Navbar.End>
            <button>{END_BUTTON_TEXT}</button>
          </Navbar.End>
        </BasicNavbar>
      );

      expect(screen.getByText(START_TEXT)).toBeInTheDocument();
      expect(screen.getByText(END_BUTTON_TEXT)).toBeInTheDocument();
    });

    it('renders only Start section', () => {
      render(
        <BasicNavbar>
          <Navbar.Start>
            <span>{START_TEXT}</span>
          </Navbar.Start>
        </BasicNavbar>
      );

      expect(screen.getByText(START_TEXT)).toBeInTheDocument();
    });

    it('renders only End section', () => {
      render(
        <BasicNavbar>
          <Navbar.End>
            <button>{END_BUTTON_TEXT}</button>
          </Navbar.End>
        </BasicNavbar>
      );

      expect(screen.getByText(END_BUTTON_TEXT)).toBeInTheDocument();
    });
  });

  describe('Custom Props', () => {
    it('forwards ref to root', () => {
      const ref = vi.fn();
      render(<BasicNavbar ref={ref} />);
      expect(ref).toHaveBeenCalled();
    });

    it('applies custom className to root', () => {
      const { container } = render(<BasicNavbar className='custom-navbar' />);

      const navbar = container.querySelector('.custom-navbar');
      expect(navbar).toBeInTheDocument();
    });

    it('applies custom data attributes', () => {
      render(<BasicNavbar data-custom='test-value' />);

      const nav = screen.getByRole('navigation');
      expect(nav).toHaveAttribute('data-custom', 'test-value');
    });

    it('applies custom id', () => {
      render(<BasicNavbar id='my-navbar' />);

      const nav = screen.getByRole('navigation');
      expect(nav).toHaveAttribute('id', 'my-navbar');
    });
  });

  describe('Container Layout', () => {
    it('renders container with flex layout', () => {
      const { container } = render(<BasicNavbar />);

      const containerEl = container.querySelector(`.${styles.container}`);
      expect(containerEl).toBeInTheDocument();
    });

    it('positions Start and End correctly', () => {
      const { container } = render(
        <BasicNavbar>
          <Navbar.Start data-testid='start'>Start</Navbar.Start>
          <Navbar.End data-testid='end'>End</Navbar.End>
        </BasicNavbar>
      );

      const start = container.querySelector(`.${styles.start}`);
      const end = container.querySelector(`.${styles.end}`);

      expect(start).toBeInTheDocument();
      expect(end).toBeInTheDocument();
    });
  });
});
