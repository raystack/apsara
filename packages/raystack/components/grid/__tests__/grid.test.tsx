import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Grid } from '../grid';

describe('Grid', () => {
  describe('Basic Rendering', () => {
    it('renders with children', () => {
      const { container } = render(<Grid>Content</Grid>);
      expect(container.textContent).toBe('Content');
    });

    it('renders as div element by default', () => {
      const { container } = render(<Grid>Test</Grid>);
      const element = container.firstChild;
      expect(element?.nodeName).toBe('DIV');
    });

    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(<Grid ref={ref}>Content</Grid>);
      expect(ref).toHaveBeenCalled();
    });

    it('applies grid display style', () => {
      const { container } = render(<Grid>Content</Grid>);
      const grid = container.firstChild as HTMLElement;
      expect(grid).toHaveStyle({ display: 'grid' });
    });

    it('applies inline-grid when inline is true', () => {
      const { container } = render(<Grid inline>Content</Grid>);
      const grid = container.firstChild as HTMLElement;
      expect(grid).toHaveStyle({ display: 'inline-grid' });
    });
  });

  describe('Columns and Rows', () => {
    it('renders with numeric columns', () => {
      const { container } = render(<Grid columns={3}>Content</Grid>);
      const grid = container.firstChild as HTMLElement;
      expect(grid).toHaveStyle({ gridTemplateColumns: 'repeat(3, 1fr)' });
    });

    it('renders with string columns', () => {
      const { container } = render(<Grid columns='1fr 2fr 1fr'>Content</Grid>);
      const grid = container.firstChild as HTMLElement;
      expect(grid).toHaveStyle({ gridTemplateColumns: '1fr 2fr 1fr' });
    });

    it('renders with numeric rows', () => {
      const { container } = render(<Grid rows={2}>Content</Grid>);
      const grid = container.firstChild as HTMLElement;
      expect(grid).toHaveStyle({ gridTemplateRows: 'repeat(2, 1fr)' });
    });

    it('renders with string rows', () => {
      const { container } = render(<Grid rows='auto 1fr auto'>Content</Grid>);
      const grid = container.firstChild as HTMLElement;
      expect(grid).toHaveStyle({ gridTemplateRows: 'auto 1fr auto' });
    });
  });

  describe('Template Areas', () => {
    it('renders with string template areas', () => {
      const { container } = render(
        <Grid templateAreas='header header header'>Content</Grid>
      );
      const grid = container.firstChild as HTMLElement;
      expect(grid).toHaveStyle({ gridTemplateAreas: 'header header header' });
    });

    it('renders with array template areas', () => {
      const { container } = render(
        <Grid
          templateAreas={['header header', 'sidebar main', 'footer footer']}
        >
          Content
        </Grid>
      );
      const grid = container.firstChild as HTMLElement;
      expect(grid).toHaveStyle({
        gridTemplateAreas: '"header header" "sidebar main" "footer footer"'
      });
    });
  });

  describe('Gap Properties', () => {
    const gaps = [
      'extra-small',
      'small',
      'medium',
      'large',
      'extra-large'
    ] as const;
    const gapValues = {
      'extra-small': 'var(--rs-space-2)',
      small: 'var(--rs-space-3)',
      medium: 'var(--rs-space-5)',
      large: 'var(--rs-space-9)',
      'extra-large': 'var(--rs-space-11)'
    };

    it.each(gaps)('renders %s gap correctly', gap => {
      const { container } = render(<Grid gap={gap}>Content</Grid>);
      const grid = container.firstChild as HTMLElement;
      expect(grid).toHaveStyle({ gap: gapValues[gap] });
    });

    it.each(gaps)('renders %s column gap correctly', gap => {
      const { container } = render(<Grid columnGap={gap}>Content</Grid>);
      const grid = container.firstChild as HTMLElement;
      expect(grid).toHaveStyle({ columnGap: gapValues[gap] });
    });

    it.each(gaps)('renders %s row gap correctly', gap => {
      const { container } = render(<Grid rowGap={gap}>Content</Grid>);
      const grid = container.firstChild as HTMLElement;
      expect(grid).toHaveStyle({ rowGap: gapValues[gap] });
    });
  });

  describe('Auto Flow', () => {
    const flows = [
      'row',
      'column',
      'dense',
      'row dense',
      'column dense'
    ] as const;

    it.each(flows)('renders %s auto flow correctly', flow => {
      const { container } = render(<Grid autoFlow={flow}>Content</Grid>);
      const grid = container.firstChild as HTMLElement;
      expect(grid).toHaveStyle({ gridAutoFlow: flow });
    });
  });

  describe('Auto Sizing', () => {
    it('renders with auto columns', () => {
      const { container } = render(
        <Grid autoColumns='minmax(100px, auto)'>Content</Grid>
      );
      const grid = container.firstChild as HTMLElement;
      expect(grid).toHaveStyle({ gridAutoColumns: 'minmax(100px, auto)' });
    });

    it('renders with auto rows', () => {
      const { container } = render(
        <Grid autoRows='minmax(50px, 1fr)'>Content</Grid>
      );
      const grid = container.firstChild as HTMLElement;
      expect(grid).toHaveStyle({ gridAutoRows: 'minmax(50px, 1fr)' });
    });
  });

  describe('Alignment', () => {
    const alignments = ['start', 'end', 'center', 'stretch'] as const;
    const extendedAlignments = [
      'space-around',
      'space-between',
      'space-evenly'
    ] as const;

    it.each(alignments)('renders %s justify items correctly', align => {
      const { container } = render(<Grid justifyItems={align}>Content</Grid>);
      const grid = container.firstChild as HTMLElement;
      expect(grid).toHaveStyle({ justifyItems: align });
    });

    it.each(alignments)('renders %s align items correctly', align => {
      const { container } = render(<Grid alignItems={align}>Content</Grid>);
      const grid = container.firstChild as HTMLElement;
      expect(grid).toHaveStyle({ alignItems: align });
    });

    it.each([...alignments, ...extendedAlignments])(
      'renders %s justify content correctly',
      align => {
        const { container } = render(
          <Grid justifyContent={align}>Content</Grid>
        );
        const grid = container.firstChild as HTMLElement;
        expect(grid).toHaveStyle({ justifyContent: align });
      }
    );

    it.each([...alignments, ...extendedAlignments])(
      'renders %s align content correctly',
      align => {
        const { container } = render(<Grid alignContent={align}>Content</Grid>);
        const grid = container.firstChild as HTMLElement;
        expect(grid).toHaveStyle({ alignContent: align });
      }
    );
  });

  describe('AsChild Prop', () => {
    it('renders as child component when asChild is true', () => {
      const { container } = render(
        <Grid asChild>
          <section>Grid Content</section>
        </Grid>
      );
      const element = container.firstChild;
      expect(element?.nodeName).toBe('SECTION');
      expect(element).toHaveStyle({ display: 'grid' });
    });
  });

  describe('HTML Attributes', () => {
    it('supports className', () => {
      const { container } = render(
        <Grid className='custom-grid'>Content</Grid>
      );
      const grid = container.firstChild as HTMLElement;
      expect(grid).toHaveClass('custom-grid');
    });

    // it('supports custom styles', () => {
    //   const { container } = render(
    //     <Grid style={{ backgroundColor: 'red', padding: '10px' }}>Content</Grid>
    //   );
    //   const grid = container.firstChild as HTMLElement;
    //   expect(grid).toHaveStyle({ backgroundColor: 'red', padding: '10px' });
    // });

    it('supports data attributes', () => {
      const { container } = render(
        <Grid data-testid='test-grid'>Content</Grid>
      );
      const grid = container.querySelector('[data-testid="test-grid"]');
      expect(grid).toBeInTheDocument();
    });
  });

  describe('Combinations', () => {
    it('renders with all props combined', () => {
      const { container } = render(
        <Grid
          columns={3}
          rows='auto 1fr auto'
          gap='medium'
          autoFlow='row dense'
          alignItems='center'
          justifyContent='space-between'
          className='custom'
        >
          Content
        </Grid>
      );

      const grid = container.firstChild as HTMLElement;
      expect(grid).toHaveStyle({
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridTemplateRows: 'auto 1fr auto',
        gap: 'var(--rs-space-5)',
        gridAutoFlow: 'row dense',
        alignItems: 'center',
        justifyContent: 'space-between'
      });
      expect(grid).toHaveClass('custom');
    });
  });
});
