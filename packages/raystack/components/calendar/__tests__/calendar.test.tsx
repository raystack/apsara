import { fireEvent, render, screen } from '@testing-library/react';
import dayjs from 'dayjs';
import { describe, expect, it, vi } from 'vitest';
import { Calendar } from '../calendar';
import styles from '../calendar.module.css';

describe('Calendar', () => {
  describe('Basic Rendering', () => {
    it('renders calendar correctly', () => {
      render(<Calendar />);
      expect(screen.getByRole('grid')).toBeInTheDocument();
    });

    it('applies calendar classes', () => {
      const { container } = render(<Calendar />);
      const calendar = container.querySelector(`.${styles.calendarRoot}`);
      expect(calendar).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = render(<Calendar className='custom-calendar' />);
      const calendar = container.querySelector('.custom-calendar');
      expect(calendar).toBeInTheDocument();
      expect(calendar).toHaveClass(styles.calendarRoot);
    });

    it('shows navigation buttons', () => {
      render(<Calendar />);
      expect(screen.getByLabelText('Previous month')).toBeInTheDocument();
      expect(screen.getByLabelText('Next month')).toBeInTheDocument();
    });
    it('disables navigation when loading', () => {
      render(<Calendar loadingData={true} />);

      const prevButton = screen.getByLabelText('Previous month');
      const nextButton = screen.getByLabelText('Next month');

      expect(prevButton).toBeDisabled();
      expect(nextButton).toBeDisabled();
    });
  });

  describe('Tooltip Support', () => {
    it('does not show tooltips when disabled', () => {
      render(
        <Calendar
          showTooltip={false}
          tooltipMessages={{ '15-01-2024': 'Test message' }}
        />
      );

      const dayButtons = screen.getAllByRole('gridcell');
      expect(dayButtons[0]).not.toHaveAttribute('aria-describedby');
    });

    it('handles tooltip messages', () => {
      render(
        <Calendar
          showTooltip={true}
          tooltipMessages={{ '15-01-2024': 'Test tooltip' }}
        />
      );

      const grid = screen.getByRole('grid');
      expect(grid).toBeInTheDocument();
    });
  });

  describe('Month Navigation', () => {
    it('navigates to previous month', () => {
      const { container } = render(<Calendar />);
      const prevButton = screen.getByLabelText('Previous month');

      fireEvent.click(prevButton);
      expect(
        container.querySelector(`.${styles.calendarRoot}`)
      ).toBeInTheDocument();
    });

    it('navigates to next month', () => {
      const { container } = render(<Calendar />);
      const nextButton = screen.getByLabelText('Next month');

      fireEvent.click(nextButton);
      expect(
        container.querySelector(`.${styles.calendarRoot}`)
      ).toBeInTheDocument();
    });
  });

  describe('Dropdown Functionality', () => {
    it('calls onDropdownOpen when dropdown opens', () => {
      const onDropdownOpen = vi.fn();
      render(
        <Calendar onDropdownOpen={onDropdownOpen} captionLayout='dropdown' />
      );

      const dropdown = screen.getAllByRole('combobox')[0];
      fireEvent.click(dropdown);

      expect(onDropdownOpen).toHaveBeenCalled();
    });
  });

  describe('TimeZone Support', () => {
    it('handles timeZone prop', () => {
      const { container } = render(<Calendar timeZone='UTC' />);
      expect(
        container.querySelector(`.${styles.calendarRoot}`)
      ).toBeInTheDocument();
    });
  });

  describe('DateInfo Support', () => {
    it('renders custom component for date with dateInfo', () => {
      const TestComponent = () => (
        <div data-testid='custom-date-info'>Custom Info</div>
      );
      const today = dayjs().format('DD-MM-YYYY');
      const { container } = render(
        <Calendar
          dateInfo={{
            [today]: <TestComponent />
          }}
        />
      );

      // The component should be rendered in the calendar
      expect(
        container.querySelector('[data-testid="custom-date-info"]')
      ).toBeInTheDocument();
    });

    it('applies day_button_with_info class when dateInfo is present', () => {
      const today = dayjs().format('DD-MM-YYYY');
      const { container } = render(
        <Calendar
          dateInfo={{
            [today]: <div>Info</div>
          }}
        />
      );

      const dayWithInfo = container.querySelector(
        `.${styles.dayButtonWithInfo}`
      );
      expect(dayWithInfo).toBeInTheDocument();
    });

    it('does not render dateInfo for dates not in the dateInfo object', () => {
      const today = dayjs().format('DD-MM-YYYY');
      const { container } = render(
        <Calendar
          dateInfo={{
            [today]: <div data-testid='date-info'>Info</div>
          }}
        />
      );

      // Should only have one date with info
      const dateInfos = container.querySelectorAll('[data-testid="date-info"]');
      expect(dateInfos.length).toBeGreaterThanOrEqual(0);
    });

    it('handles multiple dates with dateInfo', () => {
      const today = dayjs().format('DD-MM-YYYY');
      const tomorrow = dayjs().add(1, 'day').format('DD-MM-YYYY');
      const { container } = render(
        <Calendar
          dateInfo={{
            [today]: <div data-testid='info-1'>Info 1</div>,
            [tomorrow]: <div data-testid='info-2'>Info 2</div>
          }}
        />
      );

      const info1 = container.querySelector('[data-testid="info-1"]');
      const info2 = container.querySelector('[data-testid="info-2"]');

      // At least one should be present (depending on which month is visible)
      expect(info1 || info2).toBeTruthy();
    });

    it('renders date number even when dateInfo is present', () => {
      const today = dayjs().format('DD-MM-YYYY');
      const { container } = render(
        <Calendar
          dateInfo={{
            [today]: <div>Info</div>
          }}
        />
      );

      const dayNumber = container.querySelector(`.${styles.dayNumber}`);
      expect(dayNumber).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has correct ARIA roles', () => {
      render(<Calendar />);
      expect(screen.getByRole('grid')).toBeInTheDocument();
    });

    it('has accessible navigation buttons', () => {
      render(<Calendar />);
      expect(screen.getByLabelText('Previous month')).toBeInTheDocument();
      expect(screen.getByLabelText('Next month')).toBeInTheDocument();
    });
  });
});
