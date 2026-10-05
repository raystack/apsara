import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import { expectSlots } from '~/test-utils/data-slots';
import { Menu } from '../../menu/menu';
import { Menubar } from '../menubar';

describe('Menubar data-slot contract', () => {
  it('exposes a slot on the root element', () => {
    const { container } = render(
      <Menubar>
        <Menu>
          <Menu.Trigger>File</Menu.Trigger>
          <Menu.Content>
            <Menu.Item>New</Menu.Item>
          </Menu.Content>
        </Menu>
      </Menubar>
    );
    expectSlots(container, ['menubar', 'menu-trigger']);
  });
});
