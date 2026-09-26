import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { render } from '@testing-library/react';
import { createRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { contentOf, paste } from '../../__tests__/test-utils';
import { docFromJSON, type EditorJSON } from '../../core/json';
import { buildSchema } from '../../core/schema';
import { Editor } from '../../editor';
import type { EditorApi } from '../../editor-types';
import { MarkdownAdapter } from '../index';

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

/** Loads through the schema, so defaults such as `language: null` are filled in. */
function normalize(value: EditorJSON): EditorJSON {
  return docFromJSON(buildSchema(), value).toJSON() as EditorJSON;
}

const EVERYTHING = doc(
  { type: 'heading', attrs: { level: 1 }, content: [t('Release notes')] },
  { type: 'heading', attrs: { level: 4 }, content: [t('Small')] },
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
    t('link', [{ type: 'link', attrs: { href: 'https://raystack.org' } }]),
    t(' and '),
    {
      type: 'mention',
      attrs: { id: 'u_42', label: 'Maya Chen', type: 'user', trigger: '@' }
    },
    t(' done.')
  ),
  para(t('line one'), { type: 'hardBreak' }, t('line two')),
  {
    type: 'blockquote',
    content: [para(t('Quoted'))]
  },
  {
    type: 'codeBlock',
    attrs: { language: 'ts' },
    content: [t('const a = `x`;\nconst b = 2;')]
  },
  { type: 'horizontalRule' },
  {
    type: 'bulletList',
    content: [
      {
        type: 'listItem',
        content: [
          para(t('One')),
          {
            type: 'bulletList',
            content: [{ type: 'listItem', content: [para(t('Nested'))] }]
          }
        ]
      },
      { type: 'listItem', content: [para(t('Two'))] }
    ]
  },
  {
    type: 'orderedList',
    attrs: { start: 3 },
    content: [
      { type: 'listItem', content: [para(t('Three'))] },
      { type: 'listItem', content: [para(t('Four'))] }
    ]
  },
  {
    type: 'taskList',
    content: [
      {
        type: 'taskItem',
        attrs: { checked: true },
        content: [para(t('Done'))]
      },
      {
        type: 'taskItem',
        attrs: { checked: false },
        content: [para(t('Todo'))]
      }
    ]
  },
  para(t('Special *chars* _here_ [x] <b> # not a heading'))
);

describe('MarkdownAdapter', () => {
  it('round-trips every node and mark', () => {
    const markdown = MarkdownAdapter.fromEditor(EVERYTHING);
    expect(normalize(MarkdownAdapter.toEditor(markdown))).toEqual(
      normalize(EVERYTHING)
    );
  });

  it('writes readable Markdown', () => {
    expect(
      MarkdownAdapter.fromEditor(
        doc(
          { type: 'heading', attrs: { level: 2 }, content: [t('Title')] },
          para(t('Ship the '), t('fix', [{ type: 'bold' }]), t('.')),
          {
            type: 'taskList',
            content: [
              {
                type: 'taskItem',
                attrs: { checked: true },
                content: [para(t('Docs'))]
              }
            ]
          }
        )
      )
    ).toBe('## Title\n\nShip the **fix**.\n\n- [x] Docs');
  });

  it('moves whitespace outside marks', () => {
    expect(
      MarkdownAdapter.fromEditor(
        doc(para(t('a'), t(' bold ', [{ type: 'bold' }]), t('b')))
      )
    ).toBe('a **bold** b');
  });

  it('writes mentions as labels with mentions: "label"', () => {
    const adapter = MarkdownAdapter.create({ mentions: 'label' });
    expect(
      adapter.fromEditor(
        doc(
          para({
            type: 'mention',
            attrs: { id: '1', label: 'Maya', type: 'user', trigger: '@' }
          })
        )
      )
    ).toBe('@Maya');
  });

  it('drops underline with underline: "drop"', () => {
    const adapter = MarkdownAdapter.create({ underline: 'drop' });
    expect(adapter.fromEditor(doc(para(t('u', [{ type: 'underline' }]))))).toBe(
      'u'
    );
  });

  it('keeps raw HTML as text and drops unsafe links', () => {
    expect(
      MarkdownAdapter.toEditor('<script>x</script>\n\n[a](javascript:alert(1))')
    ).toEqual(doc(para(t('<script>x</script>')), para(t('a'))));
  });

  it('does not read an image as a mention', () => {
    expect(MarkdownAdapter.toEditor('![alt](https://x/y.png)')).toEqual(
      doc(para(t('alt')))
    );
  });

  it('clamps heading levels and turns tables into text', () => {
    expect(
      MarkdownAdapter.toEditor('###### Deep\n\n| a | b |\n| - | - |\n| 1 | 2 |')
    ).toEqual(
      doc(
        { type: 'heading', attrs: { level: 4 }, content: [t('Deep')] },
        para(t('a | b')),
        para(t('1 | 2'))
      )
    );
  });
});

