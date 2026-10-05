import { render, screen, waitFor } from '@testing-library/react';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { radiusClasses } from '../../../shared/radius';
import { Tooltip } from '../../tooltip';
import { Avatar, AvatarGroup } from '../avatar';
import styles from '../avatar.module.css';
import {
  AVATAR_COLOR_PALETTE,
  type AVATAR_COLORS,
  COLORS,
  getAvatarColor
} from '../utils';

describe('Avatar', () => {
  const ogImage = window.Image;

  beforeAll(() => {
    window.Image = MockImage as unknown as typeof Image;
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

    it('calls onLoadingStatusChange with the image status', async () => {
      const onLoadingStatusChange = vi.fn();
      render(
        <Avatar
          src='https://example.com/avatar.png'
          alt='JD'
          onLoadingStatusChange={onLoadingStatusChange}
        />
      );
      await waitFor(() =>
        expect(onLoadingStatusChange).toHaveBeenCalledWith('loaded')
      );
    });

    it('waits for fallbackDelay before showing the fallback', async () => {
      render(<Avatar fallback='JD' fallbackDelay={50} />);
      expect(screen.queryByText('JD')).not.toBeInTheDocument();
      expect(await screen.findByText('JD')).toBeInTheDocument();
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
    const radii = ['none', 'small', 'medium', 'large', 'full'] as const;
    it.each(radii)('renders %s radius', radius => {
      const { container } = render(<Avatar radius={radius} fallback='JD' />);
      const avatar = container.querySelector('[class*="avatar"]');
      expect(avatar).toHaveClass(radiusClasses[radius]);
    });

    it('sets no radius class by default, so the theme radius applies', () => {
      const { container } = render(<Avatar fallback='JD' />);
      const avatar = container.querySelector('[class*="avatar"]');
      for (const className of Object.values(radiusClasses)) {
        expect(avatar).not.toHaveClass(className);
      }
    });

    it('takes its base step from the size class', () => {
      const { container } = render(
        <Avatar size={10} radius='medium' fallback='JD' />
      );
      const avatar = container.querySelector('[class*="avatar"]');
      expect(avatar).toHaveClass(styles['avatar-size-10']);
      expect(avatar).toHaveClass(radiusClasses.medium);
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

      it('keeps each avatar mounted when the order changes', () => {
        const { rerender } = render(
          <AvatarGroup>
            {[<Avatar key='a' fallback='A' />, <Avatar key='b' fallback='B' />]}
          </AvatarGroup>
        );
        const avatarA = screen.getByText('A').closest('[data-slot="avatar"]');
        rerender(
          <AvatarGroup>
            {[<Avatar key='b' fallback='B' />, <Avatar key='a' fallback='A' />]}
          </AvatarGroup>
        );
        expect(screen.getByText('A').closest('[data-slot="avatar"]')).toBe(
          avatarA
        );
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

      it('matches the size of a first avatar inside a Tooltip', () => {
        render(
          <AvatarGroup max={1}>
            {[
              <Tooltip key={0}>
                <Tooltip.Trigger render={<Avatar size={5} fallback='U1' />} />
                <Tooltip.Content>User 1</Tooltip.Content>
              </Tooltip>,
              <Avatar key={1} fallback='U2' />
            ]}
          </AvatarGroup>
        );

        const overflowAvatar = screen
          .getByText('+1')
          .closest('[data-slot="avatar"]');
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
        expect(overflowAvatar).toHaveClass(radiusClasses.full);
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

      it('maps anagrams to different colors', () => {
        expect(getAvatarColor('abc')).toBe('cyan');
        expect(getAvatarColor('cba')).toBe('orange');
        expect(getAvatarColor('amy')).toBe('sky');
        expect(getAvatarColor('may')).toBe('gold');
        expect(getAvatarColor('listen')).toBe('iris');
        expect(getAvatarColor('silent')).toBe('cyan');
      });

      it('returns a known color for a known string', () => {
        expect(getAvatarColor('john.doe@example.com')).toBe('pink');
      });

      it('returns the same color for the same input and options', () => {
        const options = {
          seed: 'workspace',
          palette: ['mint', 'sky']
        } as const;
        const first = getAvatarColor('alice', options);
        for (let i = 0; i < 10; i++) {
          expect(getAvatarColor('alice', options)).toBe(first);
        }
      });

      it('changes the color with the seed', () => {
        expect(getAvatarColor('alice', { seed: 'a' })).toBe('iris');
        expect(getAvatarColor('alice', { seed: 'b' })).toBe('crimson');
        expect(getAvatarColor('alice', { seed: 1 })).toBe('mint');
        expect(getAvatarColor('alice', { seed: '1' })).toBe('mint');
      });

      it('returns only and all colors from the palette', () => {
        const palette = ['indigo', 'mint', 'sky'] as const;
        const hit = new Set(
          Array.from({ length: 200 }, (_, i) =>
            getAvatarColor(`u${i}`, { palette })
          )
        );
        expect([...hit].sort()).toEqual([...palette].sort());
      });

      it('returns the only color of a single-color palette', () => {
        for (let i = 0; i < 20; i++) {
          expect(getAvatarColor(`u${i}`, { palette: ['gold'] })).toBe('gold');
        }
      });

      it('ignores duplicate palette colors', () => {
        for (let i = 0; i < 50; i++) {
          expect(
            getAvatarColor(`u${i}`, { palette: ['sky', 'sky', 'mint'] })
          ).toBe(getAvatarColor(`u${i}`, { palette: ['sky', 'mint'] }));
        }
      });

      it('ignores unknown palette colors', () => {
        const palette = ['sky', 'teal', 'mint'] as unknown as AVATAR_COLORS[];
        for (let i = 0; i < 50; i++) {
          expect(getAvatarColor(`u${i}`, { palette })).toBe(
            getAvatarColor(`u${i}`, { palette: ['sky', 'mint'] })
          );
        }
      });

      it('falls back to all colors for an empty palette and warns once', async () => {
        vi.resetModules();
        const utils = await import('../utils');
        const warn = vi
          .spyOn(console, 'warn')
          .mockImplementation(() => undefined);
        for (let i = 0; i < 20; i++) {
          expect(utils.getAvatarColor(`u${i}`, { palette: [] })).toBe(
            utils.getAvatarColor(`u${i}`)
          );
        }
        expect(warn).toHaveBeenCalledTimes(1);
        warn.mockRestore();
      });

      it('uses every color over many strings', () => {
        const hit = new Set(
          Array.from({ length: 1000 }, (_, i) => getAvatarColor(`user-${i}`))
        );
        expect(hit.size).toBe(COLORS.length);
      });

      it('returns a valid color for an empty string', () => {
        expect(getAvatarColor('')).toBe('neutral');
      });

      it('has a color variant class for every palette color', () => {
        expect(AVATAR_COLOR_PALETTE).toBe(COLORS);
        for (const color of COLORS) {
          const { container, unmount } = render(
            <Avatar color={color} fallback='A' />
          );
          const className = styles[`avatar-color-${color}`];
          expect(className).toBeTruthy();
          expect(container.firstElementChild).toHaveClass(className);
          unmount();
        }
      });
    });
  });
});

class MockImage extends EventTarget {
  _src: string = '';
  _complete: boolean = false;
  onload: (() => void) | null = null;

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
    // Simulate async image loading
    setTimeout(() => {
      this._complete = true;
      // Call onload callback if set
      if (this.onload) {
        this.onload();
      }
      // Also dispatch the event
      this.dispatchEvent(new Event('load'));
    }, 0);
  }

  get complete() {
    return this._complete;
  }

  get naturalWidth() {
    return this._complete ? 300 : 0;
  }

  get naturalHeight() {
    return this._complete ? 300 : 0;
  }
}
