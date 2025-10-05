import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { CodeBlock } from '../code-block';

describe('CodeBlock', () => {
  it('renders with content only', () => {
    render(
      <CodeBlock>
        <CodeBlock.Content>
          {`function hello() {
  console.log('Hello, world!');
}`}
        </CodeBlock.Content>
      </CodeBlock>
    );

    expect(screen.getByText(/function hello/)).toBeInTheDocument();
  });

  it('renders with header and content', () => {
    render(
      <CodeBlock>
        <CodeBlock.Header>
          <CodeBlock.Label>JavaScript</CodeBlock.Label>
        </CodeBlock.Header>
        <CodeBlock.Content>
          {`function hello() {
  console.log('Hello, world!');
}`}
        </CodeBlock.Content>
      </CodeBlock>
    );

    expect(screen.getByText('JavaScript')).toBeInTheDocument();
    expect(screen.getByText(/function hello/)).toBeInTheDocument();
  });

  it('renders without line numbers when showLineNumbers is false', () => {
    render(
      <CodeBlock showLineNumbers={false}>
        <CodeBlock.Content>
          {`function hello() {
  console.log('Hello, world!');
}`}
        </CodeBlock.Content>
      </CodeBlock>
    );

    // Line numbers should not be present
    expect(screen.queryByText('1')).not.toBeInTheDocument();
  });

  it('renders with custom language', () => {
    render(
      <CodeBlock defaultValue='python'>
        <CodeBlock.Content>
          <CodeBlock.Code language='python'>
            {`def hello():
    print("Hello, world!")`}
          </CodeBlock.Code>
        </CodeBlock.Content>
      </CodeBlock>
    );

    expect(screen.getByText(/def hello/)).toBeInTheDocument();
  });
});
