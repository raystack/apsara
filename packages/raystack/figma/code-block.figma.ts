// url=<FIGMA_LINK>?node-id=5990-24983
// source=https://github.com/raystack/apsara/blob/main/packages/raystack/components/code-block/code-block.tsx
// component=CodeBlock

import figma from 'figma';

const instance = figma.selectedInstance;

// Each boolean toggles whether a sub-component appears in the composed example.
const header = instance.getBoolean('Header', {
  true: `
  <CodeBlock.Header>
    <CodeBlock.Label>example.ts</CodeBlock.Label>
  </CodeBlock.Header>`,
  false: ''
});
const copyButton = instance.getBoolean('Copy', {
  true: `
    <CodeBlock.CopyButton />`,
  false: ''
});
const collapseTrigger = instance.getBoolean('Show/Hide Code', {
  true: `
    <CodeBlock.CollapseTrigger />`,
  false: ''
});

export default {
  id: 'CodeBlock',
  imports: ["import { CodeBlock } from '@raystack/apsara'"],
  example: figma.code`<CodeBlock>${header}
  <CodeBlock.Content>
    <CodeBlock.Code language="typescript">{\`const greeting = "Hello, world!";\`}</CodeBlock.Code>${copyButton}${collapseTrigger}
  </CodeBlock.Content>
</CodeBlock>`,
  metadata: { nestable: false }
};
