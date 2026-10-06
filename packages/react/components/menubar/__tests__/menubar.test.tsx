import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Menu } from '../../menu/menu';
import { Menubar } from '../menubar';

Object.defineProperty(Element.prototype, 'scrollIntoView', {
  value: vi.fn(),
  writable: true
});

describe('Menubar', () => {
  it('renders multiple menu triggers', () => {
    render(
      <Menubar>
        <Menu>
          <Menu.Trigger>File</Menu.Trigger>
          <Menu.Content>
            <Menu.Item>New</Menu.Item>
          </Menu.Content>
        </Menu>
        <Menu>
          <Menu.Trigger>Edit</Menu.Trigger>
          <Menu.Content>
            <Menu.Item>Undo</Menu.Item>
          </Menu.Content>
        </Menu>
      </Menubar>
    );

    expect(screen.getByText('File')).toBeInTheDocument();
    expect(screen.getByText('Edit')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <Menubar className='custom-menubar' data-testid='menubar'>
        <Menu>
          <Menu.Trigger>File</Menu.Trigger>
          <Menu.Content>
            <Menu.Item>New</Menu.Item>
          </Menu.Content>
        </Menu>
      </Menubar>
    );

    expect(screen.getByTestId('menubar')).toHaveClass('custom-menubar');
  });

  it('forwards ref', () => {
    const ref = { current: null } as unknown as React.RefObject<HTMLDivElement>;
    render(
      <Menubar ref={ref}>
        <Menu>
          <Menu.Trigger>File</Menu.Trigger>
          <Menu.Content>
            <Menu.Item>New</Menu.Item>
          </Menu.Content>
        </Menu>
      </Menubar>
    );

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('menu trigger has rs-menu-trigger className when inside menubar', () => {
    render(
      <Menubar>
        <Menu>
          <Menu.Trigger>File</Menu.Trigger>
          <Menu.Content>
            <Menu.Item>New</Menu.Item>
          </Menu.Content>
        </Menu>
      </Menubar>
    );

    const trigger = screen.getByText('File');
    expect(trigger).toHaveClass('rs-menu-trigger');
  });

  it('menu trigger skips rs-menu-trigger className when render prop is present', () => {
    render(
      <Menubar>
        <Menu>
          <Menu.Trigger render={<div />}>File</Menu.Trigger>
          <Menu.Content>
            <Menu.Item>New</Menu.Item>
          </Menu.Content>
        </Menu>
      </Menubar>
    );

    const trigger = screen.getByText('File');
    expect(trigger).not.toHaveClass('rs-menu-trigger');
  });

  it('supports horizontal orientation by default', () => {
    render(
      <Menubar data-testid='menubar'>
        <Menu>
          <Menu.Trigger>File</Menu.Trigger>
          <Menu.Content>
            <Menu.Item>New</Menu.Item>
          </Menu.Content>
        </Menu>
      </Menubar>
    );

    const menubar = screen.getByTestId('menubar');
    expect(menubar).toHaveAttribute('data-orientation', 'horizontal');
  });

  it('supports vertical orientation', () => {
    render(
      <Menubar orientation='vertical' data-testid='menubar'>
        <Menu>
          <Menu.Trigger>File</Menu.Trigger>
          <Menu.Content>
            <Menu.Item>New</Menu.Item>
          </Menu.Content>
        </Menu>
      </Menubar>
    );

    const menubar = screen.getByTestId('menubar');
    expect(menubar).toHaveAttribute('data-orientation', 'vertical');
  });
});
