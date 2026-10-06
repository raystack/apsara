import { render } from '@testing-library/react';
import { createRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { docFromJSON, type EditorJSON } from '../core/json';
import { buildSchema } from '../core/schema';
import { Editor } from '../editor';
import type { EditorApi } from '../editor-types';
import { MarkdownAdapter } from '../markdown';
import { contentOf, copy, paste, pressKey, select } from './test-utils';

const t = (text: string, marks?: EditorJSON['marks']): EditorJSON => ({
  type: 'text',
  text,
  ...(marks ? { marks } : {})
});
const para = (...content: EditorJSON[]): EditorJSON => ({
  type: 'paragraph',
  ...(content.length ? { content } : {})
});
const doc = (...content: EditorJSON[]): EditorJSON => ({
  type: 'doc',
  content
});
const link = (href: string) => [{ type: 'link', attrs: { href } }];
const mention: EditorJSON = {
  type: 'mention',
  attrs: { id: 'u1', label: 'Maya', type: 'user', trigger: '@' }
};
const bullets = (...items: string[]): EditorJSON => ({
  type: 'bulletList',
  content: items.map(item => ({ type: 'listItem', content: [para(t(item))] }))
});
const tasks = (...items: string[]): EditorJSON => ({
  type: 'taskList',
  content: items.map(item => ({
    type: 'taskItem',
    attrs: { checked: false },
    content: [para(...(item ? [t(item)] : []))]
  }))
});

/** Loads through the schema, so defaults such as `language: null` are filled in. */
function normalize(value: EditorJSON): EditorJSON {
  return docFromJSON(buildSchema(), value).toJSON() as EditorJSON;
}

function roundTrip(value: EditorJSON): EditorJSON {
  return normalize(MarkdownAdapter.toEditor(MarkdownAdapter.fromEditor(value)));
}

const EVERYTHING = doc(
  { type: 'heading', attrs: { level: 1 }, content: [t('Release notes')] },
  para(
    t('Plain '),
    t('bold', [{ type: 'bold' }]),
    t(' '),
    t('italic', [{ type: 'italic' }]),
    t(' '),
    t('strike', [{ type: 'strike' }]),
    t(' '),
    t('under', [{ type: 'underline' }]),
    t(' '),
    t('code', [{ type: 'code' }]),
    t(' '),
    t('link', link('https://raystack.org')),
    t(' and '),
    {
      type: 'mention',
      attrs: { id: 'u_42', label: 'Maya Chen', type: 'user', trigger: '@' }
    },
    t(' done.')
  ),
  para(t('line one'), { type: 'hardBreak' }, t('line two')),
  { type: 'blockquote', content: [para(t('Quoted'))] },
  {
    type: 'codeBlock',
    attrs: { language: 'ts' },
    content: [t('const a = `x`;\nconst b = 2;')]
  },
  { type: 'horizontalRule' },
  {
    type: 'bulletList',
    content: [
      { type: 'listItem', content: [para(t('One')), bullets('Nested')] },
      { type: 'listItem', content: [para(t('Two'))] }
    ]
  },
  {
    type: 'orderedList',
    attrs: { start: 3 },
    content: [{ type: 'listItem', content: [para(t('Three'))] }]
  },
  {
    type: 'taskList',
    content: [
      { type: 'taskItem', attrs: { checked: true }, content: [para(t('Done'))] }
    ]
  },
  para(t('Special *chars* _here_ [x] <b> # not a heading'))
);

describe('MarkdownAdapter', () => {
  it('round-trips every node and mark', () => {
    expect(roundTrip(EVERYTHING)).toEqual(normalize(EVERYTHING));
  });

  it('writes readable Markdown', () => {
    expect(
      MarkdownAdapter.fromEditor(
        doc(
          { type: 'heading', attrs: { level: 2 }, content: [t('Title')] },
          para(t('Ship the '), t('fix', [{ type: 'bold' }]), t('.')),
          tasks('Docs')
        )
      )
    ).toBe('## Title\n\nShip the **fix**.\n\n- [ ] Docs');
  });

  it('round-trips content that plain Markdown would misread', () => {
    const cases: Record<string, EditorJSON> = {
      'italic inside a word': doc(
        para(t('un'), t('believ', [{ type: 'italic' }]), t('able'))
      ),
      'bold that ends in punctuation before a word': doc(
        para(t('Note:', [{ type: 'bold' }]), t('text'))
      ),
      'leading spaces': doc(para(t('    code?'))),
      'a line that reads as a divider': doc(para(t('---'))),
      'an empty task item': doc(tasks('')),
      'a task list after a bullet list': doc(bullets('x'), tasks('y')),
      '"!" before a link': doc(
        para(t('Wow!'), t('link', link('https://x.co')))
      ),
      'a mention after punctuation': doc(para(t('('), mention, t(')')))
    };
    for (const [name, value] of Object.entries(cases)) {
      expect(roundTrip(value), name).toEqual(normalize(value));
    }
  });

  it('reads links and code after punctuation as links and code', () => {
    expect(
      normalize(
        MarkdownAdapter.toEditor(
          '"[a](https://x.com)" ([b](mailto:b@c.co)) `[c](https://d)`'
        )
      )
    ).toEqual(
      doc(
        para(
          t('"'),
          t('a', link('https://x.com')),
          t('" ('),
          t('b', link('mailto:b@c.co')),
          t(') '),
          t('[c](https://d)', [{ type: 'code' }])
        )
      )
    );
  });

  it('reads character references as CommonMark does', () => {
    expect(
      MarkdownAdapter.toEditor('&#99999999; &#1114112; &#x41; `&lt;b&gt;`')
    ).toEqual(
      doc(para(t('&#99999999; � A '), t('&lt;b&gt;', [{ type: 'code' }])))
    );
  });

  it('keeps raw HTML as text and drops unsafe links both ways', () => {
    expect(
      MarkdownAdapter.toEditor('<script>x</script>\n\n[a](javascript:alert(1))')
    ).toEqual(doc(para(t('<script>x</script>')), para(t('a'))));
    expect(
      MarkdownAdapter.fromEditor(
        doc(para(t('a', link('javascript&#58;alert(1)'))))
      )
    ).toBe('a');
  });
});

describe('Editor with the markdown prop', () => {
  function setup(
    props: Partial<Parameters<typeof Editor>[0]> = {},
    options: Parameters<typeof MarkdownAdapter.create>[0] = {}
  ) {
    const actionsRef = createRef<EditorApi>();
    const { container } = render(
      <Editor
        markdown={MarkdownAdapter.create(options)}
        actionsRef={actionsRef}
        {...props}
      >
        <Editor.Content />
      </Editor>
    );
    const api = () => {
      if (!actionsRef.current) throw new Error('no api');
      return actionsRef.current;
    };
    const view = () => {
      const current = api().view;
      if (!current) throw new Error('no view');
      return current;
    };
    return { api, view, content: contentOf(container) };
  }

  it('loads a Markdown defaultValue and reports getMarkdown', () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <Editor
        markdown={MarkdownAdapter.create()}
        defaultValue='**bold** text'
        autoFocus='end'
        onValueChange={onValueChange}
      >
        <Editor.Content />
      </Editor>
    );
    const content = contentOf(container);
    expect(content.querySelector('strong')).toHaveTextContent('bold');
    paste(content, '!');
    expect(onValueChange.mock.calls[0][1].getMarkdown()).toBe('**bold** text!');
  });

  it('parses pasted Markdown, keeps the marks at the caret, and pastes text in code', () => {
    const blocks = setup();
    paste(blocks.content, '## Heading\n\n- one\n- two');
    expect(blocks.api().getHTML()).toBe(
      '<h2>Heading</h2><ul><li><p>one</p></li><li><p>two</p></li></ul>'
    );

    const bold = setup({
      defaultValue: doc(para(t('Hello', [{ type: 'bold' }])))
    });
    select(bold.view(), 3, 3);
    paste(bold.content, 'X');
    expect(bold.api().getJSON()).toEqual(
      doc(para(t('HeXllo', [{ type: 'bold' }])))
    );

    const code = setup({ defaultValue: doc({ type: 'codeBlock' }) });
    paste(code.content, '**x**');
    expect(code.api().getHTML()).toBe('<pre><code>**x**</code></pre>');
  });

  // An empty paragraph has no Markdown, so reloading the string would drop it.
  it('keeps the doc when a controlled string is what the doc converts to', () => {
    const actionsRef = createRef<EditorApi>();
    function Controlled() {
      const [markdown, setMarkdown] = useState('Hello');
      return (
        <Editor
          markdown={MarkdownAdapter.create()}
          value={markdown}
          actionsRef={actionsRef}
          onValueChange={value =>
            setMarkdown(MarkdownAdapter.fromEditor(value))
          }
        >
          <Editor.Content />
        </Editor>
      );
    }
    const { container } = render(<Controlled />);
    const view = actionsRef.current?.view;
    if (!view) throw new Error('no view');
    select(view, 6, 6);
    pressKey(contentOf(container), 'Enter');
    expect(actionsRef.current?.getJSON()).toEqual(
      doc(para(t('Hello')), para())
    );
  });

  it('copies Markdown with copy: true', () => {
    const { view, content } = setup(
      {
        defaultValue: doc(
          para(t('some '), t('bold', [{ type: 'bold' }]), t(' words')),
          bullets('one', 'two')
        )
      },
      { copy: true }
    );
    select(view(), 1, 16);
    expect(copy(content)).toBe('some **bold** words');
    // From inside the first item to inside the second.
    select(view(), 21, 29);
    expect(copy(content)).toBe('- ne\n- tw');
  });
});
