'use client';

export const preview = {
  type: 'code',
  code: `function PromptInputPreview() {
  const [status, setStatus] = React.useState('idle');
  const timerRef = React.useRef(null);

  React.useEffect(() => () => clearTimeout(timerRef.current), []);

  return (
    <div style={{ width: 420 }}>
      <PromptInput
        status={status}
        onSubmit={(value, event) => {
          event.currentTarget.reset();
          setStatus('streaming');
          timerRef.current = setTimeout(() => setStatus('idle'), 2500);
        }}
        onStop={() => {
          clearTimeout(timerRef.current);
          setStatus('idle');
        }}
      >
        <PromptInput.Textarea placeholder="Ask anything…" />
        <PromptInput.Footer>
          <Button type="button" variant="ghost" color="neutral" size="small">
            Skills
          </Button>
          <Button
            type="button"
            variant="ghost"
            color="neutral"
            size="small"
            aria-label="Attach file"
          >
            📎
          </Button>
          <PromptInput.Submit />
        </PromptInput.Footer>
      </PromptInput>
    </div>
  );
}`
};

export const attachmentsDemo = {
  type: 'code',
  code: `<div style={{ width: 420 }}>
  <PromptInput onSubmit={value => console.log(value)}>
    <PromptInput.Header>
      <Chat.Attachment title="design-spec.pdf" description="1.2 MB" onRemove={() => {}} />
      <Chat.Attachment title="screenshot.png" state="uploading" description="Uploading…" />
    </PromptInput.Header>
    <PromptInput.Textarea placeholder="Reply…" />
    <PromptInput.Footer>
      <PromptInput.Submit />
    </PromptInput.Footer>
  </PromptInput>
</div>`
};

export const statusDemo = {
  type: 'code',
  code: `function PromptInputStatuses() {
  const STATUSES = ['idle', 'submitted', 'streaming', 'error'];

  return (
    <Flex gap={5} wrap="wrap">
      {STATUSES.map(status => (
        <Flex key={status} direction="column" gap={2} style={{ width: 320 }}>
          <Text size="small" variant="secondary">status="{status}"</Text>
          <PromptInput
            status={status}
            defaultValue="Summarize this thread"
            onSubmit={() => {}}
            onStop={() => {}}
          >
            <PromptInput.Textarea />
            <PromptInput.Footer>
              <PromptInput.Submit />
            </PromptInput.Footer>
          </PromptInput>
        </Flex>
      ))}
    </Flex>
  );
}`
};

export const controlledDemo = {
  type: 'code',
  code: `function ControlledPromptInput() {
  const [value, setValue] = React.useState('');

  return (
    <Flex direction="column" gap={4} style={{ width: 420 }}>
      <PromptInput
        value={value}
        onValueChange={setValue}
        onSubmit={() => setValue('')}
      >
        <PromptInput.Textarea placeholder="Write a message…" />
        <PromptInput.Footer>
          <PromptInput.Submit />
        </PromptInput.Footer>
      </PromptInput>
      <Text size="small" variant="secondary">{value.length} characters</Text>
    </Flex>
  );
}`
};

export const disabledDemo = {
  type: 'code',
  code: `<div style={{ width: 420 }}>
  <PromptInput disabled>
    <PromptInput.Textarea placeholder="Read-only conversation" />
    <PromptInput.Footer>
      <Button type="button" variant="ghost" color="neutral" size="small" disabled>
        Skills
      </Button>
      <PromptInput.Submit />
    </PromptInput.Footer>
  </PromptInput>
</div>`
};

