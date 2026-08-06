import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { expectSlots, getAllSlots, getSlot } from '~/test-utils/data-slots';
import { CodeBlock } from '../code-block';

// Mock the clipboard API used by CopyButton.
vi.mock('~/hooks/useCopyToClipboard', () => ({
  useCopyToClipboard: () => ({ copy: vi.fn() })
}));

// SVG icons are inlined via @svgr/rollup at build time; stub them for jsdom.
vi.mock('@radix-ui/react-icons', () => ({
  CopyIcon: () => null,
  CheckIcon: () => null,
  ChevronDownIcon: () => null,
  CaretSortIcon: () => null
}));

const CODE = `function hello() {
  console.log('hi');
}`;

describe('CodeBlock data-slot contract', () => {
  it('exposes slots for every rendered part', () => {
    const { container } = render(
      <CodeBlock defaultValue='jsx'>
        <CodeBlock.Header>
          <CodeBlock.Label>Code</CodeBlock.Label>
          <CodeBlock.CopyButton />
        </CodeBlock.Header>
        <CodeBlock.Content>
          <CodeBlock.Code language='jsx'>{CODE}</CodeBlock.Code>
        </CodeBlock.Content>
      </CodeBlock>
    );
    expectSlots(container, [
      'code-block',
      'code-block-header',
      'code-block-label',
      'code-block-copy-button',
      'code-block-content',
      'code-block-code',
      'code-block-pre',
      'code-block-line',
      'code-block-line-number',
      'code-block-line-content',
      'code-block-token'
    ]);
    expect(getAllSlots(container, 'code-block-line').length).toBeGreaterThan(0);
  });

  it('omits the line-number slot when hideLineNumbers is set', () => {
    const { container } = render(
      <CodeBlock defaultValue='jsx' hideLineNumbers>
        <CodeBlock.Content>
          <CodeBlock.Code language='jsx'>{CODE}</CodeBlock.Code>
        </CodeBlock.Content>
      </CodeBlock>
    );
    expect(getSlot(container, 'code-block-line-number')).toBeNull();
  });

  it('exposes the collapse trigger slot when maxLines is exceeded', () => {
    const { container } = render(
      <CodeBlock defaultValue='jsx' maxLines={1}>
        <CodeBlock.Content>
          <CodeBlock.Code language='jsx'>{CODE}</CodeBlock.Code>
          <CodeBlock.CollapseTrigger />
        </CodeBlock.Content>
      </CodeBlock>
    );
    expect(getSlot(container, 'code-block-collapse-trigger')).not.toBeNull();
  });

  it('exposes the language select slots', () => {
    const { container } = render(
      <CodeBlock defaultValue='jsx'>
        <CodeBlock.Header>
          <CodeBlock.LanguageSelect>
            <CodeBlock.LanguageSelectTrigger />
            <CodeBlock.LanguageSelectContent>
              <CodeBlock.LanguageSelectItem value='jsx'>
                JavaScript
              </CodeBlock.LanguageSelectItem>
            </CodeBlock.LanguageSelectContent>
          </CodeBlock.LanguageSelect>
        </CodeBlock.Header>
        <CodeBlock.Content>
          <CodeBlock.Code language='jsx'>{CODE}</CodeBlock.Code>
        </CodeBlock.Content>
      </CodeBlock>
    );
    expectSlots(container, [
      'code-block-language-select-trigger',
      'code-block-language-select-value'
    ]);
  });
});
