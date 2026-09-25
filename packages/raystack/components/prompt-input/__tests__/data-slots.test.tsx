import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectSlots, getSlot } from '~/test-utils/data-slots';
import { PromptInput } from '../prompt-input';

describe('PromptInput data-slot contract', () => {
  it('exposes slots for every rendered part', () => {
    const { container } = render(
      <PromptInput>
        <PromptInput.Header />
        <PromptInput.Textarea placeholder='Reply…' />
        <PromptInput.Footer>
          <PromptInput.Submit />
        </PromptInput.Footer>
      </PromptInput>
    );
    expectSlots(container, [
      'prompt-input',
      'prompt-input-header',
      'prompt-input-textarea',
      'prompt-input-footer',
      'prompt-input-submit'
    ]);
  });

  it('puts the textarea slot on the textarea element itself', () => {
    const { container } = render(
      <PromptInput>
        <PromptInput.Textarea />
      </PromptInput>
    );
    expect(getSlot(container, 'prompt-input-textarea')?.tagName).toBe(
      'TEXTAREA'
    );
  });
});