export const editorCapabilitiesDemo = {
  type: 'code',
  code: `function EditorCapabilities() {
  const composer = React.useRef(null);

  // Ungrouped items lead the menu; groups follow in the order they first
  // appear. Icons, trailing badges, disabled rows and opaque \`data\` all work.
  const ITEMS = [
    {
      id: 'page',
      label: 'This page',
      type: 'page',
      icon: <FileTextIcon />,
      data: { path: '/docs/ai-elements/prompt-input' }
    },
    {
      id: 'button',
      label: 'Button',
      type: 'component',
      group: 'Components',
      icon: <Component size={16} strokeWidth={1.5} />,
      data: { status: 'stable' }
    },
    {
      id: 'data-table',
      label: 'DataTable',
      type: 'component',
      group: 'Components',
      icon: <Component size={16} strokeWidth={1.5} />,
      data: { status: 'stable' }
    },
    {
      id: 'prompt-input',
      label: 'PromptInput',
      type: 'component',
      group: 'Components',
      icon: <Component size={16} strokeWidth={1.5} />,
      data: { status: 'beta' }
    },
    {
      id: 'u1',
      label: 'Maya Chen',
      type: 'user',
      group: 'Users',
      icon: <Avatar size={1} fallback="M" />
    },
    {
      id: 'u2',
      label: 'Apsara Assistant',
      type: 'user',
      group: 'Users',
      icon: <Avatar size={1} fallback="A" />,
      trailing: <Badge size="micro" variant="neutral">Agent</Badge>
    },
    {
      id: 'u3',
      label: 'Dana Whitfield',
      type: 'user',
      group: 'Users',
      icon: <Avatar size={1} fallback="D" />,
      disabled: true
    }
  ];

  const MAX_LENGTH = 280;
  const [draft, setDraft] = React.useState({ markup: '', text: '', mentions: [] });

  // getValue() seeds the readout with the restored draft before any edit.
  React.useEffect(() => {
    const message = composer.current?.getValue();
    if (message) setDraft(message);
  }, []);

  const mono = { fontFamily: 'monospace', wordBreak: 'break-all' };

  // A fixed footprint: the readout below grows as you type, and the docs page
  // centres this box, so letting it change height would nudge the whole page.
  return (
    <Flex direction="column" gap={5} style={{ width: 520, height: 300 }}>
      <PromptInput
        actionsRef={composer}
        defaultValue="Ping @[Maya Chen](user:u1) about "
        onValueChange={(markup, details) =>
          setDraft({ markup, text: details.text, mentions: details.mentions })
        }
        onSubmit={(message, event) => event.currentTarget.reset()}
      >
        <PromptInput.Mentions
          trigger="@"
          items={ITEMS}
          // The saved draft above carries only type, id and label — this fills
          // the icon and data back in, and refreshes a renamed label.
          resolveMentions={refs =>
            Promise.resolve(
              refs.map(ref => ITEMS.find(item => item.id === ref.id)).filter(Boolean)
            )
          }
          emptyMessage="Nothing matches"
        />
        <PromptInput.Editor
          placeholder="Type @ to mention, Shift+Enter for a new line…"
          maxLength={MAX_LENGTH}
        />
        <PromptInput.Footer>
          <Button
            type="button"
            variant="ghost"
            color="neutral"
            size="small"
            onClick={() =>
              composer.current?.insertMention({
                id: 'data-table',
                label: 'DataTable',
                type: 'component',
                icon: <Component size={16} strokeWidth={1.5} />,
                data: { status: 'stable' }
              })
            }
          >
            Insert chip
          </Button>
          <Button
            type="button"
            variant="ghost"
            color="neutral"
            size="small"
            onClick={() => composer.current?.clear()}
          >
            Clear
          </Button>
          <Text size="micro" variant="secondary">
            {draft.text.length}/{MAX_LENGTH}
          </Text>
          <PromptInput.Submit />
        </PromptInput.Footer>
      </PromptInput>

      <Flex
        direction="column"
        gap={3}
        style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}
      >
        <Text size="micro" variant="secondary">text</Text>
        <Text size="small" style={mono}>{draft.text || '—'}</Text>

        <Text size="micro" variant="secondary">markup (save this as the draft)</Text>
        <Text size="small" style={mono}>{draft.markup || '—'}</Text>

        <Text size="micro" variant="secondary">mentions</Text>
        {draft.mentions.length === 0 ? (
          <Text size="small" style={mono}>—</Text>
        ) : (
          draft.mentions.map((mention, index) => (
            <Text key={index} size="small" style={mono}>
              {mention.type}:{mention.id} at [{mention.start}, {mention.end}]
              {mention.data ? ' — data ' + JSON.stringify(mention.data) : ''}
            </Text>
          ))
        )}
      </Flex>
    </Flex>
  );
}`
};

