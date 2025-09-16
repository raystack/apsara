import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Container } from '../container';
import styles from '../container.module.css';

describe('Container', () => {
  describe('Basic Rendering', () => {
    it('renders with children', () => {
      render(<Container>Content</Container>);
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('renders as div element by default', () => {
      const { container } = render(<Container>Test</Container>);
      const element = container.firstChild;
      expect(element?.nodeName).toBe('DIV');
    });

    it('applies custom className', () => {
      render(<Container className='custom-class'>Content</Container>);
      const container = screen.getByRole('region');
      expect(container).toHaveClass('custom-class');
      expect(container).toHaveClass(styles.container);
    });
  });

  describe('Sizes', () => {
    const sizes = ['small', 'medium', 'large', 'none'] as const;

    it.each(sizes)('renders %s size correctly', size => {
      render(<Container size={size}>Content</Container>);
      const container = screen.getByRole('region');
      expect(container).toHaveClass(styles[`container-${size}`]);
    });

    it('defaults to none size', () => {
      render(<Container>Content</Container>);
      const container = screen.getByRole('region');
      expect(container).toHaveClass(styles['container-none']);
    });
  });

  describe('Alignment', () => {
    const alignments = ['left', 'center', 'right'] as const;

    it.each(alignments)('renders %s alignment correctly', align => {
      render(<Container align={align}>Content</Container>);
      const container = screen.getByRole('region');
      expect(container).toHaveClass(styles[`container-align-${align}`]);
    });

    it('defaults to center alignment', () => {
      render(<Container>Content</Container>);
      const container = screen.getByRole('region');
      expect(container).toHaveClass(styles['container-align-center']);
    });
  });

  describe('Accessibility', () => {
    it('supports custom role', () => {
      render(<Container role='main'>Content</Container>);
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('supports aria-label', () => {
      render(<Container aria-label='Main container'>Content</Container>);
      expect(screen.getByLabelText('Main container')).toBeInTheDocument();
    });

    it('supports aria-labelledby', () => {
      render(
        <>
          <h1 id='heading'>Title</h1>
          <Container aria-labelledby='heading'>Content</Container>
        </>
      );
      const container = screen.getByRole('region');
      expect(container).toHaveAttribute('aria-labelledby', 'heading');
    });

    it('supports id attribute', () => {
      render(<Container id='main-container'>Content</Container>);
      const container = screen.getByRole('region');
      expect(container).toHaveAttribute('id', 'main-container');
    });
  });
});
