import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SidePanel } from '../side-panel';
import styles from '../side-panel.module.css';

describe('SidePanel', () => {
  describe('Basic Rendering', () => {
    it('renders children correctly', () => {
      render(
        <SidePanel>
          <div>Test content</div>
        </SidePanel>
      );

      expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('renders as aside element', () => {
      const { container } = render(<SidePanel>Test content</SidePanel>);

      const aside = container.querySelector('aside');
      expect(aside).toBeInTheDocument();
    });

    it('applies side panel classes', () => {
      const { container } = render(<SidePanel>Test content</SidePanel>);

      const aside = container.querySelector('aside');
      expect(aside).toHaveClass(styles['side-panel']);
    });
  });

  describe('Side Variants', () => {
    const sideVariants = ['left', 'right'] as const;
    it.each(sideVariants)('applies %s side by default', side => {
      const { container } = render(
        <SidePanel side={side}>Test content</SidePanel>
      );

      const aside = container.querySelector('aside');
      expect(aside).toHaveClass(styles[`side-panel-${side}`]);
    });

    it('applies right side by default', () => {
      const { container } = render(<SidePanel>Test content</SidePanel>);

      const aside = container.querySelector('aside');
      expect(aside).toHaveClass(styles['side-panel-right']);
    });
  });

  describe('SidePanel Header', () => {
    it('renders header with title', () => {
      render(
        <SidePanel>
          <SidePanel.Header title='Panel Title' />
        </SidePanel>
      );

      expect(screen.getByText('Panel Title')).toBeInTheDocument();
    });

    it('renders header with icon', () => {
      const icon = <span data-testid='panel-icon'>📋</span>;
      render(
        <SidePanel>
          <SidePanel.Header title='Panel Title' icon={icon} />
        </SidePanel>
      );

      expect(screen.getByTestId('panel-icon')).toBeInTheDocument();
      expect(screen.getByText('📋')).toBeInTheDocument();
    });

    it('renders header with description', () => {
      render(
        <SidePanel>
          <SidePanel.Header
            title='Panel Title'
            description='This is a panel description'
          />
        </SidePanel>
      );

      expect(screen.getByText('Panel Title')).toBeInTheDocument();
      expect(
        screen.getByText('This is a panel description')
      ).toBeInTheDocument();
    });

    it('renders header with actions', () => {
      const actions = [
        <button key='1'>Action 1</button>,
        <button key='2'>Action 2</button>
      ];

      render(
        <SidePanel>
          <SidePanel.Header title='Panel Title' actions={actions} />
        </SidePanel>
      );

      expect(screen.getByText('Action 1')).toBeInTheDocument();
      expect(screen.getByText('Action 2')).toBeInTheDocument();
    });

    it('renders header with all elements', () => {
      const icon = <span data-testid='panel-icon'>📋</span>;
      const actions = [<button key='1'>Close</button>];

      render(
        <SidePanel>
          <SidePanel.Header
            title='Complete Panel'
            icon={icon}
            description='Panel with all elements'
            actions={actions}
          />
        </SidePanel>
      );

      expect(screen.getByText('Complete Panel')).toBeInTheDocument();
      expect(screen.getByTestId('panel-icon')).toBeInTheDocument();
      expect(screen.getByText('Panel with all elements')).toBeInTheDocument();
      expect(screen.getByText('Close')).toBeInTheDocument();
    });

    it('does not render description when not provided', () => {
      render(
        <SidePanel>
          <SidePanel.Header title='Panel Title' />
        </SidePanel>
      );

      expect(screen.getByText('Panel Title')).toBeInTheDocument();
      const header = screen
        .getByText('Panel Title')
        .closest(`.${styles['side-panel-header']}`);
      expect(header?.children).toHaveLength(1); // Only the Flex container, no description
    });
  });

  describe('SidePanel Section', () => {
    it('renders section with children', () => {
      render(
        <SidePanel>
          <SidePanel.Section>
            <div>Section content</div>
          </SidePanel.Section>
        </SidePanel>
      );

      expect(screen.getByText('Section content')).toBeInTheDocument();
    });

    it('renders multiple sections', () => {
      render(
        <SidePanel>
          <SidePanel.Section>Section 1</SidePanel.Section>
          <SidePanel.Section>Section 2</SidePanel.Section>
        </SidePanel>
      );

      expect(screen.getByText('Section 1')).toBeInTheDocument();
      expect(screen.getByText('Section 2')).toBeInTheDocument();
    });
  });

  describe('Complete Panel Structure', () => {
    it('renders full panel with header and sections', () => {
      const icon = <span data-testid='panel-icon'>📋</span>;
      const actions = [<button key='1'>Close</button>];

      render(
        <SidePanel side='left'>
          <SidePanel.Header
            title='Full Panel'
            icon={icon}
            description='A complete side panel example'
            actions={actions}
          />
          <SidePanel.Section>
            <div>First section content</div>
          </SidePanel.Section>
          <SidePanel.Section>
            <div>Second section content</div>
          </SidePanel.Section>
        </SidePanel>
      );

      expect(screen.getByText('Full Panel')).toBeInTheDocument();
      expect(screen.getByTestId('panel-icon')).toBeInTheDocument();
      expect(
        screen.getByText('A complete side panel example')
      ).toBeInTheDocument();
      expect(screen.getByText('Close')).toBeInTheDocument();
      expect(screen.getByText('First section content')).toBeInTheDocument();
      expect(screen.getByText('Second section content')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('uses semantic aside element', () => {
      const { container } = render(<SidePanel>Test content</SidePanel>);

      const aside = container.querySelector('aside');
      expect(aside).toBeInTheDocument();
    });

    it('maintains proper heading structure', () => {
      render(
        <SidePanel>
          <SidePanel.Header title='Panel Title' />
        </SidePanel>
      );

      expect(screen.getByText('Panel Title')).toBeInTheDocument();
    });
  });
});
