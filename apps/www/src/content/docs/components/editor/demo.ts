'use client';

import type { ComponentPropsType } from '@/components/demo/types';
import { getPropsString } from '@/lib/utils';

const frame =
  "{{ border: '0.5px solid var(--rs-color-border-base-primary)', borderRadius: 'var(--rs-radius-3)', padding: 'var(--rs-space-4)', minHeight: 120 }}";

const sampleDoc = `{
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: 'Release notes' }]
    },
    {
      type: 'paragraph',
      content: [
        { type: 'text', text: 'Select this text to format it, type ' },
        { type: 'text', marks: [{ type: 'code' }], text: '/' },
        { type: 'text', text: ' for commands, or ' },
        { type: 'text', marks: [{ type: 'code' }], text: '@' },
        { type: 'text', text: ' to mention someone.' }
      ]
    }
  ]
}`;

const people = `[
  { id: 'u1', label: 'Maya Chen', type: 'user' },
  { id: 'u2', label: 'Arjun Rao', type: 'user' },
  { id: 'u3', label: 'Dana Whitfield', type: 'user' }
]`;

export const preview = {
  type: 'code',
  code: `function EditorPreview() {
  const people = ${people};

  return (
    <div style={{ width: 560 }}>
      <Editor defaultValue={${sampleDoc.replace(/\n/g, '\n      ')}} placeholder="Add description…">
        <Editor.Content aria-label="Description" style=${frame} />
        <Editor.FloatingToolbar>
          <Editor.HeadingMenu />
          <Toolbar.Separator />
          <Editor.MarkButton mark="bold" />
          <Editor.MarkButton mark="italic" />
          <Editor.MarkButton mark="strike" />
          <Editor.MarkButton mark="underline" />
          <Editor.LinkButton />
          <Editor.BlockButton block="blockquote" />
          <Editor.MarkButton mark="code" />
          <Editor.BlockButton block="codeBlock" />
          <Editor.ListMenu />
        </Editor.FloatingToolbar>
        <Editor.SlashMenu />
        <Editor.Mentions items={people} />
      </Editor>
    </div>
  );
}`
};

export const getCode = (props: ComponentPropsType) => {
  const {
    toolbar = 'floating',
    slashMenu = true,
    mentions = true,
    ...rest
  } = props;
  const fixed =
    toolbar === 'fixed' || toolbar === 'both'
      ? `
  <Editor.Toolbar>
    <Editor.HistoryButton action="undo" />
    <Editor.HistoryButton action="redo" />
    <Toolbar.Separator />
    <Editor.HeadingMenu />
    <Editor.ListMenu />
    <Toolbar.Separator />
    <Editor.MarkButton mark="bold" />
    <Editor.MarkButton mark="italic" />
    <Editor.LinkButton />
  </Editor.Toolbar>`
      : '';
  const floating =
    toolbar === 'floating' || toolbar === 'both'
      ? `
  <Editor.FloatingToolbar>
    <Editor.HeadingMenu />
    <Editor.MarkButton mark="bold" />
    <Editor.MarkButton mark="italic" />
    <Editor.MarkButton mark="code" />
    <Editor.LinkButton />
  </Editor.FloatingToolbar>`
      : '';
  const slash = slashMenu ? '\n  <Editor.SlashMenu />' : '';
  const mention = mentions
    ? `\n  <Editor.Mentions items={[{ id: 'u1', label: 'Maya Chen' }, { id: 'u2', label: 'Arjun Rao' }]} />`
    : '';
  return `<Editor${getPropsString(rest)}>${fixed}
  <Editor.Content style=${frame} />${floating}${slash}${mention}
</Editor>`;
};

export const playground = {
  type: 'playground',
  controls: {
    placeholder: { type: 'text', initialValue: 'Write something…' },
    toolbar: {
      type: 'select',
      options: ['floating', 'fixed', 'both'],
      defaultValue: 'floating'
    },
    slashMenu: { type: 'checkbox', defaultValue: true },
    mentions: { type: 'checkbox', defaultValue: true },
    disabled: { type: 'checkbox', defaultValue: false },
    readOnly: { type: 'checkbox', defaultValue: false }
  },
  getCode
};

export const fixedToolbarDemo = {
  type: 'code',
  code: `<div style={{ width: 600 }}>
  <Editor placeholder="Start writing…">
    <Editor.Toolbar>
      <Toolbar.Group>
        <Editor.HistoryButton action="undo" />
        <Editor.HistoryButton action="redo" />
      </Toolbar.Group>
      <Toolbar.Separator />
      <Toolbar.Group>
        <Editor.HeadingMenu levels={[1, 2, 3]} />
        <Editor.ListMenu />
        <Editor.BlockButton block="blockquote" />
        <Editor.BlockButton block="codeBlock" />
      </Toolbar.Group>
      <Toolbar.Separator />
      <Toolbar.Group>
        <Editor.MarkButton mark="bold" />
        <Editor.MarkButton mark="italic" />
        <Editor.MarkButton mark="strike" />
        <Editor.MarkButton mark="code" />
        <Editor.MarkButton mark="underline" />
        <Editor.LinkButton />
      </Toolbar.Group>
    </Editor.Toolbar>
    <Editor.Content style=${frame} />
  </Editor>
</div>`
};

