import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentPropsWithoutRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Tabs } from '../tabs';
import styles from '../tabs.module.css';

const TAB_1_TEXT = 'Tab 1';
const TAB_2_TEXT = 'Tab 2';
const CONTENT_1_TEXT = 'Content 1';
const CONTENT_2_TEXT = 'Content 2';
const CUSTOM_ARIA_LABEL = 'Navigation tabs';

type TabsProps = ComponentPropsWithoutRef<typeof Tabs>;

const BasicTabs = ({
  defaultValue = 'tab1',
  hasDisabledTab = false,
  ...props
}: TabsProps & { hasDisabledTab?: boolean }) => (
  <Tabs defaultValue={defaultValue} {...props}>
    <Tabs.List>
      <Tabs.Tab value='tab1'>{TAB_1_TEXT}</Tabs.Tab>
      <Tabs.Tab value='tab2' disabled={hasDisabledTab}>
        {TAB_2_TEXT}
      </Tabs.Tab>
    </Tabs.List>
    <Tabs.Content value='tab1'>{CONTENT_1_TEXT}</Tabs.Content>
    <Tabs.Content value='tab2'>{CONTENT_2_TEXT}</Tabs.Content>
  </Tabs>
);

describe('Tabs', () => {
  describe('Basic Rendering', () => {
    it('renders tabs root', () => {
      render(<BasicTabs />);

      expect(screen.getByRole('tablist')).toBeInTheDocument();
    });

    it('renders tabs', () => {
      render(<BasicTabs />);

      expect(screen.getByText(TAB_1_TEXT)).toBeInTheDocument();
      expect(screen.getByText(TAB_2_TEXT)).toBeInTheDocument();
    });

    it('renders tab content', () => {
      render(<BasicTabs />);

      expect(screen.getByRole('tabpanel')).toBeInTheDocument();
      expect(screen.getByText(CONTENT_1_TEXT)).toBeInTheDocument();
    });

    it('works as controlled component', () => {
      const { rerender } = render(<BasicTabs value='tab1' />);

      expect(screen.getByText(CONTENT_1_TEXT)).toBeInTheDocument();

      rerender(<BasicTabs value='tab2' />);

      expect(screen.queryByText(CONTENT_1_TEXT)).not.toBeInTheDocument();
      expect(screen.getByText(CONTENT_2_TEXT)).toBeInTheDocument();
    });
  });

  describe('Tab Selection', () => {
    it('shows content for default tab', () => {
      render(<BasicTabs defaultValue='tab2' />);

      expect(screen.getByText(CONTENT_2_TEXT)).toBeInTheDocument();
      expect(screen.queryByText(CONTENT_1_TEXT)).not.toBeInTheDocument();
    });

    it('switches content when clicking tabs', async () => {
      const user = userEvent.setup();
      render(<BasicTabs />);

      expect(screen.getByText(CONTENT_1_TEXT)).toBeInTheDocument();
      expect(screen.queryByText(CONTENT_2_TEXT)).not.toBeInTheDocument();

      await user.click(screen.getByText(TAB_2_TEXT));

      await waitFor(() => {
        expect(screen.getByText(CONTENT_2_TEXT)).toBeInTheDocument();
        expect(screen.queryByText(CONTENT_1_TEXT)).not.toBeInTheDocument();
      });
    });

    it('maintains selected state on triggers', async () => {
      const user = userEvent.setup();
      render(<BasicTabs />);

      const tab1 = screen.getByText(TAB_1_TEXT);
      const tab2 = screen.getByText(TAB_2_TEXT);

      expect(tab1).toHaveAttribute('aria-selected', 'true');
      expect(tab2).toHaveAttribute('aria-selected', 'false');

      await user.click(tab2);

      expect(tab1).toHaveAttribute('aria-selected', 'false');
      expect(tab2).toHaveAttribute('aria-selected', 'true');
    });

    it('calls onValueChange when tab changes', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<BasicTabs onValueChange={handleChange} />);

      await user.click(screen.getByText(TAB_2_TEXT));
      // Base UI calls onValueChange with (value, details) - check first argument
      expect(handleChange).toHaveBeenCalled();
      expect(handleChange.mock.calls[0][0]).toBe('tab2');
    });
  });

  describe('Disabled State', () => {
    it('disables individual tabs', () => {
      render(<BasicTabs hasDisabledTab />);

      const disabledTab = screen.getByText(TAB_2_TEXT);
      // Base UI uses aria-disabled and data-disabled attributes
      expect(disabledTab).toHaveAttribute('aria-disabled', 'true');
      expect(disabledTab).toHaveAttribute('data-disabled', '');
    });

    it('does not allow clicking disabled tabs', () => {
      const handleChange = vi.fn();
      render(<BasicTabs hasDisabledTab onValueChange={handleChange} />);

      fireEvent.click(screen.getByText(TAB_2_TEXT));
      expect(handleChange).not.toHaveBeenCalled();
      expect(screen.getByText(CONTENT_1_TEXT)).toBeInTheDocument();
    });
  });

  describe('Leading Icons', () => {
    it('renders trigger with leadingIcon', () => {
      const icon = <span data-testid='tab-icon'>📁</span>;
      render(
        <Tabs defaultValue='tab1'>
          <Tabs.List>
            <Tabs.Tab value='tab1' leadingIcon={icon}>
              {TAB_1_TEXT}
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Content value='tab1'>{CONTENT_1_TEXT}</Tabs.Content>
        </Tabs>
      );

      expect(screen.getByTestId('tab-icon')).toBeInTheDocument();
    });

    it('wraps leadingIcon in trigger-icon class', () => {
      const icon = <span data-testid='tab-icon'>📁</span>;
      const { container } = render(
        <Tabs defaultValue='tab1'>
          <Tabs.List>
            <Tabs.Tab value='tab1' leadingIcon={icon}>
              {TAB_1_TEXT}
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Content value='tab1'>{CONTENT_1_TEXT}</Tabs.Content>
        </Tabs>
      );

      const iconWrapper = container.querySelector(`.${styles['trigger-icon']}`);
      expect(iconWrapper).toBeInTheDocument();
      expect(iconWrapper).toContainElement(screen.getByTestId('tab-icon'));
    });
  });

  describe('Indicator', () => {
    it('automatically renders indicator in list', () => {
      const { container } = render(
        <Tabs defaultValue='tab1'>
          <Tabs.List>
            <Tabs.Tab value='tab1'>{TAB_1_TEXT}</Tabs.Tab>
            <Tabs.Tab value='tab2'>{TAB_2_TEXT}</Tabs.Tab>
          </Tabs.List>
          <Tabs.Content value='tab1'>{CONTENT_1_TEXT}</Tabs.Content>
        </Tabs>
      );

      // Indicator is automatically included in the List
      expect(
        container.querySelector(`.${styles.indicator}`)
      ).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has correct ARIA roles', () => {
      render(<BasicTabs />);

      expect(screen.getByRole('tablist')).toBeInTheDocument();
      screen.getAllByRole('tab').forEach(tab => {
        expect(tab).toBeInTheDocument();
      });
      expect(screen.getByRole('tabpanel')).toBeInTheDocument();
    });

    it('has correct ARIA attributes on triggers', () => {
      render(<BasicTabs />);

      const tab1 = screen.getByText(TAB_1_TEXT);
      const tab2 = screen.getByText(TAB_2_TEXT);

      expect(tab1).toHaveAttribute('aria-selected', 'true');
      expect(tab2).toHaveAttribute('aria-selected', 'false');
    });

    it('has correct ARIA attributes on content', () => {
      render(<BasicTabs />);

      const content = screen.getByRole('tabpanel');
      expect(content).toHaveAttribute('aria-labelledby');
    });

    it('supports custom aria-label', () => {
      render(
        <Tabs defaultValue='tab1' aria-label={CUSTOM_ARIA_LABEL}>
          <Tabs.List>
            <Tabs.Tab value='tab1'>{TAB_1_TEXT}</Tabs.Tab>
          </Tabs.List>
          <Tabs.Content value='tab1'>{CONTENT_1_TEXT}</Tabs.Content>
        </Tabs>
      );

      const tablist = screen.getByRole('tablist');
      expect(
        tablist.closest(`[aria-label="${CUSTOM_ARIA_LABEL}"]`)
      ).toBeInTheDocument();
    });
  });

  describe('Orientation', () => {
    it('supports vertical orientation', () => {
      render(<BasicTabs orientation='vertical' />);

      const tablist = screen.getByRole('tablist');
      expect(tablist).toHaveAttribute('aria-orientation', 'vertical');
    });

    it('has correct data-orientation attribute', () => {
      render(<BasicTabs />);

      const tab = screen.getByText(TAB_1_TEXT);
      expect(tab).toHaveAttribute('data-orientation', 'horizontal');
    });
  });

  describe('Data Attributes', () => {
    it('has aria-selected on active trigger', () => {
      render(<BasicTabs />);

      const tab1 = screen.getByText(TAB_1_TEXT);
      const tab2 = screen.getByText(TAB_2_TEXT);

      // Base UI uses aria-selected for indicating the active tab
      expect(tab1).toHaveAttribute('aria-selected', 'true');
      expect(tab2).toHaveAttribute('aria-selected', 'false');
    });

    it('updates aria-selected when switching tabs', async () => {
      const user = userEvent.setup();
      render(<BasicTabs />);

      const tab1 = screen.getByText(TAB_1_TEXT);
      const tab2 = screen.getByText(TAB_2_TEXT);

      expect(tab1).toHaveAttribute('aria-selected', 'true');
      expect(tab2).toHaveAttribute('aria-selected', 'false');

      await user.click(tab2);

      await waitFor(() => {
        expect(tab1).toHaveAttribute('aria-selected', 'false');
        expect(tab2).toHaveAttribute('aria-selected', 'true');
      });
    });
  });
});
