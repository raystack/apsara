'use client';

import { getPropsString } from '@/lib/utils';

const jsxCode = `{\`function add(a, b) {
  return a + b;
}\`}`;

const tsxCode = `{\`function add(a: number, b: number): number {
  return a + b;
}\`}`;

const longCode = `{\`<Dialog>
  <Dialog.Trigger asChild>
    <Button>Basic Dialog</Button>
  </Dialog.Trigger>
  <Dialog.Content
    width={300}
    ariaLabel="Basic Dialog"
    ariaDescription="A simple dialog example"
  >
    <Dialog.Header>
      <Dialog.Title>A simple dialog example</Dialog.Title>
      <Dialog.CloseButton />
    </Dialog.Header>
    <Dialog.Body>
      <Dialog.Description>
        This is a basic dialog with title and description.
      </Dialog.Description>
    </Dialog.Body>
    <Dialog.Footer>
      <Button>OK</Button>
      <Dialog.Close asChild>
        <Button color="neutral">Cancel</Button>
      </Dialog.Close>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog>\`}`;

const getCode = (props: Record<string, unknown>) => {
  const { children, maxLines, defaultValue = 'jsx', ...rest } = props;
  return `<CodeBlock${getPropsString({ ...rest, ...(maxLines ? { maxLines: Number(maxLines) } : {}), defaultValue })}>
  <CodeBlock.Header>
          <CodeBlock.Label>Code</CodeBlock.Label>
          <CodeBlock.LanguageSelect>
            <CodeBlock.LanguageSelectTrigger />
            <CodeBlock.LanguageSelectContent>
              <CodeBlock.LanguageSelectItem value='jsx'>
                JSX
              </CodeBlock.LanguageSelectItem>
              <CodeBlock.LanguageSelectItem value='tsx'>
                TSX
              </CodeBlock.LanguageSelectItem>
            </CodeBlock.LanguageSelectContent>
          </CodeBlock.LanguageSelect>
          <CodeBlock.CopyButton />
        </CodeBlock.Header>
        <CodeBlock.Content>
          <CodeBlock.Code language='jsx'>${longCode}</CodeBlock.Code>
          <CodeBlock.Code language='tsx'>${tsxCode}</CodeBlock.Code>
          <CodeBlock.CollapseTrigger />
        </CodeBlock.Content>
      </CodeBlock>`;
};

export const playground = {
  type: 'playground',
  controls: {
    hideLineNumbers: {
      type: 'checkbox',
      defaultValue: false
    },
    maxLines: {
      type: 'number',
      defaultValue: 0,
      initialValue: 10,
      min: 0,
      max: 20
    },
    defaultValue: {
      type: 'select',
      options: ['jsx', 'tsx'],
      defaultValue: 'jsx'
    }
  },
  getCode
};

export const basicDemo = {
  type: 'code',
  code: `<CodeBlock>
  <CodeBlock.Content>
    <CodeBlock.Code language="jsx">
      ${jsxCode}
    </CodeBlock.Code>
  </CodeBlock.Content>
</CodeBlock>`
};

export const withHeaderDemo = {
  type: 'code',
  code: `<CodeBlock>
      <CodeBlock.Header>
        <CodeBlock.Label>Header Example</CodeBlock.Label>
        <CodeBlock.CopyButton />
      </CodeBlock.Header>
      <CodeBlock.Content>
        <CodeBlock.Code language="jsx">
          ${jsxCode}
        </CodeBlock.Code>
      </CodeBlock.Content>
    </CodeBlock>`
};

export const languageSwitcherDemo = {
  type: 'code',
  code: `<CodeBlock>
        <CodeBlock.Header>
          <CodeBlock.Label>Code</CodeBlock.Label>
          <CodeBlock.LanguageSelect>
            <CodeBlock.LanguageSelectTrigger />
            <CodeBlock.LanguageSelectContent>
              <CodeBlock.LanguageSelectItem value='jsx'>
                JSX
              </CodeBlock.LanguageSelectItem>
              <CodeBlock.LanguageSelectItem value='tsx'>
                TSX
              </CodeBlock.LanguageSelectItem>
            </CodeBlock.LanguageSelectContent>
          </CodeBlock.LanguageSelect>
        </CodeBlock.Header>
        <CodeBlock.Content>
          <CodeBlock.Code language='tsx'>${jsxCode}</CodeBlock.Code>
          <CodeBlock.Code language='jsx'>${tsxCode}</CodeBlock.Code>
        </CodeBlock.Content>
      </CodeBlock>`
};

export const noLineNumbersDemo = {
  type: 'code',
  code: `<CodeBlock hideLineNumbers>
  <CodeBlock.Content>
      <CodeBlock.Code language="jsx">
        ${jsxCode}
      </CodeBlock.Code>
    </CodeBlock.Content>
    </CodeBlock>`
};

export const collapsibleDemo = {
  type: 'code',
  code: `<CodeBlock maxLines={10}>
  <CodeBlock.Content>
  <CodeBlock.Code language="jsx">
    ${longCode}
  </CodeBlock.Code>
  <CodeBlock.CollapseTrigger />
  </CodeBlock.Content>
</CodeBlock>`
};

export const copyButtonDemo = {
  type: 'code',
  tabs: [
    {
      name: 'Floating',
      code: `
      <CodeBlock>
      <CodeBlock.Content>
      <CodeBlock.Code language="jsx">
          ${jsxCode}
        </CodeBlock.Code>
        <CodeBlock.CopyButton variant="floating" />
      </CodeBlock.Content>
    </CodeBlock>`
    },
    {
      name: 'In header',
      code: `
      <CodeBlock>
      <CodeBlock.Header>
        <CodeBlock.Label>Code</CodeBlock.Label>
        <CodeBlock.CopyButton />
      </CodeBlock.Header>
      <CodeBlock.Content>
      <CodeBlock.Code language="jsx">
          ${jsxCode}
        </CodeBlock.Code>
      </CodeBlock.Content>
    </CodeBlock>`
    }
  ]
};
