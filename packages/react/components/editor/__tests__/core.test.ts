import { AllSelection, EditorState, TextSelection } from 'prosemirror-state';
import { describe, expect, it } from 'vitest';
import { setLink, toggleBlock } from '../core/commands';
import { docFromJSON, type EditorJSON } from '../core/json';
import { isSafeHref, normalizeHref } from '../core/link';
import { buildSchema } from '../core/schema';
import { docToText, editorToHTML, editorToText } from '../core/serializers';

const text = (value: string, marks?: EditorJSON['marks']): EditorJSON => ({
  type: 'text',
  text: value,
  ...(marks ? { marks } : {})
});
const paragraph = (...content: EditorJSON[]): EditorJSON => ({
  type: 'paragraph',
  ...(content.length ? { content } : {})
});
const doc = (...content: EditorJSON[]): EditorJSON => ({
  type: 'doc',
  content
});
const link = (href: string) => ({ type: 'link', attrs: { href } });

function apply(
  state: EditorState,
  command: (s: EditorState, d?: (tr: EditorState['tr']) => void) => boolean
) {
  let next = state;
  const ran = command(state, tr => {
    next = state.apply(tr);
  });
  return { ran, json: next.doc.toJSON() as EditorJSON };
}

describe('editorToHTML', () => {
  it('writes marks, nested content holes and void elements', () => {
    expect(
      editorToHTML(
        doc(
          paragraph(
            text('a', [{ type: 'bold' }]),
            text('b', [{ type: 'bold' }, { type: 'italic' }]),
            text('c')
          ),
          {
            type: 'taskList',
            content: [
              {
                type: 'taskItem',
                attrs: { checked: true },
                content: [paragraph(text('Docs'))]
              }
            ]
          }
        )
      )
    ).toBe(
      '<p><strong>a<em>b</em></strong>c</p><ul data-type="taskList"><li data-type="taskItem" data-checked="true"><label><input type="checkbox" checked="checked"></label><div><p>Docs</p></div></li></ul>'
    );
  });

  it('escapes text and attributes, and drops unsafe links', () => {
    const html = (href: string, value = 'x') =>
      editorToHTML(doc(paragraph(text(value, [link(href)]))));
    expect(html('/search?q="x"&y', '<b> & "x"')).toBe(
      '<p><a href="/search?q=&quot;x&quot;&amp;y" rel="noopener noreferrer nofollow">&lt;b&gt; &amp; "x"</a></p>'
    );
    // A NUL in the href must not let the link text escape the attribute.
    expect(html('https://a\u0000b', '" onmouseover="alert(1)" x="')).toBe(
      '<p><a href="https://ab" rel="noopener noreferrer nofollow">" onmouseover="alert(1)" x="</a></p>'
    );
    expect(html('javascript:alert(1)')).toBe('<p>x</p>');
  });
});

describe('editorToText', () => {
  it('separates blocks with a blank line and reads mentions as @label', () => {
    const value = doc(
      { type: 'heading', attrs: { level: 1 }, content: [text('Title')] },
      paragraph(
        text('Ask '),
        {
          type: 'mention',
          attrs: { id: 'u1', label: 'Maya', type: 'user', trigger: '@' }
        },
        { type: 'hardBreak' },
        text('now')
      )
    );
    expect(editorToText(value)).toBe('Title\n\nAsk @Maya\nnow');
    expect(docToText(docFromJSON(buildSchema(), value)).mentions).toEqual([
      {
        id: 'u1',
        label: 'Maya',
        type: 'user',
        trigger: '@',
        start: 11,
        end: 16
      }
    ]);
  });
});