describe('Editor with the markdown prop', () => {
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
    const [value, details] = onValueChange.mock.calls[0];
    expect(value.type).toBe('doc');
    expect(details.getMarkdown()).toBe('**bold** text!');
  });

  it('parses pasted plain-text Markdown', () => {
    const actionsRef = createRef<EditorApi>();
    const { container } = render(
      <Editor markdown={MarkdownAdapter.create()} actionsRef={actionsRef}>
        <Editor.Content />
      </Editor>
    );
    paste(contentOf(container), '## Heading\n\n- one\n- two');
    expect(actionsRef.current?.getHTML()).toBe(
      '<h2>Heading</h2><ul><li><p>one</p></li><li><p>two</p></li></ul>'
    );
  });

  it('leaves pastes as text with paste: false', () => {
    const actionsRef = createRef<EditorApi>();
    const { container } = render(
      <Editor
        markdown={MarkdownAdapter.create({ paste: false })}
        actionsRef={actionsRef}
      >
        <Editor.Content />
      </Editor>
    );
    paste(contentOf(container), '**x**');
    expect(actionsRef.current?.getHTML()).toBe('<p>**x**</p>');
  });

  it('keeps the doc when a controlled string is the one it produced', () => {
    function Controlled() {
      const [markdown, setMarkdown] = useState('Hello');
      return (
        <Editor
          markdown={MarkdownAdapter.create()}
          value={markdown}
          autoFocus='end'
          onValueChange={(_, details) => setMarkdown(details.getMarkdown())}
        >
          <Editor.Content />
        </Editor>
      );
    }
    const { container } = render(<Controlled />);
    const content = contentOf(container);
    paste(content, ' world');
    paste(content, '!');
    expect(content).toHaveTextContent('Hello world!');
  });

  it('replaces the doc for a new controlled string', () => {
    const adapter = MarkdownAdapter.create();
    const { container, rerender } = render(
      <Editor markdown={adapter} value='One'>
        <Editor.Content />
      </Editor>
    );
    rerender(
      <Editor markdown={adapter} value='# Two'>
        <Editor.Content />
      </Editor>
    );
    expect(contentOf(container).querySelector('h1')).toHaveTextContent('Two');
  });

  it('returns Markdown from the api', () => {
    const actionsRef = createRef<EditorApi>();
    render(
      <Editor
        markdown={MarkdownAdapter.create()}
        defaultValue='_hi_'
        actionsRef={actionsRef}
      >
        <Editor.Content />
      </Editor>
    );
    expect(actionsRef.current?.getMarkdown()).toBe('_hi_');
  });

  it('warns and loads plain text for a string without the prop', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const actionsRef = createRef<EditorApi>();
    render(
      // @ts-expect-error a string value needs the markdown prop
      <Editor defaultValue='**x**' actionsRef={actionsRef}>
        <Editor.Content />
      </Editor>
    );
    expect(warn).toHaveBeenCalled();
    expect(actionsRef.current?.getText()).toBe('**x**');
    warn.mockRestore();
  });
});

describe('bundle boundary', () => {
  it('has no module outside markdown/ importing from it', () => {
    const root = resolve(__dirname, '../..');
    const offenders: string[] = [];
    const walk = (dir: string) => {
      for (const name of readdirSync(dir)) {
        const path = join(dir, name);
        if (statSync(path).isDirectory()) {
          if (name !== 'markdown' && name !== '__tests__') walk(path);
          continue;
        }
        if (!/\.tsx?$/.test(name) || name === 'index.tsx') continue;
        const source = readFileSync(path, 'utf8');
        if (/from '\.{1,2}\/(?:\.\.\/)*markdown/.test(source)) {
          offenders.push(path.slice(root.length + 1));
        }
      }
    };
    walk(root);
    expect(offenders).toEqual([]);
  });
});
