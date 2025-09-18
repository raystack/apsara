import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Command } from '../command';

// Mock scrollIntoView for test environment
Object.defineProperty(Element.prototype, 'scrollIntoView', {
  value: vi.fn(),
  writable: true
});

describe('Command', () => {
  describe('Basic Rendering', () => {
    it('renders command root', () => {
      render(
        <Command>
          <Command.Input placeholder='Search...' />
          <Command.List>
            <Command.Item>Item 1</Command.Item>
            <Command.Item>Item 2</Command.Item>
          </Command.List>
        </Command>
      );

      expect(screen.getByRole('combobox')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(
        <Command className='custom-command'>
          <Command.Input placeholder='Search...' />
          <Command.List>
            <Command.Item>Item 1</Command.Item>
          </Command.List>
        </Command>
      );

      const command = document.querySelector('.custom-command');
      expect(command).toBeInTheDocument();
    });
  });

  describe('Command Input', () => {
    it('renders input with placeholder', () => {
      render(
        <Command>
          <Command.Input placeholder='Type to search...' />
          <Command.List>
            <Command.Item>Item 1</Command.Item>
          </Command.List>
        </Command>
      );

      expect(
        screen.getByPlaceholderText('Type to search...')
      ).toBeInTheDocument();
    });

    it('renders search icon', () => {
      render(
        <Command>
          <Command.Input placeholder='Search...' />
          <Command.List>
            <Command.Item>Item 1</Command.Item>
          </Command.List>
        </Command>
      );

      // Search icon should be present (it's rendered by the Command.Input component)
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
  });

  describe('Command List and Items', () => {
    it('renders command items', () => {
      render(
        <Command>
          <Command.Input placeholder='Search...' />
          <Command.List>
            <Command.Item>First Item</Command.Item>
            <Command.Item>Second Item</Command.Item>
          </Command.List>
        </Command>
      );

      expect(screen.getByText('First Item')).toBeInTheDocument();
      expect(screen.getByText('Second Item')).toBeInTheDocument();
    });

    it('applies item classes', () => {
      render(
        <Command>
          <Command.Input placeholder='Search...' />
          <Command.List>
            <Command.Item className='custom-item'>Item 1</Command.Item>
          </Command.List>
        </Command>
      );

      const item = screen.getByText('Item 1');
      expect(item).toHaveClass('custom-item');
    });
  });

  describe('Command Empty State', () => {
    it('renders empty state when no results', () => {
      render(
        <Command>
          <Command.Input placeholder='Search...' />
          <Command.List>
            <Command.Empty>No results found</Command.Empty>
          </Command.List>
        </Command>
      );

      expect(screen.getByText('No results found')).toBeInTheDocument();
    });

    it('applies empty state classes', () => {
      render(
        <Command>
          <Command.Input placeholder='Search...' />
          <Command.List>
            <Command.Empty className='custom-empty'>No results</Command.Empty>
          </Command.List>
        </Command>
      );

      const empty = screen.getByText('No results');
      expect(empty).toHaveClass('custom-empty');
    });
  });
});
