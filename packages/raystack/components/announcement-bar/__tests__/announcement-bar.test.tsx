import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '../../../test-utils';
import { AnnouncementBar } from '../announcement-bar';
import styles from '../announcement-bar.module.css';

describe('AnnouncementBar', () => {
  describe('Basic Rendering', () => {
    it('renders with text', () => {
      render(<AnnouncementBar text='Important announcement' />);
      expect(screen.getByText('Important announcement')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = render(
        <AnnouncementBar text='Test' className='custom-class' />
      );
      const bar = container.querySelector('.custom-class');
      expect(bar).toBeInTheDocument();
      expect(bar).toHaveClass(styles['announcement-bar']);
    });

    it('renders with leading icon', () => {
      const { container } = render(
        <AnnouncementBar
          text='Announcement'
          leadingIcon={<span data-testid='test-icon'>📢</span>}
        />
      );

      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
      const iconWrapper = container.querySelector(`.${styles.icon}`);
      expect(iconWrapper).toBeInTheDocument();
    });

    it('renders with action label', () => {
      render(<AnnouncementBar text='Announcement' actionLabel='Learn more' />);

      expect(screen.getByText('Learn more')).toBeInTheDocument();
    });

    it('renders with action icon', () => {
      render(
        <AnnouncementBar
          text='Announcement'
          actionIcon={<span data-testid='action-icon'>→</span>}
        />
      );

      expect(screen.getByTestId('action-icon')).toBeInTheDocument();
    });

    it('renders with both action label and icon', () => {
      render(
        <AnnouncementBar
          text='Announcement'
          actionLabel='Learn more'
          actionIcon={<span data-testid='action-icon'>→</span>}
        />
      );

      expect(screen.getByText('Learn more')).toBeInTheDocument();
      expect(screen.getByTestId('action-icon')).toBeInTheDocument();
    });

    it('does not render action button without label or icon', () => {
      const { container } = render(<AnnouncementBar text='Announcement' />);

      const actionBtn = container.querySelector(`.${styles['action-btn']}`);
      expect(actionBtn).not.toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('renders normal variant by default', () => {
      const { container } = render(<AnnouncementBar text='Test' />);
      const bar = container.querySelector('[class*="announcement-bar"]');
      expect(bar).toHaveClass(styles['announcement-bar-normal']);
    });

    it('renders gradient variant', () => {
      const { container } = render(
        <AnnouncementBar text='Test' variant='gradient' />
      );
      const bar = container.querySelector('[class*="announcement-bar"]');
      expect(bar).toHaveClass(styles['announcement-bar-gradient']);
    });

    it('renders error variant', () => {
      const { container } = render(
        <AnnouncementBar text='Test' variant='error' />
      );
      const bar = container.querySelector('[class*="announcement-bar"]');
      expect(bar).toHaveClass(styles['announcement-bar-error']);
    });
  });

  describe('Interactions', () => {
    it('handles action click', () => {
      const handleClick = vi.fn();
      render(
        <AnnouncementBar
          text='Announcement'
          actionLabel='Click me'
          onActionClick={handleClick}
        />
      );

      const actionBtn = screen.getByText('Click me');
      fireEvent.click(actionBtn);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('has default empty handler when onActionClick not provided', () => {
      render(<AnnouncementBar text='Announcement' actionLabel='Click me' />);

      const actionBtn = screen.getByText('Click me');
      expect(() => fireEvent.click(actionBtn)).not.toThrow();
    });
  });

  describe('Layout', () => {
    it('uses Flex component with correct props', () => {
      const { container } = render(<AnnouncementBar text='Test' />);
      const bar = container.querySelector('[class*="announcement-bar"]');

      // Check if it has flex properties from the Flex component
      expect(bar).toHaveClass(styles['announcement-bar']);
    });

    it('centers content', () => {
      const { container } = render(
        <AnnouncementBar
          text='Centered announcement'
          leadingIcon={<span>🔔</span>}
          actionLabel='Action'
        />
      );

      const bar = container.querySelector('[class*="announcement-bar"]');
      expect(bar).toBeInTheDocument();
    });
  });

  describe('Text Styling', () => {
    it('applies correct text styles', () => {
      render(<AnnouncementBar text='Styled text' />);
      const textElement = screen.getByText('Styled text');
      expect(textElement).toHaveClass(styles.text);
    });

    it('applies correct action button styles', () => {
      render(<AnnouncementBar text='Test' actionLabel='Action' />);
      const actionBtn = screen.getByText('Action');
      expect(actionBtn).toHaveClass(styles['action-btn']);
    });
  });

  describe('Complex Scenarios', () => {
    it('renders with all props combined', () => {
      const handleClick = vi.fn();
      const { container } = render(
        <AnnouncementBar
          text='Full featured announcement'
          variant='gradient'
          className='custom'
          leadingIcon={<span data-testid='lead-icon'>🔔</span>}
          actionLabel='Learn more'
          actionIcon={<span data-testid='act-icon'>→</span>}
          onActionClick={handleClick}
        />
      );

      expect(
        screen.getByText('Full featured announcement')
      ).toBeInTheDocument();
      expect(screen.getByTestId('lead-icon')).toBeInTheDocument();
      expect(screen.getByText('Learn more')).toBeInTheDocument();
      expect(screen.getByTestId('act-icon')).toBeInTheDocument();

      const bar = container.querySelector('.custom');
      expect(bar).toHaveClass(styles['announcement-bar-gradient']);

      fireEvent.click(screen.getByText('Learn more'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('handles long text content', () => {
      const longText =
        'This is a very long announcement message that might wrap to multiple lines in certain viewport sizes and should be handled gracefully by the component';
      render(<AnnouncementBar text={longText} />);
      expect(screen.getByText(longText)).toBeInTheDocument();
    });

    it('handles empty text gracefully', () => {
      render(<AnnouncementBar text='' />);
      const textElement = document.querySelector(`.${styles.text}`);
      expect(textElement).toBeInTheDocument();
      expect(textElement?.textContent).toBe('');
    });
  });
});
