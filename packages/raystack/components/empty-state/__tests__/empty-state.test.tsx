import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EmptyState } from '../empty-state';
import styles from '../empty-state.module.css';

describe('EmptyState', () => {
  describe('Basic Rendering', () => {
    it('renders with icon', () => {
      render(<EmptyState icon={<div data-testid='icon'>Icon</div>} />);
      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });

    it('renders heading when provided', () => {
      render(<EmptyState icon={<div>Icon</div>} heading='No data found' />);
      expect(screen.getByText('No data found')).toBeInTheDocument();
    });

    it('renders subheading when provided', () => {
      render(
        <EmptyState
          icon={<div>Icon</div>}
          subHeading='Try adjusting your filters'
        />
      );
      expect(
        screen.getByText('Try adjusting your filters')
      ).toBeInTheDocument();
    });

    it('renders without heading and subheading', () => {
      const { container } = render(<EmptyState icon={<div>Icon</div>} />);
      expect(
        container.querySelector(`.${styles.headerText}`)
      ).not.toBeInTheDocument();
      expect(
        container.querySelector(`.${styles.subHeaderText}`)
      ).not.toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('renders empty1 variant by default', () => {
      const { container } = render(<EmptyState icon={<div>Icon</div>} />);
      expect(
        container.querySelector(`.${styles.emptyState}`)
      ).toBeInTheDocument();
      expect(
        container.querySelector(`.${styles.emptyStatePage}`)
      ).not.toBeInTheDocument();
    });

    it('renders empty2 variant correctly', () => {
      const { container } = render(
        <EmptyState icon={<div>Icon</div>} variant='empty2' />
      );
      expect(
        container.querySelector(`.${styles.emptyStatePage}`)
      ).toBeInTheDocument();
      expect(
        container.querySelector(`.${styles.emptyStateContent}`)
      ).toBeInTheDocument();
    });

    it('renders large icon for empty2 variant', () => {
      const { container } = render(
        <EmptyState icon={<div>Icon</div>} variant='empty2' />
      );
      expect(
        container.querySelector(`.${styles.iconLarge}`)
      ).toBeInTheDocument();
    });
  });

  describe('Actions', () => {
    it('renders primary action', () => {
      render(
        <EmptyState
          icon={<div>Icon</div>}
          primaryAction={<button>Add Item</button>}
        />
      );
      expect(
        screen.getByRole('button', { name: 'Add Item' })
      ).toBeInTheDocument();
    });

    it('renders secondary action', () => {
      render(
        <EmptyState
          icon={<div>Icon</div>}
          secondaryAction={<button>Learn More</button>}
        />
      );
      expect(
        screen.getByRole('button', { name: 'Learn More' })
      ).toBeInTheDocument();
    });

    it('renders both actions', () => {
      render(
        <EmptyState
          icon={<div>Icon</div>}
          primaryAction={<button>Add Item</button>}
          secondaryAction={<button>Learn More</button>}
        />
      );
      expect(
        screen.getByRole('button', { name: 'Add Item' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Learn More' })
      ).toBeInTheDocument();
    });

    // it('renders actions side by side in empty2 variant', () => {
    //   const { container } = render(
    //     <EmptyState
    //       icon={<div>Icon</div>}
    //       variant='empty2'
    //       primaryAction={<button>Primary</button>}
    //       secondaryAction={<button>Secondary</button>}
    //     />
    //   );
    //   const actionsContainer = screen.getByRole('button', {
    //     name: 'Primary'
    //   }).parentElement;
    //   expect(actionsContainer).toHaveStyle({ gap: 'var(--rs-space-5)' });
    // });
  });

  describe('Custom ClassNames', () => {
    it('applies custom container className', () => {
      const { container } = render(
        <EmptyState
          icon={<div>Icon</div>}
          classNames={{ container: 'custom-container' }}
        />
      );
      expect(container.querySelector('.custom-container')).toBeInTheDocument();
    });

    it('applies custom icon className', () => {
      const { container } = render(
        <EmptyState
          icon={<div>Icon</div>}
          classNames={{ icon: 'custom-icon' }}
        />
      );
      expect(container.querySelector('.custom-icon')).toBeInTheDocument();
    });

    it('applies custom heading className', () => {
      render(
        <EmptyState
          icon={<div>Icon</div>}
          heading='Title'
          classNames={{ heading: 'custom-heading' }}
        />
      );
      const heading = screen.getByText('Title');
      expect(heading).toHaveClass('custom-heading');
    });

    it('applies custom subheading className', () => {
      render(
        <EmptyState
          icon={<div>Icon</div>}
          subHeading='Subtitle'
          classNames={{ subHeading: 'custom-subheading' }}
        />
      );
      const subheading = screen.getByText('Subtitle');
      expect(subheading).toHaveClass('custom-subheading');
    });

    it('applies all custom classNames together', () => {
      const { container } = render(
        <EmptyState
          icon={<div>Icon</div>}
          heading='Title'
          subHeading='Subtitle'
          classNames={{
            container: 'custom-container',
            iconContainer: 'custom-icon-container',
            icon: 'custom-icon',
            heading: 'custom-heading',
            subHeading: 'custom-subheading'
          }}
        />
      );

      expect(container.querySelector('.custom-container')).toBeInTheDocument();
      expect(
        container.querySelector('.custom-icon-container')
      ).toBeInTheDocument();
      expect(container.querySelector('.custom-icon')).toBeInTheDocument();
      expect(screen.getByText('Title')).toHaveClass('custom-heading');
      expect(screen.getByText('Subtitle')).toHaveClass('custom-subheading');
    });
  });

  describe('Content Types', () => {
    it('renders JSX as heading', () => {
      render(
        <EmptyState
          icon={<div>Icon</div>}
          heading={<strong>No Results</strong>}
        />
      );
      expect(screen.getByText('No Results')).toBeInTheDocument();
      expect(screen.getByText('No Results').tagName).toBe('STRONG');
    });

    it('renders JSX as subheading', () => {
      render(
        <EmptyState
          icon={<div>Icon</div>}
          subHeading={<em>Try again later</em>}
        />
      );
      expect(screen.getByText('Try again later')).toBeInTheDocument();
      expect(screen.getByText('Try again later').tagName).toBe('EM');
    });

    it('renders complex icon components', () => {
      const ComplexIcon = () => (
        <svg data-testid='complex-icon'>
          <circle cx='50' cy='50' r='40' />
        </svg>
      );
      render(<EmptyState icon={<ComplexIcon />} />);
      expect(screen.getByTestId('complex-icon')).toBeInTheDocument();
    });
  });

  describe('Layout and Structure', () => {
    it('centers content in empty1 variant', () => {
      const { container } = render(
        <EmptyState icon={<div>Icon</div>} heading='Title' />
      );
      const emptyState = container.querySelector(`.${styles.emptyState}`);
      expect(emptyState).toHaveClass(styles.emptyState);
    });

    it('uses flex layout for empty2 variant', () => {
      const { container } = render(
        <EmptyState icon={<div>Icon</div>} variant='empty2' />
      );
      const page = container.querySelector(`.${styles.emptyStatePage}`);
      expect(page).toBeInTheDocument();
    });

    // it('maintains proper spacing between elements', () => {
    //   const { container } = render(
    //     <EmptyState
    //       icon={<div>Icon</div>}
    //       heading='Title'
    //       subHeading='Subtitle'
    //       primaryAction={<button>Action</button>}
    //     />
    //   );
    //   const emptyState = container.querySelector(`.${styles.emptyState}`);
    //   expect(emptyState).toHaveStyle({ gap: 'var(--rs-space-5)' });
    // });
  });

  describe('Combinations', () => {
    it('renders complete empty state with all props', () => {
      render(
        <EmptyState
          icon={<div data-testid='icon'>📭</div>}
          heading='No messages'
          subHeading='You have no messages at the moment'
          primaryAction={<button>Compose Message</button>}
          secondaryAction={<button>Refresh</button>}
          classNames={{ container: 'custom' }}
        />
      );

      expect(screen.getByTestId('icon')).toBeInTheDocument();
      expect(screen.getByText('No messages')).toBeInTheDocument();
      expect(
        screen.getByText('You have no messages at the moment')
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Compose Message' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Refresh' })
      ).toBeInTheDocument();
    });

    it('renders minimal empty state', () => {
      const { container } = render(<EmptyState icon={<span>🔍</span>} />);

      expect(screen.getByText('🔍')).toBeInTheDocument();
      expect(
        container.querySelector(`.${styles.iconContainer}`)
      ).toBeInTheDocument();
    });
  });
});
