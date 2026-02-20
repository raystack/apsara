'use client';

import { CodeBlock, Flex } from '@raystack/apsara';
import PlaygroundLayout from './playground-layout';

export function CodeBlockExamples() {
  return (
    <PlaygroundLayout title='CodeBlock'>
      <Flex gap='large' style={{ width: 800 }}>
        <CodeBlock maxLines={10} defaultValue='jsx'>
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
            <CodeBlock.Code language='jsx'>{`<Dialog>
  <Dialog.Trigger render={<Button />}>
    Basic Dialog
  </Dialog.Trigger>
  <Dialog.Content
    width={300}
    ariaLabel="Basic Dialog"
    ariaDescription="A simple dialog example"
  >
    <Dialog.Header>
      <Dialog.Title>A simple dialog example</Dialog.Title>
    </Dialog.Header>
    <Dialog.Body>
      <Dialog.Description>
        This is a basic dialog with title and description.
      </Dialog.Description>
    </Dialog.Body>
    <Dialog.Footer>
      <Button>OK</Button>
      <Dialog.Close render={<Button color="neutral">Cancel</Button>} />
    </Dialog.Footer>
  </Dialog.Content>
</Dialog>`}</CodeBlock.Code>
            <CodeBlock.Code language='tsx'>{`function add(a: number, b: number): number {
  return a + b;
}`}</CodeBlock.Code>
            <CodeBlock.CollapseTrigger />
          </CodeBlock.Content>
        </CodeBlock>
      </Flex>
    </PlaygroundLayout>
  );
}
