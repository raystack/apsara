import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Skeleton } from '../skeleton';
import styles from '../skeleton.module.css';

describe('Skeleton', () => {
  describe('Basic Rendering', () => {
    it('renders skeleton element', () => {
      const { container } = render(<Skeleton />);
      const skeleton = container.querySelector(`.${styles.skeleton}`);
      expect(skeleton).toBeInTheDocument();
    });

    it('renders as div container by default', () => {
      const { container } = render(<Skeleton />);
      const wrapper = container.firstChild;
      expect(wrapper?.nodeName).toBe('DIV');
    });

    it('renders as span container when inline', () => {
      const { container } = render(<Skeleton inline />);
      const wrapper = container.firstChild;
      expect(wrapper?.nodeName).toBe('SPAN');
    });

    it('applies custom className to skeleton', () => {
      const { container } = render(<Skeleton className='custom-skeleton' />);
      const skeleton = container.querySelector(`.${styles.skeleton}`);
      expect(skeleton).toHaveClass('custom-skeleton');
    });

    it('applies container className', () => {
      const { container } = render(
        <Skeleton containerClassName='container-class' />
      );
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('container-class');
    });
  });

  describe('Dimensions', () => {
    it('sets default width to 100% for block', () => {
      const { container } = render(<Skeleton />);
      const skeleton = container.querySelector(
        `.${styles.skeleton}`
      ) as HTMLElement;
      expect(skeleton.style.width).toBe('100%');
    });

    it('sets default width to 50px for inline', () => {
      const { container } = render(<Skeleton inline />);
      const skeleton = container.querySelector(
        `.${styles.skeleton}`
      ) as HTMLElement;
      expect(skeleton.style.width).toBe('50px');
    });

    it('sets custom width as string', () => {
      const { container } = render(<Skeleton width='200px' />);
      const skeleton = container.querySelector(
        `.${styles.skeleton}`
      ) as HTMLElement;
      expect(skeleton.style.width).toBe('200px');
    });

    it('sets custom width as number', () => {
      const { container } = render(<Skeleton width={150} />);
      const skeleton = container.querySelector(
        `.${styles.skeleton}`
      ) as HTMLElement;
      expect(skeleton.style.width).toBe('150px');
    });

    it('sets default height', () => {
      const { container } = render(<Skeleton />);
      const skeleton = container.querySelector(
        `.${styles.skeleton}`
      ) as HTMLElement;
      expect(skeleton.style.height).toBe('var(--rs-space-4)');
    });

    it('sets custom height as string', () => {
      const { container } = render(<Skeleton height='50px' />);
      const skeleton = container.querySelector(
        `.${styles.skeleton}`
      ) as HTMLElement;
      expect(skeleton.style.height).toBe('50px');
    });

    it('sets custom height as number', () => {
      const { container } = render(<Skeleton height={30} />);
      const skeleton = container.querySelector(
        `.${styles.skeleton}`
      ) as HTMLElement;
      expect(skeleton.style.height).toBe('30px');
    });
  });

  describe('Styling', () => {
    it('sets default border radius', () => {
      const { container } = render(<Skeleton />);
      const skeleton = container.querySelector(
        `.${styles.skeleton}`
      ) as HTMLElement;
      expect(skeleton.style.borderRadius).toBe('var(--rs-radius-2)');
    });

    it('sets custom border radius as string', () => {
      const { container } = render(<Skeleton borderRadius='10px' />);
      const skeleton = container.querySelector(
        `.${styles.skeleton}`
      ) as HTMLElement;
      expect(skeleton.style.borderRadius).toBe('10px');
    });

    it('sets custom border radius as number', () => {
      const { container } = render(<Skeleton borderRadius={5} />);
      const skeleton = container.querySelector(
        `.${styles.skeleton}`
      ) as HTMLElement;
      expect(skeleton.style.borderRadius).toBe('5px');
    });

    it('applies custom styles', () => {
      const { container } = render(<Skeleton style={{ margin: '10px' }} />);
      const skeleton = container.querySelector(
        `.${styles.skeleton}`
      ) as HTMLElement;
      expect(skeleton.style.margin).toBe('10px');
    });

    it('applies container styles', () => {
      const { container } = render(
        <Skeleton containerStyle={{ padding: '20px' }} />
      );
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.style.padding).toBe('20px');
    });
  });

  describe('Animation', () => {
    it('applies animation class by default', () => {
      const { container } = render(<Skeleton />);
      const skeleton = container.querySelector(`.${styles.skeleton}`);
      expect(skeleton).toHaveClass(styles.animate);
    });

    it('removes animation when disabled', () => {
      const { container } = render(<Skeleton enableAnimation={false} />);
      const skeleton = container.querySelector(`.${styles.skeleton}`);
      expect(skeleton).not.toHaveClass(styles.animate);
    });

    it('sets custom duration', () => {
      const { container } = render(<Skeleton duration={2} />);
      const skeleton = container.querySelector(
        `.${styles.skeleton}`
      ) as HTMLElement;
      expect(skeleton.style.getPropertyValue('--skeleton-duration')).toBe('2s');
    });

    it('sets default duration', () => {
      const { container } = render(<Skeleton />);
      const skeleton = container.querySelector(
        `.${styles.skeleton}`
      ) as HTMLElement;
      expect(skeleton.style.getPropertyValue('--skeleton-duration')).toBe(
        '1.5s'
      );
    });
  });

  describe('Multiple Skeletons', () => {
    it('renders single skeleton by default', () => {
      const { container } = render(<Skeleton />);
      const skeletons = container.querySelectorAll(`.${styles.skeleton}`);
      expect(skeletons).toHaveLength(1);
    });

    it('renders multiple skeletons with count', () => {
      const { container } = render(<Skeleton count={3} />);
      const skeletons = container.querySelectorAll(`.${styles.skeleton}`);
      expect(skeletons).toHaveLength(3);
    });

    it('applies gap between multiple block skeletons', () => {
      const { container } = render(<Skeleton count={2} />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.style.gap).toBe('var(--rs-space-3)');
    });

    it('does not apply gap for single skeleton', () => {
      const { container } = render(<Skeleton count={1} />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.style.gap).toBe('');
    });

    it('does not apply gap for inline skeletons', () => {
      const { container } = render(<Skeleton count={2} inline />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.style.gap).toBe('');
    });
  });

  describe('Inline Mode', () => {
    it('applies inline class', () => {
      const { container } = render(<Skeleton inline />);
      const skeleton = container.querySelector(`.${styles.skeleton}`);
      expect(skeleton).toHaveClass(styles.inline);
    });

    it('sets inline-block display for container', () => {
      const { container } = render(<Skeleton inline />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.style.display).toBe('inline-block');
    });

    it('sets flex display for block container', () => {
      const { container } = render(<Skeleton />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.style.display).toBe('flex');
    });
  });

  describe('Provider', () => {
    it('inherits props from provider', () => {
      const { container } = render(
        <Skeleton.Provider width='300px' height='40px'>
          <Skeleton />
        </Skeleton.Provider>
      );
      const skeleton = container.querySelector(
        `.${styles.skeleton}`
      ) as HTMLElement;
      expect(skeleton.style.width).toBe('300px');
      expect(skeleton.style.height).toBe('40px');
    });

    it('local props override provider props', () => {
      const { container } = render(
        <Skeleton.Provider width='300px'>
          <Skeleton width='500px' />
        </Skeleton.Provider>
      );
      const skeleton = container.querySelector(
        `.${styles.skeleton}`
      ) as HTMLElement;
      expect(skeleton.style.width).toBe('500px');
    });

    it('works with multiple skeletons', () => {
      const { container } = render(
        <Skeleton.Provider height='30px'>
          <div>
            <Skeleton />
            <Skeleton />
          </div>
        </Skeleton.Provider>
      );
      const skeletons = container.querySelectorAll(`.${styles.skeleton}`);
      expect(skeletons).toHaveLength(2);
      skeletons.forEach(skeleton => {
        expect((skeleton as HTMLElement).style.height).toBe('30px');
      });
    });
  });
});