describe('docFromJSON', () => {
  it('unwraps nodes the schema does not have and wraps misplaced ones', () => {
    expect(
      docFromJSON(
        buildSchema(['bold']),
        doc(
          {
            type: 'bulletList',
            content: [
              { type: 'listItem', content: [paragraph(text('Buy milk'))] },
              { type: 'listItem', content: [paragraph(text('Call Bob'))] }
            ]
          },
          paragraph(text('x', [{ type: 'italic' }, { type: 'bold' }]))
        )
      ).toJSON()
    ).toEqual(
      doc(
        paragraph(text('Buy milk')),
        paragraph(text('Call Bob')),
        paragraph(text('x', [{ type: 'bold' }]))
      )
    );
    expect(
      docFromJSON(
        buildSchema(),
        doc(text('Hello'), {
          type: 'listItem',
          content: [paragraph(text('a'))]
        })
      ).toJSON()
    ).toEqual(
      doc(paragraph(text('Hello')), {
        type: 'bulletList',
        content: [{ type: 'listItem', content: [paragraph(text('a'))] }]
      })
    );
  });

  it('repairs invalid content and never throws', () => {
    const load = (value: unknown) =>
      docFromJSON(buildSchema(), value as EditorJSON).toJSON();
    expect(
      load(
        doc({
          type: 'codeBlock',
          content: [
            text('a', [{ type: 'bold' }]),
            { type: 'hardBreak' },
            text('b')
          ]
        })
      )
    ).toEqual(
      doc({
        type: 'codeBlock',
        attrs: { language: null },
        content: [text('a\nb')]
      })
    );
    expect(
      load(
        doc({ type: 'heading', attrs: { level: 2.4 }, content: [text('h')] })
      )
    ).toEqual(
      doc({ type: 'heading', attrs: { level: 2 }, content: [text('h')] })
    );
    expect(
      load(doc(paragraph({ type: 'mention', attrs: { label: 'Maya' } })))
    ).toEqual(doc(paragraph(text('@Maya'))));
    expect(load({ type: 'paragraph' })).toEqual(doc(paragraph()));
    expect(load({ type: 'doc', content: [null] })).toEqual(doc(paragraph()));
    expect(load({ type: 'doc', content: 'text' })).toEqual(doc(paragraph()));
  });
});

describe('commands', () => {
  it('sets a link after Select All', () => {
    const docNode = docFromJSON(
      buildSchema(),
      doc(paragraph(text('a')), paragraph(text('b')))
    );
    const state = EditorState.create({
      doc: docNode,
      selection: new AllSelection(docNode)
    });
    expect(apply(state, setLink('a.b'))).toEqual({
      ran: true,
      json: doc(
        paragraph(text('a', [link('https://a.b')])),
        paragraph(text('b', [link('https://a.b')]))
      )
    });
  });

  it('keeps line breaks when a paragraph becomes a code block and back', () => {
    const stateOf = (json: EditorJSON) => {
      const docNode = docFromJSON(buildSchema(), json);
      return EditorState.create({
        doc: docNode,
        selection: TextSelection.create(docNode, 1)
      });
    };
    const lines = doc(paragraph(text('a'), { type: 'hardBreak' }, text('b')));
    const code = apply(stateOf(lines), toggleBlock('codeBlock'));
    expect(code.json).toEqual(
      doc({
        type: 'codeBlock',
        attrs: { language: null },
        content: [text('a\nb')]
      })
    );
    expect(apply(stateOf(code.json), toggleBlock('codeBlock')).json).toEqual(
      lines
    );
  });
});

describe('links', () => {
  it('allows web, mail and relative links, and adds a scheme to bare hosts', () => {
    for (const href of ['https://a.b', 'mailto:a@b.c', '/docs']) {
      expect(isSafeHref(href), href).toBe(true);
    }
    for (const href of [
      'javascript:alert(1)',
      ' java\tscript:alert(1)',
      'data:text/html,x',
      'javascript&#58;alert(1)',
      '&#106;avascript:alert(1)',
      'javascript&colon;alert(1)'
    ]) {
      expect(isSafeHref(href), href).toBe(false);
    }
    expect(normalizeHref('raystack.org')).toBe('https://raystack.org');
    expect(normalizeHref('localhost:3000')).toBe('https://localhost:3000');
    expect(normalizeHref('a@b.co')).toBe('mailto:a@b.co');
    expect(normalizeHref('#top')).toBe('#top');
  });
});
