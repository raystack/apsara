import { describe, expect, it } from 'vitest';
import {
  deriveDocDetails,
  docFromMarkup,
  docFromText,
  isDocEmpty,
  serializeMarkup,
  serializeText
} from '../markup';
import { isTriggerCharacter, serializeMention, trimDetails } from '../mention';

const derive = (markup: string) => deriveDocDetails(docFromMarkup(markup));
const roundTrip = (markup: string) => serializeMarkup(docFromMarkup(markup));

describe('markup dialect', () => {
  describe('triggers', () => {
    it('accepts punctuation', () => {
      for (const char of ['@', '/', '#', '!', '+', '~', '?']) {
        expect(isTriggerCharacter(char)).toBe(true);
      }
    });

    it('rejects word characters, whitespace and the dialect delimiters', () => {
      for (const char of ['a', 'Z', '9', '_', ' ', '\n', '[', ']', '\\', '']) {
        expect(isTriggerCharacter(char)).toBe(false);
      }
    });
  });

  describe('round trips', () => {
    const cases = [
      '',
      'hello',
      'hello world',
      'line one\nline two',
      '@[Button](component:button)',
      'check @[Button](component:button) tokens',
      '@[Button](component:button) @[Maya Chen](user:u1)',
      '@[Button](component:button)@[Button](component:button)',
      'before\n@[Maya Chen](user:u1) after',
      '/[Summarize](command:c1)',
      '#[1234](issue:i1)'
    ];

    for (const markup of cases) {
      it(`preserves ${JSON.stringify(markup)}`, () => {
        expect(roundTrip(markup)).toBe(markup);
      });
    }

    it('preserves labels holding the dialect delimiters', () => {
      const markup = serializeMention({
        id: 'x1',
        label: 'Weird ] name ) with \\ slashes',
        type: 'component',
        trigger: '@'
      });
      expect(roundTrip(markup)).toBe(markup);
      expect(derive(markup).mentions[0].label).toBe(
        'Weird ] name ) with \\ slashes'
      );
    });

    it('preserves ids and types holding a colon or a paren', () => {
      const markup = serializeMention({
        id: 'urn:thing:1)',
        label: 'Odd id',
        type: 'a:b',
        trigger: '@'
      });
      expect(roundTrip(markup)).toBe(markup);
      const mention = derive(markup).mentions[0];
      expect(mention.type).toBe('a:b');
      expect(mention.id).toBe('urn:thing:1)');
    });

    it('survives a generated corpus', () => {
      // A small LCG keeps the corpus reproducible when a case fails.
      let seed = 987654321;
      const next = (max: number) => {
        seed = (seed * 1103515245 + 12345) % 2147483648;
        return seed % max;
      };
      const alphabet = 'ab dz]()\\:@#/_.-19';
      const pick = (length: number) =>
        Array.from({ length }, () => alphabet[next(alphabet.length)]).join('');

      for (let round = 0; round < 200; round += 1) {
        const parts: string[] = [];
        for (let index = 0; index < 1 + next(3); index += 1) {
          parts.push(pick(1 + next(6)));
          parts.push(
            serializeMention({
              id: pick(1 + next(4)) || 'id',
              label: pick(1 + next(6)) || 'label',
              type: pick(1 + next(3)) || 'type',
              trigger: '@'
            })
          );
        }
        const markup = parts.join('');
        expect(roundTrip(markup)).toBe(markup);
      }
    });
  });

  describe('malformed markup degrades to literal text', () => {
    const literals = [
      '@[foo](bar)', // no type:id separator
      '@[foo]', // no reference
      '@[foo](:b)', // empty type
      '@[foo](a:)', // empty id
      '@[](a:b)', // empty label
      '[label](type:id)', // no trigger
      'see [docs](https://example.com) here',
      'a[foo](b:c)', // a word character is not a trigger
      'email@ [foo](b:c)',
      '@[unclosed(a:b)'
    ];

    for (const markup of literals) {
      it(`keeps ${JSON.stringify(markup)} literal`, () => {
        const details = derive(markup);
        expect(details.mentions).toHaveLength(0);
        expect(details.text).toBe(markup);
      });
    }
  });

  describe('derived text and offsets', () => {
    it('inlines each label behind its trigger', () => {
      const details = derive('check @[Maya Chen](user:u1) tokens');
      expect(details.text).toBe('check @Maya Chen tokens');
      expect(details.mentions).toEqual([
        {
          id: 'u1',
          label: 'Maya Chen',
          type: 'user',
          trigger: '@',
          start: 6,
          end: 16
        }
      ]);
      expect(details.text.slice(6, 16)).toBe('@Maya Chen');
    });

    it('keeps duplicates in document order', () => {
      const details = derive('@[A](p:1) then @[A](p:1) and @[B](p:2)');
      expect(details.mentions.map(mention => mention.id)).toEqual([
        '1',
        '1',
        '2'
      ]);
      expect(details.mentions[0].start).toBe(0);
      expect(details.mentions[1].start).toBe(details.text.indexOf('@A', 1));
    });

    it('turns hard breaks into newlines in both flavours', () => {
      const details = derive('one\n@[A](p:1)\ntwo');
      expect(details.text).toBe('one\n@A\ntwo');
      expect(details.markup).toBe('one\n@[A](p:1)\ntwo');
    });
  });

  describe('emptiness', () => {
    it('is true for nothing and for whitespace', () => {
      expect(isDocEmpty(docFromMarkup(''))).toBe(true);
      expect(isDocEmpty(docFromMarkup('   '))).toBe(true);
      expect(isDocEmpty(docFromMarkup('\n\n'))).toBe(true);
    });

    it('is false for a document holding nothing but a chip', () => {
      expect(isDocEmpty(docFromMarkup('@[A](p:1)'))).toBe(false);
      expect(isDocEmpty(docFromMarkup(' @[A](p:1) '))).toBe(false);
    });

    it('is false for text', () => {
      expect(isDocEmpty(docFromMarkup('hi'))).toBe(false);
    });
  });

  describe('trimming', () => {
    it('drops edge whitespace and re-bases offsets', () => {
      const trimmed = trimDetails(derive('  hello @[A](p:1)  '));
      expect(trimmed.text).toBe('hello @A');
      expect(trimmed.markup).toBe('hello @[A](p:1)');
      expect(trimmed.mentions[0].start).toBe(6);
      expect(trimmed.text.slice(trimmed.mentions[0].start)).toBe('@A');
    });

    it('keeps a chip that is the only content, including its trailing space', () => {
      const trimmed = trimDetails(derive('@[A](p:1) '));
      expect(trimmed.markup).toBe('@[A](p:1)');
      expect(trimmed.text).toBe('@A');
      expect(trimmed.mentions).toHaveLength(1);
      expect(trimmed.mentions[0].start).toBe(0);
    });

    it('re-bases offsets past a leading newline', () => {
      const trimmed = trimDetails(derive('\n @[A](p:1)'));
      expect(trimmed.mentions[0].start).toBe(0);
      expect(trimmed.text).toBe('@A');
    });
  });

  describe('plain text documents', () => {
    it('never interprets markup', () => {
      const details = deriveDocDetails(docFromText('@[A](p:1)'));
      expect(details.mentions).toHaveLength(0);
      expect(details.text).toBe('@[A](p:1)');
    });

    it('splits newlines into hard breaks', () => {
      expect(serializeText(docFromText('a\nb\nc'))).toBe('a\nb\nc');
    });
  });
});