export const mentionsDemo = {
  type: 'code',
  code: `function MentionsPromptInput() {
  const ITEMS = [
    { id: 'button', label: 'Button', type: 'component', group: 'Components' },
    { id: 'data-table', label: 'DataTable', type: 'component', group: 'Components' },
    {
      id: 'prompt-input',
      label: 'PromptInput',
      type: 'component',
      group: 'Components'
    },
    { id: 'u1', label: 'Maya Chen', type: 'user', group: 'Users' },
    {
      id: 'u2',
      label: 'Apsara Assistant',
      type: 'user',
      group: 'Users',
      trailing: <Badge size="micro" variant="neutral">Agent</Badge>
    },
    { id: 'u3', label: 'Dana Whitfield', type: 'user', group: 'Users' }
  ];

  const [sent, setSent] = React.useState(null);

  return (
    <Flex direction="column" gap={4} style={{ width: 420 }}>
      <PromptInput
        onSubmit={(message, event) => {
          setSent(message);
          event.currentTarget.reset();
        }}
      >
        <PromptInput.Mentions trigger="@" items={ITEMS} />
        <PromptInput.Editor placeholder="Type @ to mention…" />
        <PromptInput.Footer>
          <PromptInput.Submit />
        </PromptInput.Footer>
      </PromptInput>
      {sent ? (
        <Flex direction="column" gap={2}>
          <Text size="small" variant="secondary">text: {sent.text}</Text>
          <Text size="small" variant="secondary">markup: {sent.markup}</Text>
          <Text size="small" variant="secondary">
            mentions: {sent.mentions.map(m => m.type + ':' + m.id).join(', ') || '—'}
          </Text>
        </Flex>
      ) : null}
    </Flex>
  );
}`
};

export const mentionsAsyncDemo = {
  type: 'code',
  code: `function AsyncMentionsPromptInput() {
  const DIRECTORY = [
    { id: 'button', label: 'Button', type: 'component', group: 'Components' },
    { id: 'data-table', label: 'DataTable', type: 'component', group: 'Components' },
    {
      id: 'prompt-input',
      label: 'PromptInput',
      type: 'component',
      group: 'Components'
    },
    { id: 'u1', label: 'Maya Chen', type: 'user', group: 'Users' },
    { id: 'u2', label: 'Ravi Iyer', type: 'user', group: 'Users' },
    { id: 'u3', label: 'Nia Okafor', type: 'user', group: 'Users' }
  ];

  // Stands in for your API. The signal is aborted when a request is superseded.
  const search = (query, { signal }) =>
    new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        const q = query.toLowerCase();
        resolve(DIRECTORY.filter(item => item.label.toLowerCase().includes(q)));
      }, 600);
      signal.addEventListener('abort', () => {
        clearTimeout(timer);
        reject(new DOMException('Aborted', 'AbortError'));
      });
    });

  return (
    <div style={{ width: 420 }}>
      <PromptInput
        defaultValue="ping @[Maya Chen](user:u1) about "
        onSubmit={(message, event) => event.currentTarget.reset()}
      >
        <PromptInput.Mentions
          trigger="@"
          onSearch={search}
          resolveMentions={refs =>
            Promise.resolve(
              refs
                .map(ref => DIRECTORY.find(item => item.id === ref.id))
                .filter(Boolean)
            )
          }
          emptyMessage="Nothing by that name"
        />
        <PromptInput.Editor placeholder="Type @ to mention…" maxLength={4000} />
        <PromptInput.Footer>
          <PromptInput.Submit />
        </PromptInput.Footer>
      </PromptInput>
    </div>
  );
}`
};

export const insertMentionDemo = {
  type: 'code',
  code: `function InsertMentionPromptInput() {
  const composer = React.useRef(null);

  // No <PromptInput.Mentions> here: typing @ does nothing, but chips added
  // from code still render with their icon.
  return (
    <div style={{ width: 420 }}>
      <PromptInput
        actionsRef={composer}
        onSubmit={(message, event) => event.currentTarget.reset()}
      >
        <PromptInput.Editor placeholder="Write a message…" />
        <PromptInput.Footer>
          <Button
            type="button"
            variant="ghost"
            color="neutral"
            size="small"
            onClick={() =>
              composer.current?.insertMention({
                id: 'prompt-input',
                label: 'PromptInput',
                type: 'component',
                icon: <Component size={16} strokeWidth={1.5} />
              })
            }
          >
            Add PromptInput
          </Button>
          <Button
            type="button"
            variant="ghost"
            color="neutral"
            size="small"
            onClick={() => composer.current?.clear()}
          >
            Clear
          </Button>
          <PromptInput.Submit />
        </PromptInput.Footer>
      </PromptInput>
    </div>
  );
}`
};
