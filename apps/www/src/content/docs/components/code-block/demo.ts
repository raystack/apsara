'use client';

import { getPropsString } from '@/lib/utils';

export const getCode = (props: Record<string, unknown>) => {
  const { children, ...rest } = props;
  return `<CodeBlockComponent.Root${getPropsString(rest)}>${children}</CodeBlockComponent.Root>`;
};

export const playground = {
  type: 'playground',
  controls: {
    language: {
      type: 'select',
      options: [
        'javascript',
        'typescript',
        'python',
        'java',
        'css',
        'html',
        'json'
      ],
      defaultValue: 'javascript'
    },
    showLineNumbers: {
      type: 'checkbox',
      defaultValue: true
    },
    showCopyButton: {
      type: 'checkbox',
      defaultValue: true
    },
    maxHeight: {
      type: 'text',
      defaultValue: ''
    }
  },
  code: `function greetUser(name) {
  const message = \`Hello, \${name}!\`;
  console.log(message);
  return message;
}

const user = "World";
const greeting = greetUser(user);`
};

export const basicDemo = {
  type: 'code',
  code: `import { CodeBlockComponent } from '@raystack/apsara';

function MyComponent() {
  const code = \`function hello() {
  console.log('Hello, world!');
}\`;

  return (
    <CodeBlockComponent.Root language="javascript">
      {code}
    </CodeBlockComponent.Root>
  );
}`
};

export const withoutHeaderDemo = {
  type: 'code',
  code: `import { CodeBlockComponent } from '@raystack/apsara';

function MyComponent() {
  const code = \`function hello() {
  console.log('Hello, world!');
}\`;

  return (
    <CodeBlockComponent.Root language="javascript">
      {code}
    </CodeBlockComponent.Root>
  );
}`
};

export const customLanguageDemo = {
  type: 'code',
  code: `import { CodeBlockComponent } from '@raystack/apsara';

function MyComponent() {
  const pythonCode = \`def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print(fibonacci(10))\`;

  return (
    <CodeBlockComponent.Root language="python">
      {pythonCode}
    </CodeBlockComponent.Root>
  );
}`
};

export const noLineNumbersDemo = {
  type: 'code',
  code: `import { CodeBlockComponent } from '@raystack/apsara';

function MyComponent() {
  const code = \`function hello() {
  console.log('Hello, world!');
}\`;

  return (
    <CodeBlockComponent.Root
      language="javascript"
      showLineNumbers={false}
    >
      {code}
    </CodeBlockComponent.Root>
  );
}`
};

export const maxHeightDemo = {
  type: 'code',
  code: `import { CodeBlockComponent } from '@raystack/apsara';

function MyComponent() {
  const longCode = \`// This is a very long code example
function processData(data) {
  const result = [];

  for (let i = 0; i < data.length; i++) {
    const item = data[i];

    if (item.type === 'user') {
      result.push({
        id: item.id,
        name: item.name,
        email: item.email,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt)
      });
    } else if (item.type === 'admin') {
      result.push({
        id: item.id,
        name: item.name,
        role: item.role,
        permissions: item.permissions,
        createdAt: new Date(item.createdAt)
      });
    }
  }

  return result;
}

export default processData;\`;

  return (
    <CodeBlockComponent.Root
      language="javascript"
      maxHeight="200px"
    >
      {longCode}
    </CodeBlockComponent.Root>
  );
}`
};

export const compositePatternDemo = {
  type: 'code',
  code: `import { CodeBlockComponent } from '@raystack/apsara';

function MyComponent() {
  const code = \`function hello() {
  console.log('Hello, world!');
}\`;

  return (
    <div>
      {/* Using Root component */}
      <CodeBlockComponent.Root language="javascript">
        {code}
      </CodeBlockComponent.Root>

      {/* Using Content component */}
      <CodeBlockComponent.Content language="typescript">
        {code}
      </CodeBlockComponent.Content>

      {/* Using Header component */}
      <CodeBlockComponent.Header
        label="Custom Header"
        language="javascript"
        codeContent={code}
      />
    </div>
  );
}`
};

export const languageSwitcherDemo = {
  type: 'code',
  code: `import { CodeBlockComponent } from '@raystack/apsara';
import { useState } from 'react';

function MyComponent() {
  const [currentLanguage, setCurrentLanguage] = useState('javascript');

  const codeExamples = {
    javascript: \`function greet(name) {
  return \`Hello, \${name}!\`;
}\`,
    typescript: \`function greet(name: string): string {
  return \`Hello, \${name}!\`;
}\`,
    python: \`def greet(name):
    return f"Hello, {name}!"\`,
    java: \`public String greet(String name) {
    return "Hello, " + name + "!";
}\`
  };

  return (
    <div>
      <CodeBlockComponent.Header
        label="Language Switcher"
        language={currentLanguage}
        onLanguageChange={setCurrentLanguage}
        availableLanguages={['javascript', 'typescript', 'python', 'java']}
        codeContent={codeExamples[currentLanguage]}
      />
      <CodeBlockComponent.Root language={currentLanguage}>
        {codeExamples[currentLanguage]}
      </CodeBlockComponent.Root>
    </div>
  );
}`
};
