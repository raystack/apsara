import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Avatar, AvatarGroup } from '../avatar';
import styles from '../avatar.module.css';
import { getAvatarColor } from '../utils';

describe('Avatar', () => {
  const ogImage = window.Image;

  beforeAll(() => {
    window.Image = MockImage as any;
  });

  afterAll(() => {
    window.Image = ogImage;
  });

  describe('Basic Rendering', () => {
    it('renders with image source', async () => {
      const src =
        'https://images.unsplash.com/photo-1511485977113-f34c92461ad9';
      const rendered = render(
        <Avatar src={src} alt='John Doe' fallback='JD' />
      );

      const img = await rendered.findByRole('img');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', src);
    });

    it('applies custom className', () => {
      const { container } = render(
        <Avatar className='custom-class' fallback='JD' />
      );
      const avatar = container.querySelector('.custom-class');
      expect(avatar).toBeInTheDocument();
      expect(avatar).toHaveClass(styles.avatar);
    });

    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(<Avatar ref={ref} fallback='JD' />);
      expect(ref).toHaveBeenCalled();
    });

    it('renders with fallback text', () => {
      render(<Avatar fallback='JD' />);
      expect(screen.getByText('JD')).toBeInTheDocument();
    });

    it('renders JSX fallback', () => {
      render(
        <Avatar fallback={<span data-testid='custom-fallback'>👤</span>} />
      );
      expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
    });
  });

  describe('Sizes', () => {
    const sizes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13] as const;

    it.each(sizes)('renders size %i correctly', size => {
      const { container } = render(<Avatar size={size} fallback='JD' />);
      const avatar = container.querySelector('[class*="avatar"]');
      expect(avatar).toHaveClass(styles[`avatar-size-${size}`]);
    });

    it('defaults to size 3', () => {
      const { container } = render(<Avatar fallback='JD' />);
      const avatar = container.querySelector('[class*="avatar"]');
      expect(avatar).toHaveClass(styles['avatar-size-3']);
    });
  });

  describe('Radius', () => {
    const radii = ['small', 'full'] as const;
    it.each(radii)('renders %s radius', radius => {
      const { container } = render(<Avatar radius={radius} fallback='JD' />);
      const avatar = container.querySelector('[class*="avatar"]');
      expect(avatar).toHaveClass(styles[`avatar-${radius}`]);
    });

    it('defaults to small radius', () => {
      const { container } = render(<Avatar fallback='JD' />);
      const avatar = container.querySelector('[class*="avatar"]');
      expect(avatar).toHaveClass(styles['avatar-small']);
    });
  });

  describe('Variants', () => {
    const variants = ['solid', 'soft'] as const;
    it.each(variants)('renders %s variant', variant => {
      const { container } = render(<Avatar variant={variant} fallback='JD' />);
      const avatar = container.querySelector('[class*="avatar"]');
      expect(avatar).toHaveClass(styles[`avatar-${variant}`]);
    });

    it('defaults to soft variant', () => {
      const { container } = render(<Avatar fallback='JD' />);
      const avatar = container.querySelector('[class*="avatar"]');
      expect(avatar).toHaveClass(styles['avatar-soft']);
    });
  });

  describe('Colors', () => {
    const colors = [
      'indigo',
      'orange',
      'mint',
      'neutral',
      'sky',
      'lime',
      'grass',
      'cyan',
      'iris',
      'purple',
      'pink',
      'crimson',
      'gold'
    ] as const;

    it.each(colors)('renders %s color correctly', color => {
      const { container } = render(<Avatar color={color} fallback='JD' />);
      const avatar = container.querySelector('[class*="avatar"]');
      expect(avatar).toHaveClass(styles[`avatar-color-${color}`]);
    });

    it('defaults to indigo color', () => {
      const { container } = render(<Avatar fallback='JD' />);
      const avatar = container.querySelector('[class*="avatar"]');
      expect(avatar).toHaveClass(styles['avatar-color-indigo']);
    });
  });

  describe('AvatarGroup', () => {
    const createAvatars = (count: number) =>
      Array.from({ length: count }, (_, i) => (
        <Avatar key={i} fallback={`U${i + 1}`} />
      ));

    describe('Basic Rendering', () => {
      it('renders multiple avatars', () => {
        render(<AvatarGroup>{createAvatars(3)}</AvatarGroup>);

        expect(screen.getByText('U1')).toBeInTheDocument();
        expect(screen.getByText('U2')).toBeInTheDocument();
        expect(screen.getByText('U3')).toBeInTheDocument();
      });

      it('applies custom className', () => {
        render(
          <AvatarGroup className='custom-group'>{createAvatars(2)}</AvatarGroup>
        );

        const group = document.querySelector('.custom-group');
        expect(group).toBeInTheDocument();
        expect(group).toHaveClass(styles.avatarGroup);
      });

      it('forwards ref correctly', () => {
        const ref = vi.fn();
        render(<AvatarGroup ref={ref}>{createAvatars(2)}</AvatarGroup>);
        expect(ref).toHaveBeenCalled();
      });
    });

    describe('Max Property', () => {
      it('limits displayed avatars to max value', () => {
        render(<AvatarGroup max={2}>{createAvatars(5)}</AvatarGroup>);

        expect(screen.getByText('U1')).toBeInTheDocument();
        expect(screen.getByText('U2')).toBeInTheDocument();
        expect(screen.queryByText('U3')).not.toBeInTheDocument();
        expect(screen.queryByText('U4')).not.toBeInTheDocument();
        expect(screen.queryByText('U5')).not.toBeInTheDocument();
      });

      it('shows overflow count when exceeding max', () => {
        render(<AvatarGroup max={3}>{createAvatars(7)}</AvatarGroup>);

        expect(screen.getByText('+4')).toBeInTheDocument();
      });

      it('does not show overflow when equal to max', () => {
        render(<AvatarGroup max={3}>{createAvatars(3)}</AvatarGroup>);

        expect(screen.queryByText('+0')).not.toBeInTheDocument();
      });

      it('renders all avatars when max is not set', () => {
        render(<AvatarGroup>{createAvatars(5)}</AvatarGroup>);

        expect(screen.getByText('U1')).toBeInTheDocument();
        expect(screen.getByText('U2')).toBeInTheDocument();
        expect(screen.getByText('U3')).toBeInTheDocument();
        expect(screen.getByText('U4')).toBeInTheDocument();
        expect(screen.getByText('U5')).toBeInTheDocument();
      });
    });

    describe('Overflow Avatar', () => {
      it('matches first avatar size', () => {
        render(
          <AvatarGroup max={2}>
            {[
              <Avatar key={0} size={5} fallback='U1' />,
              <Avatar key={1} size={3} fallback='U2' />,
              <Avatar key={2} size={2} fallback='U3' />
            ]}
          </AvatarGroup>
        );

        const overflowAvatar = screen
          .getByText('+1')
          .closest('[class*="avatar"]');
        expect(overflowAvatar).toHaveClass(styles['avatar-size-5']);
      });

      it('matches first avatar radius', () => {
        render(
          <AvatarGroup max={1}>
            {[
              <Avatar key={0} radius='full' fallback='U1' />,
              <Avatar key={1} radius='small' fallback='U2' />
            ]}
          </AvatarGroup>
        );

        const overflowAvatar = screen
          .getByText('+1')
          .closest('[class*="avatar"]');
        expect(overflowAvatar).toHaveClass(styles['avatar-full']);
      });

      it('matches first avatar variant', () => {
        render(
          <AvatarGroup max={1}>
            {[
              <Avatar key={0} variant='solid' fallback='U1' />,
              <Avatar key={1} variant='soft' fallback='U2' />
            ]}
          </AvatarGroup>
        );

        const overflowAvatar = screen
          .getByText('+1')
          .closest('[class*="avatar"]');
        expect(overflowAvatar).toHaveClass(styles['avatar-solid']);
      });

      it('always uses neutral color for overflow', () => {
        render(
          <AvatarGroup max={1}>
            {[
              <Avatar key={0} color='indigo' fallback='U1' />,
              <Avatar key={1} color='orange' fallback='U2' />
            ]}
          </AvatarGroup>
        );

        const overflowAvatar = screen
          .getByText('+1')
          .closest('[class*="avatar"]');
        expect(overflowAvatar).toHaveClass(styles['avatar-color-neutral']);
      });
    });
  });

  describe('Utility Functions', () => {
    describe('getAvatarColor', () => {
      it('returns consistent color for same string', () => {
        const color1 = getAvatarColor('john.doe@example.com');
        const color2 = getAvatarColor('john.doe@example.com');
        expect(color1).toBe(color2);
      });

      it('returns different colors for different strings', () => {
        const color1 = getAvatarColor('user1');
        const color2 = getAvatarColor('user2');
        // While not guaranteed to be different, testing with known different hashes
        const colors = new Set([
          color1,
          color2,
          getAvatarColor('user3'),
          getAvatarColor('user4')
        ]);
        expect(colors.size).toBeGreaterThan(1);
      });

      it('returns valid avatar color', () => {
        const validColors = [
          'indigo',
          'orange',
          'mint',
          'neutral',
          'sky',
          'lime',
          'grass',
          'cyan',
          'iris',
          'purple',
          'pink',
          'crimson',
          'gold'
        ];
        const color = getAvatarColor('test');
        expect(validColors).toContain(color);
      });
    });
  });
});

class MockImage extends EventTarget {
  _src: string = '';

  constructor() {
    super();
    return this;
  }

  get src() {
    return this._src;
  }

  set src(src: string) {
    if (!src) {
      return;
    }
    this._src = src;
    this.onSrcChange();
  }

  get complete() {
    return !this.src;
  }

  get naturalWidth() {
    return this.complete ? 300 : 0;
  }

  onSrcChange() {
    setTimeout(() => {
      this.dispatchEvent(new Event('load'));
    }, 100);
  }
}
