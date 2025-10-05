import { CodeBlock } from '@raystack/raystack';

export function CodeBlockDemo() {
  return (
    <div style={{ padding: '20px' }}>
      <h2>CodeBlock Component Examples</h2>

      <h3>Basic Usage (Content Only)</h3>
      <CodeBlock>
        <CodeBlock.Content>
          {`function hello() {
  console.log('Hello, world!');
}`}
        </CodeBlock.Content>
      </CodeBlock>

      <h3>With Header</h3>
      <CodeBlock>
        <CodeBlock.Header label='JavaScript' />
        <CodeBlock.Content>
          {`function calculateSum(a, b) {
  return a + b;
}`}
        </CodeBlock.Content>
      </CodeBlock>

      <h3>Python Example</h3>
      <CodeBlock language='python'>
        <CodeBlock.Header label='Python' />
        <CodeBlock.Content>
          {`def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)`}
        </CodeBlock.Content>
      </CodeBlock>

      <h3>Without Line Numbers</h3>
      <CodeBlock showLineNumbers={false}>
        <CodeBlock.Content>
          {`const data = {
  name: 'John',
  age: 30,
  city: 'New York'
};`}
        </CodeBlock.Content>
      </CodeBlock>

      <h3>With Max Height</h3>
      <CodeBlock maxHeight='200px'>
        <CodeBlock.Header label='Long Code' />
        <CodeBlock.Content>
          {`// This is a very long code block that should be scrollable
function processLargeDataset(data) {
  const results = [];

  for (let i = 0; i < data.length; i++) {
    const item = data[i];

    // Process each item
    if (item.type === 'user') {
      results.push({
        id: item.id,
        name: item.name,
        email: item.email,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt)
      });
    } else if (item.type === 'product') {
      results.push({
        id: item.id,
        title: item.title,
        price: item.price,
        category: item.category,
        inStock: item.inStock
      });
    }
  }

  return results;
}`}
        </CodeBlock.Content>
      </CodeBlock>
    </div>
  );
}
