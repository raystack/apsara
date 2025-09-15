import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { List } from '../list';
import styles from '../list.module.css';

describe('List', () => {
  describe('List Root', () => {
    it('renders as ul element', () => {
      render(<List>Content</List>);
      const list = screen.getByRole('list');
      expect(list.tagName).toBe('UL');
    });

    it('renders children', () => {
      render(
        <List>
          <div data-testid='child'>Child Content</div>
        </List>
      );
      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('applies list class', () => {
      render(<List>Content</List>);
      const list = screen.getByRole('list');
      expect(list).toHaveClass(styles.list);
    });

    it('applies custom className', () => {
      render(<List className='custom-list'>Content</List>);
      const list = screen.getByRole('list');
      expect(list).toHaveClass('custom-list');
      expect(list).toHaveClass(styles.list);
    });

    it('sets maxWidth style', () => {
      render(<List maxWidth='500px'>Content</List>);
      const list = screen.getByRole('list');
      expect(list).toHaveStyle({ maxWidth: '500px' });
    });

    it('sets maxWidth as number', () => {
      render(<List maxWidth={400}>Content</List>);
      const list = screen.getByRole('list');
      expect(list).toHaveStyle({ maxWidth: '400px' });
    });

    it('has default aria-label', () => {
      render(<List>Content</List>);
      const list = screen.getByRole('list');
      expect(list).toHaveAttribute('aria-label', 'List');
    });

    it('uses custom aria-label', () => {
      render(<List aria-label='Navigation items'>Content</List>);
      const list = screen.getByRole('list');
      expect(list).toHaveAttribute('aria-label', 'Navigation items');
    });

    it('merges custom styles', () => {
      render(
        <List style={{ padding: '10px' }} maxWidth='300px'>
          Content
        </List>
      );
      const list = screen.getByRole('list');
      expect(list).toHaveStyle({ padding: '10px', maxWidth: '300px' });
    });
  });

  describe('List.Item', () => {
    it('renders as li element', () => {
      render(
        <List>
          <List.Item>Item</List.Item>
        </List>
      );
      const item = screen.getByRole('listitem');
      expect(item.tagName).toBe('LI');
    });

    it('renders children', () => {
      render(
        <List>
          <List.Item>Item Content</List.Item>
        </List>
      );
      expect(screen.getByText('Item Content')).toBeInTheDocument();
    });

    it('applies list-item class', () => {
      render(
        <List>
          <List.Item>Item</List.Item>
        </List>
      );
      const item = screen.getByRole('listitem');
      expect(item).toHaveClass(styles['list-item']);
    });

    it('applies custom className', () => {
      render(
        <List>
          <List.Item className='custom-item'>Item</List.Item>
        </List>
      );
      const item = screen.getByRole('listitem');
      expect(item).toHaveClass('custom-item');
      expect(item).toHaveClass(styles['list-item']);
    });

    it('supports data attributes', () => {
      render(
        <List>
          <List.Item data-testid='test-item'>Item</List.Item>
        </List>
      );
      expect(screen.getByTestId('test-item')).toBeInTheDocument();
    });
  });

  describe('List.Label', () => {
    it('renders as span element', () => {
      const { container } = render(
        <List>
          <List.Item>
            <List.Label>Label</List.Label>
          </List.Item>
        </List>
      );
      const label = container.querySelector(`.${styles.label}`);
      expect(label?.tagName).toBe('SPAN');
    });

    it('renders children', () => {
      render(
        <List>
          <List.Item>
            <List.Label>Field Label</List.Label>
          </List.Item>
        </List>
      );
      expect(screen.getByText('Field Label')).toBeInTheDocument();
    });

    it('applies label class', () => {
      const { container } = render(
        <List>
          <List.Item>
            <List.Label>Label</List.Label>
          </List.Item>
        </List>
      );
      const label = container.querySelector(`.${styles.label}`);
      expect(label).toBeInTheDocument();
    });

    it('sets minWidth style', () => {
      render(
        <List>
          <List.Item>
            <List.Label minWidth='100px'>Label</List.Label>
          </List.Item>
        </List>
      );
      const label = screen.getByText('Label');
      expect(label).toHaveStyle({ minWidth: '100px' });
    });

    it('merges custom styles', () => {
      render(
        <List>
          <List.Item>
            <List.Label minWidth='80px' style={{ color: 'gray' }}>
              Label
            </List.Label>
          </List.Item>
        </List>
      );
      const label = screen.getByText('Label');
      expect(label).toHaveStyle({
        minWidth: '80px',
        color: 'rgb(128, 128, 128)'
      });
    });
  });

  describe('List.Value', () => {
    it('renders as span element', () => {
      const { container } = render(
        <List>
          <List.Item>
            <List.Value>Value</List.Value>
          </List.Item>
        </List>
      );
      const value = container.querySelector(`.${styles.value}`);
      expect(value?.tagName).toBe('SPAN');
    });

    it('renders children', () => {
      render(
        <List>
          <List.Item>
            <List.Value>Some Value</List.Value>
          </List.Item>
        </List>
      );
      expect(screen.getByText('Some Value')).toBeInTheDocument();
    });

    it('applies value class', () => {
      const { container } = render(
        <List>
          <List.Item>
            <List.Value>Value</List.Value>
          </List.Item>
        </List>
      );
      const value = container.querySelector(`.${styles.value}`);
      expect(value).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = render(
        <List>
          <List.Item>
            <List.Value className='custom-value'>Value</List.Value>
          </List.Item>
        </List>
      );
      const value = container.querySelector(`.${styles.value}`);
      expect(value).toHaveClass('custom-value');
    });
  });

  describe('List.Header', () => {
    it('renders as div element', () => {
      const { container } = render(
        <List>
          <List.Header>Header</List.Header>
        </List>
      );
      const header = container.querySelector(`.${styles.header}`);
      expect(header?.tagName).toBe('DIV');
    });

    it('renders children in header text span', () => {
      render(
        <List>
          <List.Header>List Title</List.Header>
        </List>
      );
      expect(screen.getByText('List Title')).toBeInTheDocument();
    });

    it('applies header class', () => {
      const { container } = render(
        <List>
          <List.Header>Header</List.Header>
        </List>
      );
      const header = container.querySelector(`.${styles.header}`);
      expect(header).toBeInTheDocument();
    });

    it('has heading role', () => {
      render(
        <List>
          <List.Header>Header</List.Header>
        </List>
      );
      const header = screen.getByRole('heading');
      expect(header).toBeInTheDocument();
    });

    it('has aria-level 3', () => {
      render(
        <List>
          <List.Header>Header</List.Header>
        </List>
      );
      const header = screen.getByRole('heading');
      expect(header).toHaveAttribute('aria-level', '3');
    });

    it('wraps content in header-text span', () => {
      const { container } = render(
        <List>
          <List.Header>Title</List.Header>
        </List>
      );
      const headerText = container.querySelector(`.${styles['header-text']}`);
      expect(headerText).toBeInTheDocument();
      expect(headerText).toHaveTextContent('Title');
    });
  });

  describe('Complete List Structure', () => {
    it('renders complete list with all subcomponents', () => {
      render(
        <List aria-label='User details'>
          <List.Header>User Information</List.Header>
          <List.Item>
            <List.Label>Name:</List.Label>
            <List.Value>John Doe</List.Value>
          </List.Item>
          <List.Item>
            <List.Label>Email:</List.Label>
            <List.Value>john@example.com</List.Value>
          </List.Item>
        </List>
      );

      expect(screen.getByRole('list')).toBeInTheDocument();
      expect(screen.getByRole('heading')).toHaveTextContent('User Information');
      expect(screen.getAllByRole('listitem')).toHaveLength(2);
      expect(screen.getByText('Name:')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Email:')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
    });

    it('supports multiple headers', () => {
      render(
        <List>
          <List.Header>Section 1</List.Header>
          <List.Item>Item 1</List.Item>
          <List.Header>Section 2</List.Header>
          <List.Item>Item 2</List.Item>
        </List>
      );

      const headers = screen.getAllByRole('heading');
      expect(headers).toHaveLength(2);
      expect(headers[0]).toHaveTextContent('Section 1');
      expect(headers[1]).toHaveTextContent('Section 2');
    });

    it('supports complex item content', () => {
      render(
        <List>
          <List.Item>
            <List.Label minWidth='100px'>Status:</List.Label>
            <List.Value>
              <span style={{ color: 'green' }}>Active</span>
            </List.Value>
          </List.Item>
        </List>
      );

      const label = screen.getByText('Status:');
      expect(label).toHaveStyle({ minWidth: '100px' });
      const value = screen.getByText('Active');
      expect(value).toHaveStyle({ color: 'rgb(0, 128, 0)' });
    });
  });
});
