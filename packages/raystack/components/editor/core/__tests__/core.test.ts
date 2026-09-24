import { EditorState, TextSelection } from 'prosemirror-state';
import { describe, expect, it } from 'vitest';
import { clearFormatting, insertHorizontalRule, toggleList } from '../commands';
import { docFromJSON, type EditorJSON } from '../json';
import { isSafeHref, normalizeHref } from '../link';
import { buildSchema } from '../schema';
import {
  docToText,
  editorToHTML,
  editorToText,
  isEditorEmpty
} from '../serializers';
import { formatShortcut } from '../shortcuts';

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

function stateOf(json: EditorJSON, from: number, to = from) {
  const schema = buildSchema();
  const docNode = docFromJSON(schema, json);
  return EditorState.create({
    doc: docNode,
    selection: TextSelection.create(docNode, from, to)
  });
}

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
  it('writes marks, merging adjacent runs', () => {
    expect(
      editorToHTML(
        doc(
          paragraph(
            text('a', [{ type: 'bold' }]),
            text('b', [{ type: 'bold' }, { type: 'italic' }]),
            text('c')
          )
        )
      )
    ).toBe('<p><strong>a<em>b</em></strong>c</p>');
  });

  it('writes nested content holes', () => {
    expect(
      editorToHTML(
        doc({
          type: 'codeBlock',
          attrs: { language: 'ts' },
          content: [text('const a = 1;')]
        })
      )
    ).toBe('<pre><code class="language-ts">const a = 1;</code></pre>');
  });

  it('writes task items with a checkbox', () => {
    expect(
      editorToHTML(
        doc({
          type: 'taskList',
          content: [
            {
              type: 'taskItem',
              attrs: { checked: true },
              content: [paragraph(text('Docs'))]
            }
          ]
        })
      )
    ).toBe(
      '<ul data-type="taskList"><li data-type="taskItem" data-checked="true"><label><input type="checkbox" checked="checked"></label><div><p>Docs</p></div></li></ul>'
    );
  });

  it('escapes text and attributes', () => {
    expect(editorToHTML(doc(paragraph(text('<b> & "x"'))))).toBe(
      '<p>&lt;b&gt; &amp; "x"</p>'
    );
  });

  it('drops links with an unsafe href', () => {
    expect(
      editorToHTML(
        doc(
          paragraph(
            text('x', [
              { type: 'link', attrs: { href: 'javascript:alert(1)' } }
            ])
          )
        )
      )
    ).toBe('<p>x</p>');
  });

  it('writes mentions with their data attributes', () => {
    expect(
      editorToHTML(
        doc(
          paragraph({
            type: 'mention',
            attrs: { id: 'u1', label: 'Maya', type: 'user', trigger: '@' }
          })
        )
      )
    ).toBe(
      '<p><span data-mention-id="u1" data-mention-label="Maya" data-mention-type="user" data-mention-trigger="@">@Maya</span></p>'
    );
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
    const schema = buildSchema();
    expect(docToText(docFromJSON(schema, value)).mentions).toEqual([
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
  const schema = buildSchema(['bold']);

  it('turns unknown blocks into paragraphs and drops unknown marks', () => {
    const loaded = docFromJSON(
      schema,
      doc(
        { type: 'table', content: [paragraph(text('cell'))] },
        paragraph(text('x', [{ type: 'italic' }, { type: 'bold' }]))
      )
    );
    expect(loaded.toJSON()).toEqual(
      doc(paragraph(text('cell')), paragraph(text('x', [{ type: 'bold' }])))
    );
  });

  it('turns an unknown inline node into its text', () => {
    const loaded = docFromJSON(
      schema,
      doc(
        paragraph({
          type: 'mention',
          attrs: { id: 'u1', label: 'Maya', type: 'user', trigger: '@' }
        })
      )
    );
    expect(loaded.toJSON()).toEqual(doc(paragraph(text('@Maya'))));
  });

  it('returns an empty doc for empty or invalid input', () => {
    expect(docFromJSON(schema, doc()).toJSON()).toEqual(doc(paragraph()));
    expect(
      docFromJSON(schema, { type: 'paragraph' } as EditorJSON).toJSON()
    ).toEqual(doc(paragraph()));
  });

  it('clamps heading levels to 4', () => {
    const loaded = docFromJSON(
      buildSchema(),
      doc({ type: 'heading', attrs: { level: 6 }, content: [text('h')] })
    );
    expect(loaded.firstChild?.attrs.level).toBe(4);
  });
});

describe('isEditorEmpty', () => {
  it('treats whitespace as empty', () => {
    const schema = buildSchema();
    expect(isEditorEmpty(docFromJSON(schema, doc(paragraph())))).toBe(true);
    expect(isEditorEmpty(docFromJSON(schema, doc(paragraph(text('  ')))))).toBe(
      true
    );
    expect(isEditorEmpty(docFromJSON(schema, doc(paragraph(text('a')))))).toBe(
      false
    );
  });
});

describe('commands', () => {
  it('converts a bullet list to a checklist in place', () => {
    const state = stateOf(
      doc({
        type: 'bulletList',
        content: [{ type: 'listItem', content: [paragraph(text('a'))] }]
      }),
      3
    );
    const { ran, json } = apply(state, toggleList('taskList'));
    expect(ran).toBe(true);
    expect(json).toEqual(
      doc({
        type: 'taskList',
        content: [
          {
            type: 'taskItem',
            attrs: { checked: false },
            content: [paragraph(text('a'))]
          }
        ]
      })
    );
  });

  it('splits a paragraph around a divider', () => {
    const state = stateOf(doc(paragraph(text('abcd'))), 3);
    const { json } = apply(state, insertHorizontalRule);
    expect(json).toEqual(
      doc(
        paragraph(text('ab')),
        { type: 'horizontalRule' },
        paragraph(text('cd'))
      )
    );
  });

  it('clears marks and reports when there is nothing to clear', () => {
    const marked = stateOf(
      doc(paragraph(text('ab', [{ type: 'bold' }]))),
      1,
      3
    );
    expect(apply(marked, clearFormatting).json).toEqual(
      doc(paragraph(text('ab')))
    );
    const plain = stateOf(doc(paragraph(text('ab'))), 1, 3);
    expect(clearFormatting(plain)).toBe(false);
  });
});

describe('formatShortcut', () => {
  it('uses symbols on macOS', () => {
    expect(formatShortcut('Mod-Shift-x', true)).toEqual(['⌘', '⇧', 'X']);
    expect(formatShortcut('Alt-F10', true)).toEqual(['⌥', 'F10']);
  });

  it('uses names elsewhere', () => {
    expect(formatShortcut('Mod-Alt-1', false)).toEqual(['Ctrl', 'Alt', '1']);
  });

  it('reads a trailing dash as the minus key', () => {
    expect(formatShortcut('Mod--', false)).toEqual(['Ctrl', '-']);
  });
});

describe('links', () => {
  it('allows web, mail and relative links only', () => {
    expect(isSafeHref('https://a.b')).toBe(true);
    expect(isSafeHref('mailto:a@b.c')).toBe(true);
    expect(isSafeHref('/docs')).toBe(true);
    expect(isSafeHref('javascript:alert(1)')).toBe(false);
    expect(isSafeHref(' java\tscript:alert(1)')).toBe(false);
    expect(isSafeHref('data:text/html,x')).toBe(false);
  });

  it('adds a scheme to bare domains and emails', () => {
    expect(normalizeHref('raystack.org')).toBe('https://raystack.org');
    expect(normalizeHref('a@b.co')).toBe('mailto:a@b.co');
    expect(normalizeHref('#top')).toBe('#top');
  });
});
