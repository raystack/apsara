'use client';
// @ts-nocheck
/* tslint:disable */
import { CodeBlock } from '@raystack/apsara';

export default function Page() {
  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1
        style={{ marginBottom: '32px', fontSize: '2rem', fontWeight: 'bold' }}
      >
        CodeBlock Examples
      </h1>
      <CodeBlock defaultValue='jsx'>
        <CodeBlock.Content>
          <CodeBlock.Code language='jsx'>code</CodeBlock.Code>
        </CodeBlock.Content>
      </CodeBlock>

      <CodeBlock language='jsx' hideLineNumbers>
        <CodeBlock.Content>
          <CodeBlock.Code>code</CodeBlock.Code>
        </CodeBlock.Content>
      </CodeBlock>
      {/* Basic usage with single language */}
      <section style={{ marginBottom: '48px' }}>
        <h2
          style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            marginBottom: '16px'
          }}
        >
          Basic Usage
        </h2>
        <CodeBlock defaultValue='js'>
          <CodeBlock.Header>
            <CodeBlock.Label>Simple JavaScript function</CodeBlock.Label>
          </CodeBlock.Header>
          <CodeBlock.Content>
            <CodeBlock.Code language='js'>
              {`function greetUser(name) {
  const message = \`Hello, \${name}!\`;
  console.log(message);
  return message;
}

const user = "World";
const greeting = greetUser(user);
console.log(greeting); // Output: Hello, World!`}
            </CodeBlock.Code>
          </CodeBlock.Content>
        </CodeBlock>
      </section>

      {/* Multi-language example */}
      <section style={{ marginBottom: '48px' }}>
        <h2
          style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            marginBottom: '16px'
          }}
        >
          Multi-Language Example
        </h2>
        <CodeBlock defaultValue='python'>
          <CodeBlock.Header>
            <CodeBlock.Label>Hello World in Multiple Languages</CodeBlock.Label>
            <CodeBlock.Action>
              <CodeBlock.LanguageSelect>
                <CodeBlock.LanguageSelect.Trigger />
                <CodeBlock.LanguageSelect.Content>
                  <CodeBlock.LanguageSelect.Item value='js'>
                    JavaScript
                  </CodeBlock.LanguageSelect.Item>
                  <CodeBlock.LanguageSelect.Item value='ts'>
                    TypeScript
                  </CodeBlock.LanguageSelect.Item>
                  <CodeBlock.LanguageSelect.Item value='python'>
                    Python
                  </CodeBlock.LanguageSelect.Item>
                  <CodeBlock.LanguageSelect.Item value='java'>
                    Java
                  </CodeBlock.LanguageSelect.Item>
                </CodeBlock.LanguageSelect.Content>
              </CodeBlock.LanguageSelect>
              <CodeBlock.CopyButton />
            </CodeBlock.Action>
          </CodeBlock.Header>

          <CodeBlock.Content>
            <CodeBlock.Code language='js'>
              {`function greetUser(name) {
  const message = \`Hello, \${name}!\`;
  console.log(message);
  return message;
}

const user = "World";
const greeting = greetUser(user);`}
            </CodeBlock.Code>

            <CodeBlock.Code language='ts'>
              {`interface User {
  name: string;
  age: number;
  email: string;
}

function greetUser(user: User): string {
  const message = \`Hello, \${user.name}!\`;
  console.log(message);
  return message;
}

const user: User = {
  name: "World",
  age: 25,
  email: "world@example.com"
};

const greeting = greetUser(user);`}
            </CodeBlock.Code>

            <CodeBlock.Code language='python'>
              {`class User:
    def __init__(self, name: str, age: int, email: str):
        self.name = name
        self.age = age
        self.email = email

def greet_user(user: User) -> str:
    message = f"Hello, {user.name}!"
    print(message)
    return message

user = User("World", 25, "world@example.com")
greeting = greet_user(user)`}
            </CodeBlock.Code>

            <CodeBlock.Code language='java'>
              {`public class User {
    private String name;
    private int age;
    private String email;

    public User(String name, int age, String email) {
        this.name = name;
        this.age = age;
        this.email = email;
    }

    public String getName() { return name; }
    public int getAge() { return age; }
    public String getEmail() { return email; }
}

public class Greeter {
    public static String greetUser(User user) {
        String message = "Hello, " + user.getName() + "!";
        System.out.println(message);
        return message;
    }

    public static void main(String[] args) {
        User user = new User("World", 25, "world@example.com");
        String greeting = greetUser(user);
    }
}`}
            </CodeBlock.Code>
          </CodeBlock.Content>
        </CodeBlock>
      </section>

      {/* Configuration options */}
      <section style={{ marginBottom: '48px' }}>
        <h2
          style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            marginBottom: '16px'
          }}
        >
          With Configuration Options
        </h2>
        <CodeBlock defaultValue='css' showLineNumbers={false}>
          <CodeBlock.Header>
            <CodeBlock.Label>CSS Styles without Line Numbers</CodeBlock.Label>
          </CodeBlock.Header>
          <CodeBlock.Content>
            <CodeBlock.Code language='css'>
              {`.user-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 24px;
  color: white;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.user-card:hover {
  transform: translateY(-4px);
}

.user-name {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 8px;
}

.user-details {
  opacity: 0.9;
  font-size: 0.9rem;
}`}
            </CodeBlock.Code>
          </CodeBlock.Content>
        </CodeBlock>
      </section>

      {/* Minimal example */}
      <section style={{ marginBottom: '48px' }}>
        <h2
          style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            marginBottom: '16px'
          }}
        >
          Minimal Example
        </h2>
        <CodeBlock defaultValue='html'>
          <CodeBlock.Content>
            <CodeBlock.Code language='html'>
              {`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Greeting</title>
</head>
<body>
    <div class="user-card">
        <h1 class="user-name">Hello, World!</h1>
        <div class="user-details">
            <p>Age: 25</p>
            <p>Email: world@example.com</p>
        </div>
    </div>
</body>
</html>`}
            </CodeBlock.Code>
          </CodeBlock.Content>
        </CodeBlock>
      </section>
    </div>
  );
}