export const commentBoxDemo = {
  type: 'code',
  code: `function CommentBox() {
  const editor = React.useRef(null);
  const [empty, setEmpty] = React.useState(true);
  const [comments, setComments] = React.useState([]);
  const people = ${people};

  const send = () => {
    const html = editor.current.getHTML();
    setComments(current => [...current, html]);
    editor.current.commands.clear();
    setEmpty(true);
  };

  return (
    <Flex direction="column" gap={4} style={{ width: 480 }}>
      {comments.map((html, index) => (
        <div key={index} dangerouslySetInnerHTML={{ __html: html }} />
      ))}
      <Editor
        formats={['bold', 'italic', 'code', 'link', 'bulletList', 'orderedList', 'mention']}
        placeholder="Leave a comment…"
        actionsRef={editor}
        onValueChange={(_, details) => setEmpty(details.empty)}
      >
        <Editor.Content style=${frame} />
        <Editor.Mentions items={people} />
      </Editor>
      <Flex justify="end">
        <Button size="small" disabled={empty} onClick={send}>
          Comment
        </Button>
      </Flex>
    </Flex>
  );
}`
};

export const mentionsDemo = {
  type: 'code',
  code: `function MentionsDemo() {
  const people = ${people};
  const issues = [
    { id: 'ENG-214', label: 'ENG-214 Improve onboarding', type: 'issue' },
    { id: 'ENG-230', label: 'ENG-230 Calendar range', type: 'issue' }
  ];

  const searchIssues = (query, { signal }) =>
    new Promise((resolve, reject) => {
      const timer = setTimeout(
        () =>
          resolve(
            issues.filter(issue =>
              issue.label.toLowerCase().includes(query.toLowerCase())
            )
          ),
        400
      );
      signal.addEventListener('abort', () => {
        clearTimeout(timer);
        reject(new DOMException('Aborted', 'AbortError'));
      });
    });

  return (
    <div style={{ width: 480 }}>
      <Editor placeholder="Type @ for people or # for issues">
        <Editor.Content style=${frame} />
        <Editor.Mentions items={people} />
        <Editor.Mentions trigger="#" onSearch={searchIssues} />
      </Editor>
    </div>
  );
}`
};

export const slashItemsDemo = {
  type: 'code',
  code: `function SlashItems() {
  const items = [
    ...defaultSlashItems,
    {
      id: 'date',
      label: "Today's date",
      group: 'Insert',
      keywords: ['today', 'time'],
      icon: <CalendarIcon />,
      run: editor => editor.commands.insertText(new Date().toLocaleDateString())
    }
  ];

  return (
    <div style={{ width: 480 }}>
      <Editor placeholder="Type / for commands">
        <Editor.Content style=${frame} />
        <Editor.SlashMenu items={items} />
      </Editor>
    </div>
  );
}`
};

export const controlledDemo = {
  type: 'code',
  code: `function ControlledEditor() {
  const [value, setValue] = React.useState(${sampleDoc.replace(/\n/g, '\n  ')});
  const [html, setHtml] = React.useState('');

  return (
    <Flex direction="column" gap={4} style={{ width: 520 }}>
      <Editor
        value={value}
        onValueChange={(next, details) => {
          setValue(next);
          setHtml(details.getHTML());
        }}
      >
        <Editor.Content style=${frame} />
        <Editor.FloatingToolbar>
          <Editor.MarkButton mark="bold" />
          <Editor.MarkButton mark="italic" />
        </Editor.FloatingToolbar>
      </Editor>
      <CodeBlock>
        <CodeBlock.Content>
          <CodeBlock.Code language="html">{html || 'Edit the text to see its HTML.'}</CodeBlock.Code>
        </CodeBlock.Content>
      </CodeBlock>
    </Flex>
  );
}`
};

export const markdownDemo = {
  type: 'code',
  code: `function MarkdownEditor() {
  const adapter = React.useMemo(() => MarkdownAdapter.create(), []);
  const [markdown, setMarkdown] = React.useState(
    '## Notes\\n\\nPaste **Markdown** here, or use _shortcuts_ like \`- \` and \`## \`.\\n\\n- [x] Load Markdown\\n- [ ] Save Markdown'
  );

  return (
    <Flex direction="column" gap={4} style={{ width: 520 }}>
      <Editor
        markdown={adapter}
        value={markdown}
        onValueChange={(_, details) => setMarkdown(details.getMarkdown())}
      >
        <Editor.Content style=${frame} />
        <Editor.SlashMenu />
      </Editor>
      <CodeBlock>
        <CodeBlock.Content>
          <CodeBlock.Code language="markdown">{markdown}</CodeBlock.Code>
        </CodeBlock.Content>
      </CodeBlock>
    </Flex>
  );
}`
};

export const readOnlyDemo = {
  type: 'code',
  code: `<div style={{ width: 520 }}>
  <Editor readOnly defaultValue={${sampleDoc.replace(/\n/g, '\n  ')}}>
    <Editor.Toolbar>
      <Editor.MarkButton mark="bold" />
    </Editor.Toolbar>
    <Editor.Content />
  </Editor>
</div>`
};

export const customControlDemo = {
  type: 'code',
  code: `function ClearFormattingButton() {
  const editor = useEditor();
  const canClear = useEditorState(() => editor.can.clearFormatting());

  return (
    <Toolbar.Button
      disabled={!canClear}
      onMouseDown={event => event.preventDefault()}
      onClick={() => editor.commands.clearFormatting()}
    >
      Clear
    </Toolbar.Button>
  );
}

render(
  <div style={{ width: 520 }}>
    <Editor defaultValue={{
      type: 'doc',
      content: [{
        type: 'paragraph',
        content: [{ type: 'text', marks: [{ type: 'bold' }, { type: 'italic' }], text: 'Select me and clear the formatting.' }]
      }]
    }}>
      <Editor.Toolbar>
        <Editor.MarkButton mark="bold" />
        <Editor.MarkButton mark="italic" />
        <Toolbar.Separator />
        <ClearFormattingButton />
      </Editor.Toolbar>
      <Editor.Content style=${frame} />
    </Editor>
  </div>
);`
};
