import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { ComponentProps } from 'react';
import { CodeBlock } from '../code-block';

// Mock the clipboard API
const mockCopy = vi.fn();
vi.mock('~/hooks/useCopyToClipboard', () => ({
  useCopyToClipboard: () => ({
    copy: mockCopy
  })
}));

// Mock icon components used inside CopyButton to avoid invalid element errors
vi.mock('~/icons', () => ({
  CheckCircleFilledIcon: () => null
}));
vi.mock('@radix-ui/react-icons', () => ({
  CopyIcon: () => null,
  ChevronDownIcon: () => null
}));

const JAVASCRIPT_CODE = `function hello() {
  console.log('Hello, world!');
}`;

const PYTHON_CODE = `def hello():
    print("Hello, world!")`;

const BasicCodeBlock = ({
  children,
  hasMultipleCodeBlocks = false,
  hasFloatingCopyButton = false,
  hasCollapseTrigger = false,
  ...props
}: ComponentProps<typeof CodeBlock> & {
  hasMultipleCodeBlocks?: boolean;
  hasFloatingCopyButton?: boolean;
  hasCollapseTrigger?: boolean;
}) => {
  return (
    <CodeBlock {...props}>
      {children}
      <CodeBlock.Content>
        <CodeBlock.Code language='jsx'>{JAVASCRIPT_CODE}</CodeBlock.Code>
        {hasMultipleCodeBlocks && (
          <CodeBlock.Code language='python'>{PYTHON_CODE}</CodeBlock.Code>
        )}
        {hasFloatingCopyButton && (
          <CodeBlock.CopyButton
            variant='floating'
            data-testid='floating-copy-button'
          />
        )}
        {hasCollapseTrigger && <CodeBlock.CollapseTrigger />}
      </CodeBlock.Content>
    </CodeBlock>
  );
};

const LanguageSelectCodeBlock = (
  props: ComponentProps<typeof BasicCodeBlock>
) => {
  return (
    <BasicCodeBlock defaultValue='jsx' hasMultipleCodeBlocks {...props}>
      <CodeBlock.Header>
        <CodeBlock.Label>Code</CodeBlock.Label>
        <CodeBlock.LanguageSelect>
          <CodeBlock.LanguageSelectTrigger data-testid='language-select-trigger' />
          <CodeBlock.LanguageSelectContent>
            <CodeBlock.LanguageSelectItem value='jsx'>
              JavaScript
            </CodeBlock.LanguageSelectItem>
            <CodeBlock.LanguageSelectItem value='python'>
              Python
            </CodeBlock.LanguageSelectItem>
          </CodeBlock.LanguageSelectContent>
        </CodeBlock.LanguageSelect>
      </CodeBlock.Header>
    </BasicCodeBlock>
  );
};

describe('CodeBlock', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCopy.mockResolvedValue(true);
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('Basic Rendering', () => {
    it('renders with content only', () => {
      render(<BasicCodeBlock />);

      expect(screen.getByText('function')).toBeInTheDocument();
      expect(screen.getByText('hello')).toBeInTheDocument();
    });

    it('renders with header and content', () => {
      render(
        <BasicCodeBlock>
          <CodeBlock.Header>
            <CodeBlock.Label data-testid='label'>JavaScript</CodeBlock.Label>
          </CodeBlock.Header>
        </BasicCodeBlock>
      );

      expect(screen.getByTestId('label')).toBeInTheDocument();
    });

    it('renders multiple code blocks with different languages', () => {
      render(<BasicCodeBlock hasMultipleCodeBlocks defaultValue='jsx' />);

      expect(screen.getByText('function')).toBeInTheDocument();
      expect(screen.queryByText('def')).not.toBeInTheDocument();
    });
  });

  describe('Line Numbers', () => {
    it('shows line numbers by default', () => {
      render(<BasicCodeBlock />);

      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('hides line numbers when hideLineNumbers is true', () => {
      render(<BasicCodeBlock hideLineNumbers />);

      expect(screen.queryByText('1')).not.toBeInTheDocument();
      expect(screen.queryByText('2')).not.toBeInTheDocument();
    });
  });

  describe('Language Selection', () => {
    it('renders language select when provided', () => {
      render(<LanguageSelectCodeBlock />);

      expect(screen.getByTestId('language-select-trigger')).toBeInTheDocument();
    });
    it('updates language when language select is changed', () => {
      const { rerender } = render(<LanguageSelectCodeBlock value='jsx' />);

      expect(screen.getByText('JavaScript')).toBeInTheDocument();
      expect(screen.getByText('function')).toBeInTheDocument();
      expect(screen.queryByText('def')).not.toBeInTheDocument();

      rerender(<LanguageSelectCodeBlock value='python' />);

      expect(screen.getByText('Python')).toBeInTheDocument();
      expect(screen.getByText('def')).toBeInTheDocument();
      expect(screen.queryByText('function')).not.toBeInTheDocument();
    });
  });

  describe('Copy Button', () => {
    it('copies code to clipboard when copy button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <BasicCodeBlock defaultValue='jsx'>
          <CodeBlock.Header>
            <CodeBlock.CopyButton data-testid='copy-button' />
          </CodeBlock.Header>
        </BasicCodeBlock>
      );

      const copyButton = screen.getByTestId('copy-button');
      expect(copyButton).toBeInTheDocument();
      await user.click(copyButton);

      expect(mockCopy).toHaveBeenCalled();
    });

    it('copies code to clipboard when floating copy button is clicked', async () => {
      const user = userEvent.setup();

      render(<BasicCodeBlock hasFloatingCopyButton defaultValue='jsx' />);

      const copyButton = screen.getByTestId('floating-copy-button');
      expect(copyButton).toBeInTheDocument();
      await user.click(copyButton);

      expect(mockCopy).toHaveBeenCalled();
    });
  });

  describe('Collapse Functionality', () => {
    it('renders collapse trigger when maxLines is set and code exceeds limit', () => {
      render(<BasicCodeBlock maxLines={2} hasCollapseTrigger />);

      expect(screen.getByText('Show Code')).toBeInTheDocument();
    });
  });
});
