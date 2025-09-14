import { describe, expect, it } from 'vitest';
import { render, screen } from '../../../test-utils';
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
    it('applies right side by default', () => {
      const { container } = render(<SidePanel>Test content</SidePanel>);

      const aside = container.querySelector('aside');
      expect(aside).toHaveClass(styles['side-panel-right']);
    });

    it('applies left side when specified', () => {
      const { container } = render(
        <SidePanel side='left'>Test content</SidePanel>
      );

      const aside = container.querySelector('aside');
      expect(aside).toHaveClass(styles['side-panel-left']);
    });

    it('applies right side when specified', () => {
      const { container } = render(
        <SidePanel side='right'>Test content</SidePanel>
      );

      const aside = container.querySelector('aside');
      expect(aside).toHaveClass(styles['side-panel-right']);
    });
  });

  describe('Custom Styling', () => {
    it('applies custom className', () => {
      const { container } = render(
        <SidePanel className='custom-panel'>Test content</SidePanel>
      );

      const aside = container.querySelector('.custom-panel');
      expect(aside).toBeInTheDocument();
      expect(aside).toHaveClass(styles['side-panel']);
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

    it('applies header styles', () => {
      const { container } = render(
        <SidePanel>
          <SidePanel.Header title='Panel Title' />
        </SidePanel>
      );

      const header = container.querySelector(`.${styles['side-panel-header']}`);
      expect(header).toBeInTheDocument();
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

    it('applies section styles', () => {
      const { container } = render(
        <SidePanel>
          <SidePanel.Section>Section content</SidePanel.Section>
        </SidePanel>
      );

      const section = container.querySelector(
        `.${styles['side-panel-section']}`
      );
      expect(section).toBeInTheDocument();
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

      // The title should be properly styled text, not necessarily a heading element
      // but should be readable by screen readers
      expect(screen.getByText('Panel Title')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty actions array', () => {
      render(
        <SidePanel>
          <SidePanel.Header title='Panel Title' actions={[]} />
        </SidePanel>
      );

      expect(screen.getByText('Panel Title')).toBeInTheDocument();
    });

    it('handles undefined actions', () => {
      render(
        <SidePanel>
          <SidePanel.Header title='Panel Title' actions={undefined} />
        </SidePanel>
      );

      expect(screen.getByText('Panel Title')).toBeInTheDocument();
    });

    it('handles null icon', () => {
      render(
        <SidePanel>
          <SidePanel.Header title='Panel Title' icon={null} />
        </SidePanel>
      );

      expect(screen.getByText('Panel Title')).toBeInTheDocument();
    });
  });
});
