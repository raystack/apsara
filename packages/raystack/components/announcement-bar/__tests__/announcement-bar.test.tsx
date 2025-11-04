import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
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
  });

  describe('Variants', () => {
    const variants = ['normal', 'gradient', 'error'] as const;
    variants.forEach(variant => {
      it(`renders ${variant} variant`, () => {
        const { container } = render(
          <AnnouncementBar text='Test' variant={variant} />
        );
        const bar = container.querySelector('[class*="announcement-bar"]');
        expect(bar).toHaveClass(styles[`announcement-bar-${variant}`]);
      });
    });

    it('renders normal variant by default', () => {
      const { container } = render(<AnnouncementBar text='Test' />);
      const bar = container.querySelector('[class*="announcement-bar"]');
      expect(bar).toHaveClass(styles['announcement-bar-normal']);
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
});
